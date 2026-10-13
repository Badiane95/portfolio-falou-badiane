# Audit de mise en production — portfolio-falou-badiane

- **Version auditée :** commit `2cd7c4c` (branche `claude/fervent-goodall-kw4isa`, refonte du design).
- **Date :** 13/10/2026.
- **Contexte déduit du dépôt** (non fourni) : site vitrine (portfolio), déployé sur Vercel (`vercel.json`). **L'URL de production n'est pas connue.**
- **Méthode :**
  - cinq audits en lecture seule (front, back, sécurité, déploiement, qualité) ;
  - des tests réels sur un build de production servi en local, sans aucune variable d'environnement ;
  - pour le formulaire de contact, un faux service d'e-mail local (aucun e-mail réel envoyé) ;
  - une contre-vérification de chaque bloquant et des points OK sensibles par un relecteur en contexte neuf.

> Après l'audit, le commit `c0eca00` (thèmes de couleur, contenu du nouveau CV, skill `theme-system`) a été ajouté à la demande du propriétaire. Il ne touche ni au serveur ni au déploiement. Il corrige :
> - le contenu daté (poste et formation) ;
> - la date de naissance présente dans le CV lié depuis le site, remplacé par une version sans téléphone, adresse ni date de naissance ;
> - le saut de niveau de titre sur /skills ;
> - une phrase inexacte de `CLAUDE.md`.
>
> Ce commit n'a pas été ré-audité, sauf par les tests décrits en section 5.

## 1. Verdict

> **Mise à jour du 13/10/2026 :** les 4 bloquants sont corrigés et vérifiés (voir la section 8). Le verdict **après corrections** est **GO AVEC RÉSERVES**. Les réserves sont listées en section 8. Le verdict d'origine, sur la version `2cd7c4c`, est conservé ci-dessous.

**NO-GO (version `2cd7c4c`).** Le constat bloquant suivant est confirmé par un `vercel build` réel : l'API ne se charge pas sur Vercel, donc le formulaire de contact ne marche pas en production. Il y a en plus une faille XSS exploitable, confirmée par une preuve d'exploitation.

## 2. Synthèse par domaine

| Domaine | Statut | Bloquant | Important | Mineur |
|---|---|---|---|---|
| Front | À corriger | 0 | 6 | 11 |
| Back | Bloquant | 1 | 4 | 4 |
| Sécurité | Bloquant | 2 | 3 | 1 |
| Déploiement | Bloquant | 1 | 5 | 6 |
| Qualité | À corriger | 0 | 4 | 4 |
| **Total** | | **4** | **22** | **26** |

Effort : **S** = moins d'une heure, **M** = une demi-journée à une journée, **L** = plus d'une journée.

## 3. Bloquants confirmés

### BLQ-1 · Déploiement · La fonction Vercel `api/index.ts` ne se charge pas : `/api/trpc/*` est hors service et le formulaire de contact aussi
- **Cause :**
  - `package.json` contient `"type": "module"` ;
  - `api/index.ts:4-7` et toute la chaîne `server/` importent sans extension (`import { appRouter } from "../server/routers";`) ;
  - l'alias tsconfig `@shared/*` est utilisé à l'exécution (`server/routers.ts:1`, `server/_core/trpc.ts:1`, `oauth.ts:1`, `sdk.ts:1-2`) ;
  - @vercel/node compile fichier par fichier, sans regrouper le code ni réécrire ces imports.
- **Preuves :**
  - `node --experimental-strip-types -e "import('./api/index.ts')"` → `ERR_MODULE_NOT_FOUND Cannot find module '…/server/routers' imported from …/api/index.ts`.
  - Contre-vérification avec un vrai `vercel build` (vercel 63.1.2, @vercel/node 23.0.1, copie du dépôt, aucun appel à Vercel) :
    - le build sort en `"status": "ok"` ;
    - mais `.vercel/output/functions/api/index.func/api/index.js` garde `from "../server/routers"`, et le dossier `shared/` n'est pas inclus dans la fonction ;
    - au chargement sous Node 22 et Node 24 (version de la runtime Vercel), on obtient `ERR_MODULE_NOT_FOUND`.
  - Le drapeau interne `VERCEL_API_FUNCTION_BUNDLING` ne change rien (même erreur).
- **Correctif :** regrouper l'API en un seul fichier avec esbuild au build (par exemple `api/index.ts` qui importe un bundle généré), ou passer à des imports relatifs en `.js` avec chemins relatifs à la place de `@shared`. Ajouter `api/` au `include` de `tsconfig.json`. Valider par `vercel build`, puis par un appel à `/api/trpc/system.health` sur un déploiement de prévisualisation.
- **Effort :** M.

### BLQ-2 · Sécurité · XSS par `postMessage` dans le runtime Manus injecté en production
- **Cause :**
  - `vite.config.ts:153` ajoute `vitePluginManusRuntime()` sans condition ;
  - le plugin (`node_modules/vite-plugin-manus-runtime/dist/index.js`, sans `apply: "serve"`) injecte dans `index.html` un script en ligne de 366 757 octets ;
  - ce script écoute `message` sans vérifier `event.origin` et expose `refresh` (`window.location.href = path`) et `setCookie` (`document.cookie = …`), actifs dès le chargement ;
  - il n'y a ni CSP ni `frame-ancestors` (`vercel.json` ne définit que `Cache-Control` sur `/assets`).
- **Preuve :** preuve d'exploitation inoffensive (`scratchpad/audit/e2e/xss-poc.mjs`). Une page d'origine `http://attaquant.test` ouvre `http://localhost:4173/contact` puis envoie `{type:"SpacePreviewerChannel",payload:{type:"refresh",to:"content",payload:{path:"javascript:document.title='XSS:'+document.domain"}}}`. Résultat : `titre de la page victime après le message : XSS:localhost`. L'audit front a obtenu le même résultat avec une `alert` (popup), et en iframe.
- **Correctif :**
  - retirer `vitePluginManusRuntime()` (et `jsxLocPlugin()`) du build, ou les limiter à `command === "serve"` ;
  - vérifier que `grep -c manus-runtime dist/public/index.html` renvoie 0 ;
  - ajouter une CSP avec `frame-ancestors 'none'` (voir IMP-S1).
- **Effort :** S.

### BLQ-3 · Back · `/api/chat` : une passerelle LLM publique, facturée sur la clé Forge
*Bloquant dès que `BUILT_IN_FORGE_API_KEY` est définie, ce qu'exige le formulaire de contact pour fonctionner.*
- **Cause :**
  - `server/_core/chat.ts:95-113`, monté dans `server/_core/index.ts:40` et `api/index.ts:18` ;
  - aucune authentification, aucune limite de débit ni de jetons ;
  - `messages` est entièrement contrôlé par le client, rôle `system` compris ;
  - `openai.chat("gpt-4o")`, jusqu'à 5 appels facturés par requête (`stepCountIs(5)`) ;
  - le front n'utilise pas cette route (grep `/api/chat|useChat` dans `client/src` : aucun résultat).
- **Preuves :**
  - Sur l'instance avec un faux service Forge local : `curl -X POST -H 'Origin: https://evil.example' /api/chat -d '{"messages":[{"role":"user","content":"Bonjour"}]}'` renvoie `200 text/event-stream`, et le faux service reçoit `POST /v1/chat/completions | model: gpt-4o | auth: Bearer <clé>`.
  - La clé utilisée est la même que celle du formulaire (`chat.ts:20-27` et `env.ts`).
  - Contre-vérification : l'outil `calculate` (`Function(...)`) n'est **pas** exploitable, car la ligne 69 filtre tout caractère hors de `[0-9+\-*/().%\s]`. Le risque est financier, pas une exécution de code.
- **Correctif :** supprimer `registerChatRoutes` des deux points d'entrée, ainsi que `chat.ts`, `patchedFetch.ts` et les dépendances `ai` et `@ai-sdk/*`.
- **Effort :** S.

### BLQ-4 · Sécurité · Le formulaire de contact peut servir de relais d'e-mails HTML vers n'importe quelle adresse
*Bloquant dès que l'envoi d'e-mails est activé.*
- **Cause :**
  - `server/routers.ts:45-51` envoie une « Confirmation de réception - Portfolio Falou Badiane » à l'adresse saisie (`to: input.email`) ;
  - `server/_core/emailService.ts:78`, `:81` et `:130-139` insèrent le nom, le sujet et le message dans le HTML **sans échappement** ;
  - il n'y a ni limitation de débit, ni captcha, ni champ piège ;
  - le batching tRPC est actif.
- **Preuves** (instance avec faux service Forge local) :
  - Avec un nom `Audit <b>Test</b>`, le faux service reçoit `POST /email/send to: visiteur@example.test` dont le HTML contient `Audit <b>Test</b>`. L'e-mail au propriétaire contient aussi `<script>x</script>`.
  - 30 POST consécutifs donnent `200 ×30` et 30 confirmations envoyées à `cible@example.test`, sans aucune erreur 429.
  - Contre-vérification : un seul POST `contact.send,…` contenant un lot de 50 appels donne 50 confirmations.
  - Limites constatées : un destinataire par appel, et un objet fixe. Les champs sont plafonnés en pratique par `notifyOwner`, à 1 170 caractères pour le nom et environ 20 000 pour le contenu.
- **Correctif :**
  - supprimer l'e-mail de confirmation, ou n'y mettre aucun contenu saisi par le visiteur ;
  - échapper le HTML de toutes les valeurs ;
  - ajouter `.trim().max()` sur chaque champ zod ;
  - désactiver le batching côté serveur ;
  - limiter le débit (pare-feu Vercel ou Upstash Ratelimit) ;
  - ajouter un champ piège et Turnstile ;
  - mettre le visiteur en `reply-to` de l'e-mail du propriétaire.
- **Effort :** M.

## 4. Constats Importants et Mineurs

### Importants

**Front**
- **IMP-F1 · Script Umami cassé : erreur console sur toutes les pages.**
  - Preuve : `client/index.html:23-26` est servi tel quel avec `src="%VITE_ANALYTICS_ENDPOINT%/umami"` (avertissement de Vite au build). Playwright : `400 …/%VITE_ANALYTICS_ENDPOINT%/umami` puis `Refused to execute script`.
  - Correctif : supprimer la balise ou ne l'injecter que si les variables sont définies.
  - Effort : S.
- **IMP-F2 · Aucune mention légale ni politique de confidentialité, alors que le formulaire collecte nom, e-mail et message.**
  - Preuve : `grep -rniE "mentions l|confidentialit|rgpd" client/src` ne trouve rien.
  - Correctif : créer une page de mentions légales (hébergeur Vercel, LCEN art. 6-III) et une politique de confidentialité (sous-traitants, durée, droits), avec des liens dans le pied de page.
  - Effort : S.
- **IMP-F3 · L'erreur de validation du serveur s'affiche en JSON brut.**
  - Preuve : avec `a@b.c` (accepté par la regex de `ContactForm.tsx:16`, refusé par `z.string().email()` dans `routers.ts:28`), l'alerte affiche `[ { "origin": "string", "code": "invalid_format", … } ]`.
  - Correctif : un schéma zod partagé dans `shared/`, plus un `errorFormatter` qui renvoie les erreurs par champ.
  - Effort : S.
- **IMP-F4 · Défilement horizontal sur /skills sous 375 px.**
  - Preuve : à 360 px, `scrollWidth` vaut 374 (grille de `SkillExplorer`, `truncate` dans l'aside).
  - Correctif : `min-w-0` ou `grid-cols-[minmax(0,1fr)]`.
  - Effort : S.
- **IMP-F5 · Performance mobile.**
  - Preuve :
    - JS en un seul fichier : 649 977 o (202 ko gzip), plus 366 ko de runtime en ligne (BLQ-2) ;
    - Lighthouse mobile sur `/` : Performance 50, LCP 7,0 s, TBT 430 ms ;
    - l'élément LCP est retardé par `FadeIn delay={0.7}` (`Home.tsx`).
  - Correctif : BLQ-2, `React.lazy` par page, palette chargée à l'ouverture, `LazyMotion`, et ne pas retarder le texte LCP.
  - Effort : M.
- **IMP-F6 · 4 visuels de projets hébergés sur des CDN Manus** (`files.manuscdn.com`, `d2xsxph8kpxj0f.cloudfront.net`, dans `data/portfolio.ts`).
  - Leur disponibilité n'a pas été vérifiée : le proxy de l'audit bloquait ces domaines. Le visuel de secours s'affiche.
  - Correctif : rapatrier les images dans `client/public/assets/projects/` en WebP ou AVIF.
  - Effort : S.

**Back**
- **IMP-B1 · Formulaire de contact non fiable.**
  - Reclassé de Bloquant en Important après contre-vérification, car l'e-mail du propriétaire est affiché et copiable à côté du formulaire.
  - Preuves :
    - sans `BUILT_IN_FORGE_API_URL/KEY`, `notifyOwner` lève une erreur (`notification.ts:71-83`), relancée par `routers.ts:79-82` : HTTP 500 et alerte « Erreur lors de l'envoi du message » ;
    - quand Forge refuse (401) ou est injoignable, la réponse est `200 "Votre message a été envoyé avec succès!"` alors que rien n'est parti (`notification.ts:99-113` et `emailService.ts:34-47` renvoient `false`) ;
    - le message n'est stocké nulle part ;
    - Forge est une API propre à Manus (`webdevtoken.v1.WebDevService/SendNotification`).
  - Correctif :
    - passer à un fournisseur indépendant (Resend, Postmark ou SMTP) ;
    - renvoyer une erreur si aucun canal n'a livré le message ;
    - proposer un repli `mailto` dans le message d'erreur.
  - Effort : M.
- **IMP-B2 · Validation zod incomplète et corps de requête jusqu'à 50 Mo.**
  - Preuve : des champs faits uniquement d'espaces sont acceptés ; un message de 2 Mo est accepté (`routers.ts:26-31`, `express.json({limit:"50mb"})` dans `index.ts:35` et `api/index.ts:11`).
  - Correctif : `.trim().min().max()` sur chaque champ, et `limit: "100kb"`.
  - Effort : S.
- **IMP-B3 · Appels externes sans délai d'attente.**
  - Preuve : grep `AbortSignal|timeout` sur `server/` ne trouve que `sdk.ts:82`. Jusqu'à 3 `fetch` en série dans `contact.send`.
  - Correctif : `AbortSignal.timeout(8000)` et `Promise.allSettled`.
  - Effort : S.
- **IMP-B4 · Authentification OAuth du template exposée sans servir à rien.**
  - Preuves :
    - `useAuth` n'est importé nulle part ;
    - le cookie est en `sameSite: "none"` (`cookies.ts:45`) ;
    - la session dure un an (`oauth.ts:41`) ;
    - le paramètre `state` n'est pas lié à la session ;
    - aucune longueur minimale n'est exigée pour `JWT_SECRET` (un secret d'un octet est accepté par jose) ;
    - contre-vérification : CSRF par `multipart/form-data` vers `auth.logout`, avec `Origin: https://evil.example`, renvoie `200 {"success":true}` et `Set-Cookie: app_session_id=; Max-Age=-1`. C'est sans effet aujourd'hui, puisque aucune session ne peut exister.
  - Correctif : supprimer `auth.*`, `oauth.ts`, `sdk.ts` et l'authentification dans `createContext`.
  - Effort : M.

**Sécurité**
- **IMP-S1 · Aucun en-tête de sécurité.**
  - Preuve : `curl -sI http://localhost:4173/` ne montre aucun CSP, HSTS, `nosniff`, X-Frame-Options ni Referrer-Policy, mais montre `X-Powered-By: Express`. `vercel.json` ne définit que `Cache-Control`.
  - Correctif : un bloc `headers` sur `/(.*)` (CSP avec le hash du script de thème en ligne, `frame-ancestors 'none'`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`), plus `app.disable("x-powered-by")`.
  - Effort : S.
- **IMP-S2 · Dépendances vulnérables.**
  - Reclassé de Bloquant en Important après contre-vérification : aucune des vulnérabilités n'est exploitable par une requête anonyme dans ce code.
  - Preuves :
    - `pnpm audit` : 5 critiques, 58 hautes, 105 modérées, 18 faibles ;
    - `pnpm audit --prod` : 1 critique, 22 hautes ;
    - la critique de production, `proxy-addr` via express, n'est pas exploitable car `trust proxy` n'est pas configuré et `req.ip` n'est pas utilisé ;
    - `tar`, `tinypool` et `vitest` ne servent qu'en développement ;
    - `path-to-regexp` : aucune route avec paramètre ;
    - axios est atteignable par `/api/oauth/callback`, mais pas par ses chemins vulnérables.
  - Correctif : supprimer les paquets inutilisés, puis passer à express ≥ 4.22, axios ≥ 1.16, drizzle-orm ≥ 0.45.2, mysql2 ≥ 3.22, vite ≥ 7.3.5 et vitest ≥ 3.2.6.
  - Effort : M.
- **IMP-S3 · Données personnelles dans des fichiers publics.**
  - Point OK « aucun secret » infirmé en partie par la contre-vérification.
  - Preuves :
    - `client/public/Falou-Badiane-CV.pdf` (non lié, mais servi en 200 et exclu exprès de la réécriture dans `vercel.json:8`) contient le téléphone mobile et la commune avec son code postal ;
    - le CV lié (`CV-Falou-Badiane.pdf` en `2cd7c4c`) contenait la date de naissance ;
    - les deux restent dans l'historique Git.
  - État après `c0eca00` : le CV lié est remplacé par une version sans téléphone, adresse ni date de naissance. `Falou-Badiane-CV.pdf` est toujours publié.
  - Correctif : supprimer `Falou-Badiane-CV.pdf` et son exclusion dans `vercel.json`. Si le dépôt est public, envisager une purge de l'historique (`git filter-repo`).
  - Effort : S (M avec la purge).

**Déploiement**
- **IMP-D1 · Variables d'environnement non documentées ni validées.**
  - Preuve : pas de `.env.example` ; `env.ts:1-11` utilise `?? ""` partout ; 14 variables sont lues dans le code.
  - Correctif : un `.env.example` commenté et un schéma zod au démarrage.
  - Effort : S.
- **IMP-D2 · Build non reproductible.**
  - Preuves :
    - `pnpm-lock.yaml` est désynchronisé : `three`, `@types/three` et `cross-env` en sont absents ;
    - le problème est contourné par `"installCommand": "pnpm install --no-frozen-lockfile"` (`vercel.json:2`) ;
    - un `package-lock.json` npm existe en plus ;
    - `packageManager: pnpm@10.4.1` (version vulnérable GHSA-7vhp-vf5g-r2fw) ;
    - les paquets parasites `react-bits` et `add` sont présents.
  - Correctif : régénérer le lockfile, supprimer `package-lock.json`, `react-bits`, `add` et `three`, passer en `--frozen-lockfile`, et ajouter `engines.node`.
  - Effort : S.
- **IMP-D3 · Ni test ni vérification avant le déploiement.**
  - Preuve : `buildCommand: "pnpm build"` seul. Le workflow existant est dans `github/` au lieu de `.github/` (jamais exécuté) et serait cassé.
  - Correctif : `.github/workflows/ci.yml` (`install --frozen-lockfile`, `check`, `test`, `build`) déclaré comme vérification obligatoire.
  - Effort : M.
- **IMP-D4 · Outils de développement Manus dans le build de production.**
  - Preuves :
    - `jsxLocPlugin` ajoute 377 attributs `data-loc` (chemins des sources) dans le JS ;
    - `client/public/__manus__/debug-collector.js` est servi en 200 ;
    - le patch wouter alimente `window.__WOUTER_ROUTES__`, qui n'est lu nulle part.
  - Correctif : limiter ces plugins au développement et supprimer `__manus__/`.
  - Effort : S.
- **IMP-D5 · Aucune supervision, aucune route de santé exploitable, messages de contact non conservés.**
  - Preuve : grep `sentry|pino|winston|@vercel/analytics|/health` ne trouve rien ; `system.health` exige un `timestamp` ; `/api/health` renvoie 200 avec le HTML du site.
  - Correctif : `/api/health`, un suivi d'erreurs ou un log drain, une sonde externe, un retour arrière documenté.
  - Effort : M.

**Qualité**
- **IMP-Q1 · `pnpm check` ne vérifie ni `api/` ni les tests.**
  - Preuve : `tsconfig.json:2-3` (`include` sans `api/`, `exclude: ["**/*.test.ts"]`).
  - Correctif : inclure les deux et activer `noUnusedLocals`.
  - Effort : S.
- **IMP-Q2 · Beaucoup de code mort.**
  - Preuves :
    - 49 composants `ui/` sur 53 ne sont pas utilisés (5 714 lignes) ;
    - 14 autres fichiers morts (hooks, `server/_core/{dataApi,imageGeneration,map,voiceTranscription}.ts`, `server/index.ts`, `storage.ts`, avec des appels réseau à URL variable) ;
    - knip signale 45 dépendances inutilisées.
  - Correctif : supprimer ces fichiers et ces dépendances.
  - Effort : M.
- **IMP-Q3 · Le README est faux et ne suffit pas pour lancer le projet.**
  - Preuve : il annonce GitHub Pages et Manus au lieu de Vercel, cite `pnpm preview` (inexistant) et un fichier LICENSE absent, ne documente aucune variable d'environnement, et donne une liste de projets périmée.
  - Correctif : le réécrire.
  - Effort : S.
- **IMP-Q4 · Les tests cachent le comportement réel.**
  - Preuve : `server/contact.test.ts:6-8` mocke `notifyOwner` (`mockResolvedValue(true)`). `pnpm test` passe 6 sur 6 alors que le formulaire renvoie 500 sans Forge. Aucun test front.
  - Correctif : mocker `fetch` à la place, et tester les cas non configuré, refus de Forge et validation.
  - Effort : M.

### Mineurs

| Id | Domaine | Constat (preuve) | Correctif | Effort |
|---|---|---|---|---|
| MIN-F1 | Front | Pas de `robots.txt`, `sitemap.xml` ni canonical. `/robots.txt` et toute URL inconnue répondent `200 text/html`. | Ajouter les fichiers, `noindex` sur la 404. | M |
| MIN-F2 | Front | Pas d'`og:image`, `og:url` ni `twitter:card` ; même description sur toutes les pages. | Les compléter. | S |
| MIN-F3 | Front | Titre « Palette de commandes » présent dans le DOM même palette fermée (`ui/command.tsx:47`). Le saut h1→h3 de /skills est corrigé dans `c0eca00`. | Placer le titre dans `DialogContent`. | S |
| MIN-F4 | Front | Focus perdu (`BODY`) après Échap ou changement de page. | Rendre le focus au déclencheur, puis à `#contenu`. | S |
| MIN-F5 | Front | `aria-label` « Ouvrir la palette… » différent du texte visible « Rechercher » (WCAG 2.5.3). | Aligner le libellé. | S |
| MIN-F6 | Front | Trait sous les champs à 1,25:1 (`--border`). | Utiliser `--muted-foreground`. | S |
| MIN-F7 | Front | `/projects#%E0%A4%A` fait planter l'application (`URIError` dans `useHash.ts`). L'écran d'erreur est en anglais et affiche la pile d'appels. | try/catch et ErrorBoundary en français. | S |
| MIN-F8 | Front | Polices chargées depuis Google : appel à un tiers, non documenté. | Auto-héberger les polices. | S |
| MIN-F9 | Front | Images lourdes (PNG de 110 ko, WebP de 193 ko) et dimensions déclarées fausses. | Compresser, `srcset`. | S |
| MIN-F10 | Front | Favicon uniquement en data URI ; `/favicon.ico` répond en HTML. | Ajouter les fichiers. | S |
| MIN-F11 | Front | Liens du pied de page hauts de 17 px. | `py-1`. | S |
| MIN-B1 | Back | `/api/<inconnu>` répond 200 HTML. | 404 JSON sous `/api`. | S |
| MIN-B2 | Back | « Missing session cookie » journalisé à chaque requête ; corps des réponses amont journalisés. | Ne pas journaliser ces corps. | S |
| MIN-B3 | Back | `pnpm start` : le bundle importe `vite` statiquement et change de port en silence. | Import dynamique en dev, port strict. | S |
| MIN-B4 | Back | `db:push` lance `generate` et `migrate` ; base inutilisée. | Supprimer la base ou séparer les deux étapes. | S |
| MIN-S1 | Sécurité | `.gitignore` n'ignore pas `.env.production` et équivalents. | `.env*` sauf `!.env.example`. | S |
| MIN-D1 | Déploiement | `github/workflows/deploy.yml` mal placé et cassé. | Le supprimer (voir IMP-D3). | S |
| MIN-D2 | Déploiement | `dist/` versionné et périmé (`lang="en"`, Rubik, build de dev). | `git rm -r --cached dist`, l'ajouter au `.gitignore`. | S |
| MIN-D3 | Déploiement | Versions de Node et de pnpm non figées. | `engines`, `.nvmrc`. | S |
| MIN-D4 | Déploiement | Cache `immutable` d'un an sur `/assets/projects/*`, des noms de fichiers sans empreinte. | Déplacer ces images ou les importer. | S |
| MIN-D5 | Déploiement | L'étape esbuild produit `dist/index.js`, inutile sur Vercel. | Script `build:vercel`. | S |
| MIN-D6 | Déploiement | `vercel.json` exclut l'ancien nom de CV ; pas de redirection www↔apex. | Nettoyer, régler le domaine. | S |
| MIN-Q1 | Qualité | `prettier --check` : 57 fichiers non formatés. | `.prettierignore` et formatage. | S |
| MIN-Q2 | Qualité | `CLAUDE.md` affirmait un succès sans Forge (corrigé dans `c0eca00`). | — | S |
| MIN-Q3 | Qualité | E-mails HTML encore à l'ancienne charte (Rubik, `#0052CC`, © 2025). | Aligner sur la nouvelle charte. | S |
| MIN-Q4 | Qualité | `todo.md`, `ideas.md` et `references/` obsolètes ; `.manus-logs/` non ignoré. | Archiver et ignorer. | S |

## 5. Tests réels

Build de production généré hors du dépôt, avec `vite build --outDir <scratch>` et esbuild. Serveurs locaux :
- `:4173` : aucune variable d'environnement ;
- `:4174` : variables Forge pointant vers un faux service local sur `:4180`, qui enregistre les requêtes sans rien transmettre.

| Test | Commande | Résultat |
|---|---|---|
| Pages principales | `curl -w %{http_code}` sur `/ /projects /skills /about /contact` | 200 ×5 ✅ |
| URL inconnue | `curl /une-url-inconnue` | **200** text/html : pas de vraie 404 côté HTTP (la page 404 s'affiche côté client) ❌ |
| CV | `curl /CV-Falou-Badiane.pdf` | 200 application/pdf ✅ |
| `robots.txt` et `sitemap.xml` | `curl` | 200 **text/html** (repli SPA) ❌ |
| API, entrée invalide | `POST contact.send` avec `name:"A", email:"pas-un-email"` | 400 avec messages zod (en JSON brut) ✅ / ⚠️ |
| API, JSON mal formé | `POST contact.send` avec `{"0":{"json":` | 400 « Bad Request », sans pile d'appels ✅ |
| API, mauvaise méthode ou procédure | `GET` sur une mutation ; procédure inconnue | 405 ; 404 ✅ |
| API, route inconnue | `curl /api/nexiste-pas` | **200** text/html ❌ |
| Santé | `GET /api/trpc/system.health?input={"json":{"timestamp":1}}` ; `/api/health` | `{"ok":true}` 200 ✅ ; `/api/health` renvoie 200 avec le HTML du site ❌ |
| Contact sans service e-mail | Playwright : saisie puis envoi sur `:4173/contact` | HTTP 500, alerte « Erreur lors de l'envoi du message. Veuillez réessayer. » ❌ |
| Contact avec faux service | Playwright sur `:4174/contact` | HTTP 200, bouton « Message envoyé » ✅. Le faux service reçoit 1 notification, 1 e-mail au visiteur et 1 au propriétaire, avec du **HTML non échappé** ❌ |
| Écart client/serveur | Playwright, e-mail `a@b.c` | 400 et alerte en JSON brut ❌ |
| Limitation de débit | 30 POST `contact.send` valides sur `:4174` | 200 ×30, 30 e-mails envoyés à l'adresse saisie ❌ |
| `/api/chat` | `curl -X POST /api/chat` sur `:4174` | 200 SSE ; le faux service reçoit `gpt-4o` avec la clé ❌ |
| Chargement de l'API Vercel | `node --experimental-strip-types -e "import('./api/index.ts')"` ; `vercel build` (relecteur) | `ERR_MODULE_NOT_FOUND` ❌ |
| XSS du runtime Manus | `node scratchpad/audit/e2e/xss-poc.mjs` | `XSS:localhost` ❌ |
| Navigateur | Playwright, 6 URL × 400, 768 et 1440 px (audit front) | Aucune erreur JS ; erreur console Umami partout ; débordement /skills à 360 px |
| Lighthouse | Lighthouse 12.8.2, mobile, sur `/` | Performance 50, Accessibilité 100 (98 sur /skills), SEO 91, Bonnes pratiques 79 |
| Types et tests | `pnpm check` ; `pnpm test` | exit 0 ; 6 sur 6 ✅ (voir IMP-Q4) |
| Après `c0eca00` | `check-themes.mjs` ; Playwright sur les thèmes ; `pnpm check` ; `pnpm test` | Contrastes ≥ 4,5:1 dans les 3 thèmes ; thème mémorisé, sans flash ; aucune erreur JS ; 6 sur 6 ✅ |

## 6. Non vérifié

- **URL et configuration réelles de Vercel** (variables d'environnement, version de Node, framework, domaine, certificat, HTTPS/HSTS, redirection www, protection des prévisualisations, Instant Rollback, journaux). Inaccessibles depuis le dépôt, et l'audit interdisait d'appeler un service de production.
- **Comportement exact du lanceur Vercel sur Lambda.** BLQ-1 est démontré par un `vercel build` local et un chargement sous Node 24. Les journaux d'exécution de production permettraient une confirmation finale.
- **API Manus Forge.** On ne sait pas si `/email/send` existe, si une clé fonctionne hors de l'hébergement Manus, ni comment Forge traite le HTML et les quotas. Si `/email/send` n'existe pas, BLQ-4 se réduit à des notifications en masse vers le propriétaire.
- **Ressources externes :** disponibilité des 4 images sur les CDN Manus, liens GitHub, LinkedIn, Behance et github.io, Google Fonts, YouTube. Le proxy de l'environnement d'audit bloquait ces domaines.
- **Sauvegardes et restauration.** Aucune base n'est utilisée par le site actuel, ce qui est confirmé. La conservation des messages de contact côté Forge ou boîte mail n'est pas vérifiable. Les images sur CDN Manus et la configuration Vercel sont des éléments à sauvegarder hors du dépôt.
- **Visibilité du dépôt GitHub**, qui décide s'il faut purger l'historique des PDF (IMP-S3).
- **Couverture de tests** : `@vitest/coverage-v8` n'est pas installé.
- **Test avec un vrai lecteur d'écran** (NVDA, VoiceOver).

## 7. Plan d'action

| Ordre | Action | Constats couverts | Effort |
|---|---|---|---|
| 1 | Retirer `vitePluginManusRuntime`, `jsxLocPlugin`, le collecteur de debug et `client/public/__manus__/` du build de production | BLQ-2, IMP-D4, une partie d'IMP-F5 | S |
| 2 | Supprimer `/api/chat`, l'OAuth, `auth.*` et les modules serveur morts | BLQ-3, IMP-B4, une partie d'IMP-Q2 | M |
| 3 | Rendre l'API chargeable sur Vercel (bundle esbuild ou imports `.js` sans alias), valider par `vercel build` et une prévisualisation | BLQ-1, IMP-Q1 | M |
| 4 | Refaire l'envoi du formulaire : fournisseur e-mail indépendant, HTML échappé, plus de confirmation au visiteur, zod `.trim().max()`, corps limité à 100 ko, batching désactivé, limitation de débit, champ piège ou Turnstile, erreur si rien n'est livré, schéma partagé client/serveur, délais d'attente | BLQ-4, IMP-B1, IMP-B2, IMP-B3, IMP-F3 | L |
| 5 | En-têtes de sécurité dans `vercel.json` (CSP avec le hash du script de thème) et `x-powered-by` désactivé | IMP-S1 | S |
| 6 | Supprimer `Falou-Badiane-CV.pdf` et son exclusion ; décider de la purge de l'historique | IMP-S3 | S |
| 7 | Lockfile propre, dépendances inutiles supprimées, mises à jour de sécurité, versions de pnpm et Node figées | IMP-D2, IMP-S2, une partie d'IMP-Q2, MIN-D3 | M |
| 8 | CI GitHub (check, test, build) et tests du formulaire sans mock | IMP-D3, IMP-Q4, MIN-D1 | M |
| 9 | `.env.example`, validation des variables, README réécrit | IMP-D1, IMP-Q3 | S |
| 10 | Mentions légales et politique de confidentialité | IMP-F2 | S |
| 11 | Umami, débordement /skills, découpage du JS et LCP, images rapatriées | IMP-F1, IMP-F4, IMP-F5, IMP-F6 | M |
| 12 | Supervision : `/api/health`, suivi d'erreurs, retour arrière documenté | IMP-D5, MIN-B1 | S |
| 13 | Mineurs restants (SEO, accessibilité, `dist/`, `.gitignore`, formatage, nettoyage) | MIN-* | M |

**Effort total estimé :** environ **6 à 8 jours-personne**, soit 6 tâches S (environ 1 jour en tout), 6 tâches M (environ 4 à 5 jours) et 1 tâche L (1 à 2 jours), plus une marge pour les vérifications. Les étapes 1 à 4 suffisent à lever les bloquants, en environ 3 à 4 jours.

## 8. Suivi des corrections des bloquants (13/10/2026)

Chaque bloquant a été corrigé par un sous-agent dédié, dans un worktree isolé. Les corrections ont ensuite été fusionnées sur `claude/fervent-goodall-kw4isa`, et le tout a été revérifié ensemble :
- `pnpm check` passe ;
- `pnpm test` : 34 tests sur 34 ;
- `check-themes.mjs` passe ;
- build de production servi en local, avec un faux service Forge local qui enregistre les requêtes ;
- vrai `vercel build` (vercel 63.1.2) d'une copie du dépôt, puis appel de la fonction produite.

| Bloquant | Commit | Correctif | Vérification |
|---|---|---|---|
| BLQ-1 · API Vercel non chargeable | `758f12c` | Imports relatifs en `.js` et plus d'alias `@shared` dans `api/`, `server/`, `shared/` et `drizzle/` ; `api/` ajouté à `tsconfig.json`. | `vercel build` → `"status": "ok"`. La fonction `index.func` importe `../server/routers.js` et contient `shared/`. Chargée sous Node 22 : `system.health` → 200 `{"ok":true}` ; un message valide → 200, relayé au propriétaire ; une entrée invalide → 400 sans pile d'appels (`NODE_ENV=production`). L'agent a aussi validé le chargement sous Node 24, et la contre-épreuve sur l'ancienne version donne `ERR_MODULE_NOT_FOUND`. |
| BLQ-2 · XSS du runtime Manus | `5c737a8` | `vitePluginManusRuntime` supprimé ; jsx-loc et le collecteur de debug limités au dev ; dans `vercel.json`, `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`, `nosniff` et `Referrer-Policy`. | `index.html` passe de 368 539 à 2 512 octets ; `manus-runtime` : 0 ; `data-loc` : 0. Preuve d'exploitation rejouée : titre inchangé (`Contact — Falou Badiane`). Les en-têtes sont présents dans `.vercel/output/config.json`. L'agent a vérifié qu'une iframe tierce est refusée et que COOP suffit seul à bloquer l'attaque par popup. |
| BLQ-3 · `/api/chat` ouvert | `a0d4e52` | Route, `chat.ts` et `patchedFetch.ts` supprimés des deux points d'entrée. | `POST /api/chat` avec la clé Forge définie : 0 requête `/v1/chat/completions` reçue par le faux service (le repli SPA renvoie 200 HTML en `pnpm start`, 404 sur la fonction Vercel). |
| BLQ-4 · Relais d'e-mails | `325c7fc` | Voir le détail ci-dessous. | Voir le détail ci-dessous. |

**Détail de BLQ-4.**
- **Correctif :**
  - plus d'e-mail de confirmation au visiteur ;
  - HTML échappé dans l'e-mail au propriétaire ;
  - CR/LF retirés de l'objet ;
  - schéma zod partagé entre le client et le serveur (`shared/contact.ts`, avec `.trim()` et des longueurs maximales) ;
  - champ piège et contrôle d'un temps de remplissage d'au moins 3 s ;
  - limitation à 5 envois par IP sur 10 min ;
  - batching désactivé côté serveur (`httpLink` côté client) ;
  - corps limité à 100 ko.
- **Vérification :**
  - Playwright : « Message envoyé ». Le faux service reçoit 1 notification et **1 seul** e-mail, adressé au propriétaire, avec `Audit &lt;b&gt;Test&lt;/b&gt;` et sans `<script>` brut.
  - Un envoi groupé est refusé (400), un corps de 200 ko aussi (413).
  - Champ piège rempli : 0 requête envoyée.
  - 6 envois depuis la même IP : 200 ×5 puis **429**, et 0 e-mail vers l'adresse saisie.
  - Avec `a@b.c`, le message d'erreur s'affiche sous le champ, sans JSON brut.

**Réserves avant la mise en ligne (non bloquantes, à traiter par le propriétaire) :**
1. **Variables Forge sur Vercel.** Sans `BUILT_IN_FORGE_API_URL` et `BUILT_IN_FORGE_API_KEY`, le formulaire renvoie toujours 500 (IMP-B1, testé en local). L'API Forge est propre à Manus et son accès depuis Vercel n'est pas vérifié. Solution durable : un fournisseur d'e-mail indépendant (Resend, Postmark, SMTP).
2. **Limitation de débit.** Elle est en mémoire, donc propre à chaque instance serverless. Il faut configurer une règle de limitation du pare-feu Vercel sur `POST /api/trpc/contact.send`.
3. **Validation sur un déploiement de prévisualisation.** Appeler `/api/trpc/system.health` et envoyer un message de test. Le lanceur Lambda réel n'a pas pu être testé d'ici.
4. **Constats Importants restants** (sections 4 et 7), en particulier :
   - IMP-S3 : ancien CV avec téléphone toujours publié ;
   - IMP-D2 : lockfile ;
   - IMP-S2 : dépendances, avec `ai`, `@ai-sdk/*` et `vite-plugin-manus-runtime` désormais inutilisés ;
   - IMP-D3 : CI ;
   - IMP-F1 : Umami cassé ;
   - IMP-F2 : mentions légales ;
   - IMP-B4 : OAuth du template.

   Par rapport au plan d'action, les étapes 1 à 3 sont faites, et l'étape 4 l'est en partie : le fournisseur d'e-mail reste à remplacer, et IMP-B3 (délais d'attente) reste à faire.

