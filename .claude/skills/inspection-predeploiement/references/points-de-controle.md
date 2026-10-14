# Points de contrôle du portfolio

Ne parcours que les sections touchées par le diff. Chaque point dit **ce qui casse** quand la règle n'est pas respectée : c'est ce qui sert à juger la gravité. `CLAUDE.md` reste la référence complète.

## API serveur et fonction Vercel

- **Imports en `.js`, sans alias**, dans `api/`, `server/`, `shared/` et `drizzle/`. Sinon la fonction Vercel ne se charge pas (`ERR_MODULE_NOT_FOUND`) et toute l'API répond 500. C'est un bloquant, que `verifier.mjs` détecte.
- **Deux points d'entrée à garder identiques** : `server/_core/index.ts` (pour `pnpm dev` / `pnpm start`) et `api/index.ts` (pour Vercel). Une route, un middleware ou une option ajoutés dans l'un seulement fonctionnent en local mais pas en production.
- Les deux gardent `express.json({ limit: "100kb" })` et tRPC avec `allowBatching: false`. Le client utilise `httpLink` sans batching. Réactiver le batching d'un seul côté casse tous les appels.
- Une nouvelle procédure publique doit valider ses entrées avec zod et ne doit pas exposer d'erreur interne brute.

## Formulaire de contact

- Le client (`ContactForm.tsx`) et le serveur (`contact.send`) valident avec **le même schéma**, `shared/contact.ts`. Deux schémas finissent par diverger : un message accepté par le client est alors rejeté par le serveur avec une erreur incompréhensible.
- **Aucun e-mail n'est envoyé à l'adresse saisie par le visiteur**, ni en copie ni en confirmation. Sinon le formulaire devient un relais de spam vers n'importe qui. C'est un bloquant.
- Toutes les valeurs du visiteur sont **échappées** dans le gabarit HTML (`escapeHtml`), et l'objet tient sur une ligne. Sinon : injection HTML dans la boîte du propriétaire ou injection d'en-têtes.
- L'anti-spam est conservé : champ piège `website`, durée minimale `elapsedMs` de 3 s et limite de 5 envois par IP sur 10 min.
- Un succès n'est renvoyé **que si le message est réellement parti** (Resend ou Forge). Un faux succès fait perdre des messages sans que personne le sache. En cas d'échec, le client propose le lien `mailto:`.
- Aucune clé d'API dans le code client ni dans une variable `VITE_*`, car tout ce qui est préfixé `VITE_` est publié dans le bundle.
- Les tests (`server/contact.test.ts`, `server/emailService.test.ts`) simulent `fetch`, `notifyOwner` et `sendEmail`. Un test qui appelle le vrai réseau est une anomalie.

## Sécurité

- Pas de script tiers qui écoute `message` (`postMessage`) sans vérifier `event.origin`. C'est la faille XSS qui a fait retirer le runtime Manus.
- Pas de `dangerouslySetInnerHTML` alimenté par une donnée non maîtrisée.
- Les liens externes ouverts dans un nouvel onglet portent `rel="noopener noreferrer"`.
- Les en-têtes de `vercel.json` (`frame-ancestors 'none'`, `X-Frame-Options`, `COOP`, `nosniff`, `Referrer-Policy`) ne doivent pas disparaître. Une CSP de scripts ajoutée doit autoriser le script de thème en ligne de `index.html` par son hash, sinon le thème n'est plus posé avant le rendu.
- Aucun `.env*` ni secret suivi par git ou présent dans un nouveau fichier non ignoré (détecté par `verifier.mjs`). `.gitignore` ignore tous les `.env*` sauf `.env.example`.

## Contenu et données personnelles

- Tout le contenu vit dans `client/src/data/portfolio.ts`. Du texte de contenu en dur dans une page finit par contredire le reste du site.
- Les noms dans `stack` (projets) et les clés de `skillsAtWork` correspondent **exactement** à ceux de `skillGroups`. Sinon l'explorateur de compétences n'affiche pas le lien. `verifier.mjs` le détecte.
- **Une seule adresse e-mail publique** : `profile.email`, `CONTACT_EMAIL` (`client/src/const.ts`) et le `OWNER_EMAIL` par défaut (`server/_core/env.ts`) sont identiques (détecté par `verifier.mjs`). Pense aussi aux CV en PDF de `client/public/`, que le script ne lit pas : vérifie-les avec `pdftotext`.
- Le contexte d'un projet est exact (projet en entreprise, académique ou personnel) et cohérent avec `experience` / `education` : mêmes noms d'employeur, mêmes périodes.
- Pas de numéro de téléphone ni d'adresse postale publiés sans accord explicite de l'utilisateur. Contrôle les nouveaux PDF avec `pdftotext`.
- Les textes visibles et les messages d'erreur sont en français.
- Les liens vers un projet utilisent le format `/projects#slug`, et le slug existe.

## Thèmes, animations et accessibilité

- Les composants n'utilisent que des classes de tokens (`bg-card`, `text-primary`…), jamais de couleur en dur. Une couleur en dur casse au moins un des trois thèmes. `check-themes.mjs` le détecte.
- Chaque fond va avec son texte prévu : `bg-primary` avec `text-primary-foreground`, `bg-foreground` avec `text-background`.
- Le thème par défaut est **nuit** (bleu). Il est déclaré à quatre endroits qui doivent concorder : `DEFAULT_THEME` dans `lib/themes.ts`, le repli du script en ligne de `index.html`, les attributs de `<html>` et `meta theme-color`.
- Tout effet basé sur `requestAnimationFrame` vérifie `useReducedMotion()`.
- Les champs de formulaire gardent `label`, `aria-invalid` et `aria-describedby`, et les messages d'erreur gardent `role="alert"`.

## Images et fichiers statiques

- `vercel.json` met `/assets/*` en cache un an (`immutable`). **Une image modifiée doit changer de nom de fichier**, sinon les visiteurs gardent l'ancienne pendant un an.
- Les images de projets sont locales, dans `client/public/assets/projects/`. Ce sont des illustrations SVG sobres (1200×750, palette du site) ou de vraies captures, jamais des images générées par IA.
- Chaque `image` et le `cv` référencés existent dans `client/public/` (détecté par `verifier.mjs`).

## Build et déploiement

- Vercel installe avec `pnpm install --no-frozen-lockfile` : `pnpm-lock.yaml` est désynchronisé de `package.json`. Une nouvelle dépendance doit figurer dans `package.json`.
- `dist/` est versionné, mais Vercel le reconstruit. Les fichiers de `dist/` modifiés par un build local ne doivent pas partir dans un commit de correctif.
- Le workflow GitHub Pages est dans `github/workflows/` (et non `.github/`), donc il ne s'exécute pas. Un site statique ne pourrait de toute façon pas servir l'API.
