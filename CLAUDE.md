# CLAUDE.md

Ce fichier guide Claude Code (claude.ai/code) lorsqu'il travaille sur le code de ce dépôt.

## Projet

Portfolio personnel de Falou Badiane (étudiant en BUT MMI, développeur web et automatisation). Tous les textes visibles par l'utilisateur, les messages de validation et les commentaires du code sont en **français** ; rédige aussi en français tout nouveau texte d'interface.

Le dépôt a été généré à partir d'un **template web full-stack Manus** (client React + Vite, serveur Express + tRPC, Drizzle/MySQL). Une grande partie de `server/_core/` est de l'infrastructure de template que le portfolio n'utilise pas (OAuth Manus, chat LLM, génération d'images, stockage S3, cartes, transcription vocale). Le seul code backend propre au portfolio est le routeur `contact` dans `server/routers.ts`.

## Commandes

Le gestionnaire de paquets est **pnpm**. `pnpm-lock.yaml` est désynchronisé de `package.json`, donc une installation avec lockfile figé échoue. Utilise `pnpm install --no-frozen-lockfile`, qui est aussi la commande lancée par `vercel.json`.

```bash
pnpm dev        # tsx watch server/_core/index.ts — Express + middleware Vite (HMR), port 3000 ou le suivant libre
pnpm build      # vite build → dist/public, puis esbuild server/_core/index.ts → dist/index.js
pnpm start      # NODE_ENV=production node dist/index.js (sert dist/public + l'API)
pnpm check      # tsc --noEmit (client, serveur et shared dans un seul projet)
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
Il y a trois points d'entrée Express. Quand tu ajoutes une route API, déclare-la dans les deux premiers :
- `server/_core/index.ts` est utilisé par `pnpm dev`/`pnpm start`. Il monte l'OAuth (`/api/oauth/callback`), le chat (`/api/chat`) et tRPC (`/api/trpc`), puis soit le middleware Vite (dev), soit `dist/public` en statique avec un repli SPA (prod).
- `api/index.ts` est la **fonction serverless Vercel**. Il reprend le même câblage de l'API, sans servir de fichiers statiques, et exporte l'app. `vercel.json` redirige `/api/*` vers ce fichier et tous les autres chemins (hors assets) vers `/index.html`.
- `server/index.ts` est un ancien serveur purement statique. Aucun script ne l'utilise.

### tRPC (typage de bout en bout)
- Les procédures sont définies dans `server/routers.ts` (`appRouter`), avec `publicProcedure` / `protectedProcedure` / `adminProcedure` issus de `server/_core/trpc.ts`. Le transformeur superjson est utilisé des deux côtés.
- `server/_core/context.ts` tente une authentification via le SDK Manus à chaque requête ; `ctx.user` vaut `null` si l'utilisateur n'est pas authentifié.
- Le client importe directement le **type** `AppRouter` depuis `server/routers.ts` (`client/src/lib/trpc.ts`). `client/src/main.tsx` configure `httpBatchLink` vers `/api/trpc` et redirige vers la connexion Manus quand une requête ou une mutation échoue avec `UNAUTHED_ERR_MSG`.
- Les tests appellent les procédures avec `appRouter.createCaller(ctx)` et un contexte construit à la main, en mockant `./_core/notification` (voir `server/contact.test.ts`).

### Flux du formulaire de contact
Le formulaire (`client/src/components/ContactForm.tsx`, page `/contact`) valide les champs côté client avec les mêmes règles que le serveur, puis appelle `trpc.contact.send`. Cette procédure applique une validation zod (messages en français), puis :
1. `notifyOwner()` envoie une notification Manus.
2. `sendEmail()` (`server/_core/emailService.ts`) envoie une confirmation au visiteur.
3. `sendEmail()` envoie le message à `OWNER_EMAIL`.

Ces deux fonctions d'envoi font un POST vers l'API Manus Forge (`BUILT_IN_FORGE_API_URL` / `BUILT_IN_FORGE_API_KEY`). Un échec d'envoi est seulement journalisé comme avertissement, et la mutation renvoie quand même un succès. Sans les variables d'environnement Forge, `sendEmail` renvoie `false`, ce qui explique que les tests passent sans accès réseau.

### Environnement
`server/_core/env.ts` lit : `VITE_APP_ID`, `JWT_SECRET`, `DATABASE_URL`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OWNER_EMAIL`. Le client lit les variables `VITE_*` (par ex. `VITE_OAUTH_PORTAL_URL`), et l'`envDir` de Vite est la racine du dépôt. La base de données est facultative : `getDb()` dans `server/db.ts` renvoie `null` sans `DATABASE_URL`. Le schéma Drizzle (`drizzle/schema.ts`) ne contient que la table `users` du template.

### Client
- La racine Vite est `client/`. Les alias de chemin sont `@/` → `client/src/` et `@shared/` → `shared/` ; ils sont définis dans `vite.config.ts`, `vitest.config.ts` et `tsconfig.json`.
- **Tout le contenu** (profil, projets, compétences, expérience, formation, chiffres) vit dans `client/src/data/portfolio.ts`. Les pages ne contiennent pas de texte de contenu en dur. L'explorateur de compétences relie une techno aux projets via le tableau `stack` de chaque projet : les noms doivent correspondre exactement à ceux de `skillGroups`.
- Le routage utilise **wouter 3.7.1 avec un patch pnpm** (`patches/wouter@3.7.1.patch`, qui enregistre les chemins des routes dans `window.__WOUTER_ROUTES__`). Il se fait par chemins (`/projects`, `/about`, …), et les liens directs fonctionnent grâce aux replis SPA du serveur et de Vercel. Les routes sont déclarées dans `client/src/App.tsx`. La navigation interne passe par `<Link>` de wouter.
- `components/Layout.tsx` enveloppe toutes les pages : barre de navigation, pied de page, palette de commandes (⌘K / Ctrl+K, `CommandPalette.tsx`) et transitions de page. `App.tsx` passe la même `location` à `<Layout>` et à `<Switch>` pour que la page sortante garde son contenu pendant l'animation de sortie (`AnimatePresence mode="wait"`).
- L'état « projet ouvert » de `/projects` est porté par le fragment d'URL (`/projects#slug`, lu par `hooks/useHash.ts`). Les autres pages et la palette y renvoient avec ce format.
- Les animations utilisent Framer Motion. Les briques réutilisables sont dans `components/motion/` : révélations par masque, texte qui se décode, compteurs, et la grille de points en canvas du hero. `<MotionConfig reducedMotion="user">` dans `App.tsx` et une règle CSS dans `index.css` respectent le réglage « réduire les animations » ; tout nouvel effet basé sur `requestAnimationFrame` doit vérifier `useReducedMotion()` lui-même.
- Le style utilise Tailwind CSS v4 via `@tailwindcss/vite`. Les tokens du thème (papier `#f6f6f3`, encre `#111110`, un seul accent bleu `#2b3fe0`) et les classes `.eyebrow` / `.link-underline` sont dans `client/src/index.css`. Les polices sont Geist et Geist Mono (Google Fonts). Les composants shadcn/ui (style « new-york », `components.json`) sont générés dans `client/src/components/ui/`.
- Les fichiers statiques (CV en PDF, images des projets) se trouvent dans `client/public/`. Plusieurs images de projets sont hébergées sur des CDN externes ; `ProjectImage.tsx` affiche un visuel de secours si elles ne se chargent pas.
- `vite.config.ts` inclut des plugins propres à Manus : un plugin runtime, jsx-loc et un collecteur de debug qui écrit les logs du navigateur dans `.manus-logs/` en dev. C'est de la plomberie de template.

### Déploiement
Vercel est la cible active (`vercel.json` ; dossier de sortie `dist/public`, API dans `api/index.ts`). Le workflow GitHub Pages se trouve dans `github/workflows/deploy.yml`, **et non** dans `.github/`, donc GitHub Actions ne l'exécute jamais. De toute façon, un déploiement statique sur GitHub Pages ne pourrait pas servir l'API tRPC.

`todo.md` contient la liste des fonctionnalités (en français).
