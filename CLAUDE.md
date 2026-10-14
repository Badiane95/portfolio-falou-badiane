# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) lorsqu'il travaille sur le code de ce dépôt.

## Projet

Portfolio personnel de Falou Badiane (Forward Deployed Engineer – Ingénieur IA en alternance, Master IID à Paris 8). Le contenu suit son CV, publié dans `client/public/CV-Falou-Badiane.pdf`. Tous les textes visibles par l'utilisateur, les messages de validation et les commentaires du code sont en **français** ; rédige aussi en français tout nouveau texte d'interface.

Le dépôt a été généré à partir d'un **template web full-stack Manus** (client React + Vite, serveur Express + tRPC, Drizzle/MySQL). Une grande partie de `server/_core/` est de l'infrastructure de template que le portfolio n'utilise pas (OAuth Manus, chat LLM, génération d'images, stockage S3, cartes, transcription vocale). Le seul code backend propre au portfolio est le routeur `contact` dans `server/routers.ts`.

## Commandes

Le gestionnaire de paquets est **pnpm**. `pnpm-lock.yaml` est désynchronisé de `package.json`, donc une installation avec lockfile figé échoue. Utilise `pnpm install --no-frozen-lockfile`, qui est aussi la commande lancée par `vercel.json`.

```bash
pnpm dev        # tsx watch server/_core/index.ts — Express + middleware Vite (HMR), port 3000 ou le suivant libre
pnpm build      # vite build → dist/public, puis esbuild server/_core/index.ts → dist/index.js
pnpm start      # NODE_ENV=production node dist/index.js (sert dist/public + l'API)
pnpm check      # tsc --noEmit (client, api, serveur et shared dans un seul projet)
pnpm test       # vitest run — uniquement server/**/*.test.ts / *.spec.ts, environnement node
pnpm format     # prettier --write . (pas d'ESLint dans ce dépôt)
pnpm db:push    # drizzle-kit generate && migrate — nécessite DATABASE_URL

# Un seul fichier de test / un seul test par son nom
pnpm exec vitest run server/contact.test.ts
pnpm exec vitest run server/contact.test.ts -t "invalid email"
```

Le README mentionne `pnpm preview`, mais ce script n'existe pas.

`dist/` est versionné dans git : lancer `pnpm build` produit donc des modifications suivies.

## Architecture

### Points d'entrée du serveur (à garder synchronisés)
Il y a trois points d'entrée Express. Quand tu ajoutes une route API, déclare-la dans les deux premiers, avec les mêmes middlewares (`express.json({ limit: "100kb" })`, tRPC avec `allowBatching: false`) :
- `server/_core/index.ts` est utilisé par `pnpm dev`/`pnpm start`. Il monte l'OAuth (`/api/oauth/callback`) et tRPC (`/api/trpc`), puis soit le middleware Vite (dev), soit `dist/public` en statique avec un repli SPA (prod).
- `api/index.ts` est la **fonction serverless Vercel**. Il reprend le même câblage de l'API, sans servir de fichiers statiques, et exporte l'app. `vercel.json` redirige `/api/*` vers ce fichier et tous les autres chemins (hors assets) vers `/index.html`.
- `server/index.ts` est un ancien serveur purement statique. Aucun script ne l'utilise.

**Imports côté serveur (`api/`, `server/`, `shared/`, `drizzle/`) : toujours relatifs et avec l'extension `.js`** (`import { appRouter } from "../server/routers.js"`), jamais d'alias `@shared/…`. La fonction Vercel est compilée fichier par fichier par @vercel/node et chargée en ESM natif (`"type": "module"`) : un import sans extension ou un alias fait échouer son chargement (`ERR_MODULE_NOT_FOUND`), et `pnpm check` ne le détecte pas (`moduleResolution: "bundler"`). Pour vérifier, lance `vercel build` dans une copie du dépôt et charge `.vercel/output/functions/api/index.func/api/index.js`. Le code client garde les alias `@/` et `@shared/`.

### tRPC (typage de bout en bout)
- Les procédures sont définies dans `server/routers.ts` (`appRouter`), avec `publicProcedure` / `protectedProcedure` / `adminProcedure` issus de `server/_core/trpc.ts`. Le transformeur superjson est utilisé des deux côtés.
- `server/_core/context.ts` tente une authentification via le SDK Manus à chaque requête ; `ctx.user` vaut `null` si l'utilisateur n'est pas authentifié.
- Le client importe directement le **type** `AppRouter` depuis `server/routers.ts` (`client/src/lib/trpc.ts`). `client/src/main.tsx` configure `httpLink` (pas de batching : le serveur le refuse) vers `/api/trpc` et redirige vers la connexion Manus quand une requête ou une mutation échoue avec `UNAUTHED_ERR_MSG`.
- Les tests appellent les procédures avec `appRouter.createCaller(ctx)` et un contexte construit à la main, en simulant `notifyOwner`, `sendEmail` et `fetch` : aucun test n'appelle le réseau (voir `server/contact.test.ts`, `server/emailService.test.ts`, `server/rateLimit.test.ts`).

### Flux du formulaire de contact
Le formulaire (`client/src/components/ContactForm.tsx`, page `/contact`) et la procédure `contact.send` (`server/routers.ts`) valident avec le **même schéma zod**, `shared/contact.ts` (champs `.trim()`, longueurs maximales, sujet sur une ligne, messages en français). La procédure :
1. applique une limitation de débit par IP (5 tentatives / 10 min, `server/rateLimit.ts`), en mémoire donc propre à chaque instance serverless : la vraie protection est une règle de limitation du pare-feu Vercel ;
2. renvoie un faux succès sans rien envoyer si le champ piège `website` est rempli ou si le formulaire est envoyé moins de 3 s après son ouverture (`elapsedMs`) ;
3. lance en parallèle les canaux configurés : `sendEmail()` vers `OWNER_EMAIL` (avec `reply_to` = adresse du visiteur et un gabarit dont **toutes les valeurs sont échappées**, `server/_core/emailService.ts`) et, si Forge est configuré, `notifyOwner()` (notification Manus). Aucun e-mail n'est envoyé à l'adresse saisie par le visiteur : n'en rajoute pas, cela ferait du formulaire un relais d'e-mails ;
4. renvoie un succès si au moins un canal a abouti, sinon une erreur 500 en français. Le client affiche alors un lien `mailto:` pré-rempli avec le message, pour que le visiteur puisse quand même écrire.

L'e-mail part par **Resend** (`RESEND_API_KEY`, à définir dans les variables d'environnement Vercel) ou, à défaut, par l'API Manus Forge (`BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`). Sans aucun des deux, chaque envoi échoue et le journal du serveur l'indique (`[Contact] Aucun canal d'envoi configuré`). Sans domaine vérifié chez Resend, l'expéditeur par défaut `onboarding@resend.dev` ne peut écrire qu'à l'adresse du compte Resend : `OWNER_EMAIL` doit être cette adresse.

### Environnement
`server/_core/env.ts` lit : `VITE_APP_ID`, `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OWNER_EMAIL` (par défaut l'adresse publique du site), `RESEND_API_KEY`, `RESEND_API_URL` (pour pointer vers un faux service en test) et `CONTACT_FROM_EMAIL` (expéditeur, par défaut `onboarding@resend.dev`). Le client lit les variables `VITE_*` (par ex. `VITE_OAUTH_PORTAL_URL`), et l'`envDir` de Vite est la racine du dépôt. La base de données est facultative : `getDb()` dans `server/db.ts` renvoie `null` sans `DATABASE_URL`. Le schéma Drizzle (`drizzle/schema.ts`) ne contient que la table `users` du template.

### Client
- La racine Vite est `client/`. Les alias de chemin sont `@/` → `client/src/` et `@shared/` → `shared/` ; ils sont définis dans `vite.config.ts`, `vitest.config.ts` et `tsconfig.json`.
- **Tout le contenu** (profil, poste actuel, savoir-faire, projets, compétences, expérience, formation, langues, chiffres) vit dans `client/src/data/portfolio.ts`. Les pages ne contiennent pas de texte de contenu en dur. L'explorateur de compétences relie une techno aux projets via le tableau `stack` de chaque projet, et aux employeurs via `skillsAtWork` : les noms doivent correspondre exactement à ceux de `skillGroups`.
- Le routage utilise **wouter 3.7.1 avec un patch pnpm** (`patches/wouter@3.7.1.patch`, qui enregistre les chemins des routes dans `window.__WOUTER_ROUTES__`). Il se fait par chemins (`/projects`, `/about`, …), et les liens directs fonctionnent grâce aux replis SPA du serveur et de Vercel. Les routes sont déclarées dans `client/src/App.tsx`. La navigation interne passe par `<Link>` de wouter.
- `components/Layout.tsx` enveloppe toutes les pages : barre de navigation, pied de page, palette de commandes (⌘K / Ctrl+K, `CommandPalette.tsx`) et transitions de page. `App.tsx` passe la même `location` à `<Layout>` et à `<Switch>` pour que la page sortante garde son contenu pendant l'animation de sortie (`AnimatePresence mode="wait"`).
- La page Parcours (`pages/About.tsx`) présente `experience` et `education` comme un `git log --graph` (`components/parcours/GitLog.tsx`) : une branche « formation », une branche « entreprise » qui part de l'étape de formation précédant sa première étape, étapes triées par `start` (AAAA-MM, obligatoire sur chaque entrée), `current: true` pour les étapes en cours, filtres par branche et détails dépliables. `CefrScale` (langues, champ `cefr`) et `WeekRhythm` (champ `rhythm` du Master) complètent la page.
- L'état « projet ouvert » de `/projects` est porté par le fragment d'URL (`/projects#slug`, lu par `hooks/useHash.ts`). Les autres pages et la palette y renvoient avec ce format.
- Les animations utilisent Framer Motion. Les briques réutilisables sont dans `components/motion/` : révélations par masque, texte qui se décode, compteurs, et la grille de points en canvas du hero. `<MotionConfig reducedMotion="user">` dans `App.tsx` et une règle CSS dans `index.css` respectent le réglage « réduire les animations » ; tout nouvel effet basé sur `requestAnimationFrame` doit vérifier `useReducedMotion()` lui-même.
- Le style utilise Tailwind CSS v4 via `@tailwindcss/vite`, avec **trois thèmes de couleur** (clair, bleu nuit, noir) choisis par le visiteur ; le bleu nuit est le thème par défaut. Les couleurs sont des tokens CSS définis par thème dans `client/src/index.css` ; les composants n'utilisent que les classes de tokens, jamais de couleur en dur. Avant toute modification de couleur ou de thème, utilise le skill `.claude/skills/theme-system` et lance son script `node .claude/skills/theme-system/scripts/check-themes.mjs`. Les classes `.eyebrow` / `.link-underline` sont aussi dans `index.css`. Les polices sont Geist et Geist Mono (Google Fonts). Les composants shadcn/ui (style « new-york », `components.json`) sont générés dans `client/src/components/ui/`.
- Les fichiers statiques (CV en PDF, images des projets) se trouvent dans `client/public/`. Les images des projets sont toutes locales (`client/public/assets/projects/`) : deux vraies captures (jeu Unity, pastilles vidéo) et des illustrations SVG dessinées à la main (schémas et maquettes sobres, palette du site, 1200×750) ; garde ce style plutôt que des images générées par IA. `vercel.json` met `/assets/*` en cache un an (`immutable`) : pour modifier une image, donne-lui un nouveau nom de fichier. `ProjectImage.tsx` affiche un visuel de secours si une image ne se charge pas.
- `vite.config.ts` ne garde que deux plugins Manus, limités au serveur de dev (`apply: "serve"`) : jsx-loc et un collecteur de debug qui écrit les logs du navigateur dans `.manus-logs/`. Le runtime Manus a été retiré : il ouvrait une faille XSS par `postMessage`. N'ajoute aucun script tiers qui écoute `message` sans vérifier `event.origin`.

### Déploiement
**Avant toute mise en production** (fusion dans `main`), lance une inspection du code avec le skill `.claude/skills/inspection-predeploiement` : un sous-agent inspecteur lance `scripts/verifier.mjs` (types, tests, thèmes, imports ESM, chargement réel de la fonction Vercel, cohérence des données, secrets, build), relit le diff, puis délègue chaque anomalie prouvée à un sous-agent correcteur et revérifie sa correction.

Vercel est la cible active (`vercel.json` ; dossier de sortie `dist/public`, API dans `api/index.ts`). `vercel.json` pose sur toutes les pages des en-têtes de sécurité (`frame-ancestors 'none'`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`, `nosniff`, `Referrer-Policy`) ; ils ne s'appliquent pas à `pnpm start`. La CSP ne contient que `frame-ancestors` : une CSP de scripts devra autoriser le script de thème en ligne de `index.html` par son hash. Le workflow GitHub Pages se trouve dans `github/workflows/deploy.yml`, **et non** dans `.github/`, donc GitHub Actions ne l'exécute jamais. De toute façon, un déploiement statique sur GitHub Pages ne pourrait pas servir l'API tRPC.

`todo.md` contient la liste des fonctionnalités (en français).
