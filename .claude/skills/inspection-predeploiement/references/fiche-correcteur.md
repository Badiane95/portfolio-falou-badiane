# Fiche de mission du correcteur

Recopie le bloc ci-dessous, remplis chaque champ `<…>` et donne le texte obtenu comme prompt au sous-agent correcteur (`general-purpose`). Le correcteur ne voit rien d'autre : une fiche vague produit une correction à l'aveugle.

Une fiche couvre une anomalie. Deux anomalies qui ont la même cause, ou qui touchent le même fichier, vont dans la même fiche.

---

```markdown
Tu es le correcteur d'une anomalie trouvée par l'inspection avant déploiement du portfolio de Falou Badiane (dépôt : <chemin absolu du dépôt>, branche <branche>). Commence par lire `CLAUDE.md` à la racine : il décrit l'architecture et les conventions.

## Anomalie
- Gravité : <bloquant | à corriger>
- Où : <fichier:ligne>
- Constat : <ce qui ne va pas, en une ou deux phrases>
- Reproduction : <commande, test ou étapes exactes> → résultat observé : <sortie ou comportement>
- Résultat attendu : <ce qui doit se passer une fois corrigé>
- Piste éventuelle : <si l'inspecteur a une idée de la cause ; sinon « aucune »>

## Contraintes
- Correction minimale, limitée à cette anomalie. Si tu dois toucher un autre fichier, explique pourquoi dans ton rapport.
- Conventions du projet : textes et commentaires en français, imports serveur relatifs avec `.js`, couleurs uniquement par tokens, contenu uniquement dans `client/src/data/portfolio.ts`.
- Si tu modifies une logique serveur, ajoute ou adapte un test vitest qui échoue avant ta correction et passe après.
- Ne désactive, ne supprime et n'affaiblis aucun test pour faire passer une vérification.
- Pas de commit, pas de push, pas de déploiement. Pas d'appel à un service de production, pas de vrai e-mail : simule `fetch` ou utilise un faux service local.
- Ne lance pas `pnpm build` sans restaurer ensuite `dist/` (`git checkout -- dist && git clean -fdq -- dist`), car le build modifie des fichiers suivis.

## Étapes
1. Reproduis l'anomalie avec la commande ci-dessus. Si tu ne la reproduis pas, arrête-toi et dis-le, sans rien modifier.
2. Trouve la cause racine, puis corrige-la.
3. Rejoue la reproduction : l'anomalie doit avoir disparu.
4. Lance `node .claude/skills/inspection-predeploiement/scripts/verifier.mjs --rapide` : tout doit passer.

## Rapport (ta réponse finale)
- Cause racine : <une ou deux phrases>
- Fichiers modifiés : <liste>
- Preuve : reproduction avant et après, résultat du vérificateur
- Non vérifié : <ce que tu n'as pas pu contrôler, et pourquoi ; sinon « rien »>
```
