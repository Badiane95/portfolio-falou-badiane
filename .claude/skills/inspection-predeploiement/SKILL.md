---
name: inspection-predeploiement
description: Inspection du code du portfolio avant toute mise en production, par un agent inspecteur qui délègue chaque anomalie trouvée à un sous-agent correcteur, puis revérifie. Utilise ce skill dès qu'il est question de déployer, de « mettre en prod », de fusionner dans main, d'ouvrir ou de fusionner une PR de mise en production, ou de relire, vérifier ou auditer le code avant une livraison, même si le mot « inspection » n'est pas prononcé. C'est aussi le mode d'emploi de l'agent inspecteur et la fiche de mission du correcteur qu'il lance.
---

# Inspection avant déploiement

Ce skill décrit le travail d'un **agent inspecteur** lancé juste avant une mise en production. Il trouve les anomalies et prouve chacune d'elles. Il confie ensuite chaque correction à un **sous-agent correcteur**, puis revérifie.

L'inspecteur ne corrige rien lui-même. Un agent qui juge son propre correctif ne voit pas ses angles morts. En gardant les deux rôles séparés, chaque correction est relue par quelqu'un qui ne l'a pas écrite.

## 1. Délimiter ce qui part en production

```bash
git fetch origin main
git status --short                      # modifications non commitées
git diff --stat origin/main...HEAD      # commits qui partiront
git diff origin/main...HEAD             # et leur contenu
```

Le diff (commits et modifications non commitées) est ce que tu relis ligne à ligne. Le reste du code est couvert par les vérifications automatiques. Si le diff est vide, dis-le : il n'y a rien à déployer.

## 2. Lancer les vérifications automatiques

```bash
node .claude/skills/inspection-predeploiement/scripts/verifier.mjs
```

Le script n'écrit rien dans le dépôt. Le build et la transpilation se font dans un dossier temporaire, et `dist/` reste intact. Compte une vingtaine de secondes, ou passe `--rapide` pour sauter le build Vite.

| Vérification | Ce qu'elle attrape |
|---|---|
| Types, tests, thèmes | `pnpm check`, `pnpm test`, `check-themes.mjs` (contrastes WCAG, couleurs en dur) |
| Imports serveur ESM | import relatif sans `.js` ou alias `@shared` / `@/` dans `api/`, `server/`, `shared/`, `drizzle/` |
| Chargement de la fonction Vercel | transpile l'API fichier par fichier comme @vercel/node, puis l'importe en ESM natif. C'est la seule façon de voir un `ERR_MODULE_NOT_FOUND`, que `tsc` et `vitest` laissent passer. |
| Données du portfolio | noms de `stack` et de `skillsAtWork` absents de `skillGroups`, employeur inconnu, `start` mal formé, image ou CV introuvable, adresse e-mail différente entre `profile.email`, `CONTACT_EMAIL` et le `OWNER_EMAIL` par défaut |
| Secrets | `.env*` suivi ou non ignoré (un `git add -A` l'enverrait), clés d'API (Resend, OpenAI, GitHub, AWS) ou clés privées, dans les fichiers suivis comme dans les nouveaux fichiers |
| Build client | `vite build` |

Chaque ✗ est une anomalie, et la sortie du script en est la preuve.

## 3. Relire le diff

Lis `references/points-de-controle.md` et parcours les sections que le diff touche. Elles regroupent les règles propres à ce projet (formulaire de contact, deux points d'entrée serveur, thèmes, contenu, images en cache immuable, sécurité). Une fois le diff relu, regarde aussi ce qu'il **ne** touche **pas** alors qu'il le devrait. Exemples : une route ajoutée dans `server/_core/index.ts` mais pas dans `api/index.ts`, une logique serveur modifiée sans test.

**Prouve chaque anomalie avant de la signaler.** Reproduis-la par un test, une commande ou une page servie en local. Cite `fichier:ligne` et montre le résultat observé à côté du résultat attendu. Sans preuve, c'est une remarque, pas une anomalie. Un faux positif envoie un correcteur modifier du code sain.

N'appelle aucun service de production et n'envoie aucun vrai e-mail. Pour tester l'envoi du formulaire, sers le build en local avec `RESEND_API_URL` pointé vers un faux service local qui enregistre les requêtes.

## 4. Classer

- **Bloquant** : casse la production, la sécurité ou expose une donnée personnelle. Le déploiement attend la correction.
- **À corriger** : bug réel sans risque immédiat. Il se corrige avant le déploiement si la correction est petite. Sinon, il est signalé et suivi.
- **Remarque** : style, amélioration possible, doute sans preuve. Elle ne bloque pas et n'est pas déléguée.

## 5. Déléguer chaque anomalie à un correcteur

Pour chaque bloquant et chaque « à corriger », remplis la fiche de `references/fiche-correcteur.md`. La fiche est le prompt complet du correcteur. Il ne voit ni ta conversation ni ton raisonnement : tout ce dont il a besoin doit y être (fichier, reproduction, résultat attendu, contraintes).

- **Si tu as l'outil Agent** : lance un sous-agent `general-purpose` par fiche, avec le texte de la fiche comme prompt. Les correcteurs travaillent dans l'arbre de travail courant et ne commitent pas.
  - Des anomalies sans fichier commun peuvent être corrigées en parallèle.
  - Des anomalies qui touchent les mêmes fichiers vont au même correcteur ou passent l'une après l'autre. Deux agents qui modifient le même fichier en même temps s'écrasent.
- **Si tu n'as pas l'outil Agent** (c'est le cas d'un sous-agent, qui ne peut pas en lancer d'autres) : mets les fiches remplies dans la section « À déléguer » de ton rapport. L'agent principal lance un correcteur par fiche, avec le texte tel quel.

## 6. Revérifier chaque correction

Quand un correcteur a terminé :

1. Relis son diff (`git diff`). Il doit être limité à l'anomalie, sans test désactivé ni contournement.
2. Rejoue la reproduction de la fiche : l'anomalie doit avoir disparu.
3. Relance `verifier.mjs`, car une correction peut en casser ailleurs.

Si la correction ne tient pas, rédige une nouvelle fiche avec ce qui a échoué et relance un correcteur. Après deux tentatives sans succès sur la même anomalie, arrête-toi et présente le problème à l'utilisateur plutôt que d'insister.

## 7. Rendre le rapport

Rédige-le en français, avec ce modèle :

```markdown
## Inspection avant déploiement : <branche> @ <commit court>

**Verdict : GO | GO AVEC RÉSERVES | NO-GO**
<une phrase qui justifie le verdict>

### Vérifications automatiques
| Vérification | Résultat |
|---|---|

### Anomalies
| # | Gravité | Fichier:ligne | Constat | Preuve | Statut |
|---|---|---|---|---|---|
<!-- Statut : corrigée et revérifiée / déléguée, en attente / non corrigée (raison) -->

### Remarques
<points sans preuve suffisante ou sans risque, en une ligne chacun>

### À déléguer
<seulement si tu n'as pas pu lancer les correcteurs : les fiches remplies, complètes>
```

Choisis le verdict ainsi :
- **NO-GO** s'il reste un bloquant non corrigé ou une vérification automatique en échec.
- **GO AVEC RÉSERVES** s'il ne reste que des « à corriger » suivis ou des points que tu n'as pas pu vérifier. Dis lesquels.
- **GO** sinon.

## Limites de l'inspecteur

- Il ne modifie aucun fichier, ne commite pas, ne pousse pas et ne déploie pas. Ces actions reviennent aux correcteurs (pour les fichiers) et à l'agent principal (pour git et le déploiement).
- Il n'appelle aucun service de production et n'envoie aucun vrai e-mail.
- Il ne présente pas une vérification qu'il n'a pas pu faire comme réussie. Il la note « non vérifiée », avec la raison.
