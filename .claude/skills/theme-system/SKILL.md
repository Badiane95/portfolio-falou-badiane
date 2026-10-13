---
name: theme-system
description: Système de thèmes de couleur du portfolio (clair, bleu nuit, noir) — tokens CSS par thème, sélecteur à pastilles avec révélation circulaire, script anti-flash dans index.html, contrastes WCAG. Utilise ce skill dès qu'une tâche touche aux couleurs du site, même sans le mot « thème » : ajouter, retirer ou retoucher un thème, changer une couleur ou l'accent, créer ou modifier un composant qui affiche du texte coloré, un fond, une bordure ou un bouton, corriger un contraste ou un flash de couleur au chargement, intervenir sur ThemeSwitcher, ThemeContext, la palette ⌘K, les toasts ou le canvas DotField du hero.
---

# Système de thèmes de couleur

Le site propose trois thèmes : **clair** (blanc), **nuit** (bleu foncé) et **noir**. Le visiteur choisit avec les trois pastilles de la barre de navigation ou avec la palette ⌘K ; le choix est mémorisé dans `localStorage["theme"]`. Sans choix enregistré, le site suit le réglage du système : `nuit` si l'appareil est en mode sombre, sinon `clair`.

## Comment ça marche

Les couleurs ne sont jamais écrites dans les composants. Chaque thème est un jeu de **tokens** CSS (`--background`, `--foreground`, `--primary`…) ; Tailwind les expose en classes (`bg-background`, `text-primary`…). Changer de thème revient à changer l'attribut `data-theme` de `<html>` : toutes les classes suivent sans re-rendu.

| Fichier | Rôle |
|---|---|
| `client/src/index.css` | Un bloc `[data-theme="…"]` par thème, avec les mêmes tokens partout et `color-scheme`. Le bloc `@theme inline` relie chaque token à une couleur Tailwind (`--color-success: var(--success)`). |
| `client/src/lib/themes.ts` | La liste `THEMES` (id, libellé, pastille, `themeColor` pour la barre du navigateur, `dark`) et `applyThemeToDocument()`. |
| `client/index.html` | Script en ligne dans `<head>` qui pose `data-theme` **avant le premier rendu**. Sans lui, la page s'afficherait une fraction de seconde en clair avant de basculer. Il contient sa propre copie des identifiants et des couleurs de fond, car il s'exécute avant le bundle JavaScript. |
| `client/src/contexts/ThemeContext.tsx` | État React du thème. `setTheme(id, origin?)` écrit le choix, applique le thème et, si un point d'origine est donné, dévoile le nouveau thème en cercle grâce à l'API View Transitions. Sans cette API ou avec « réduire les animations », le changement est instantané. |
| `client/src/components/ThemeSwitcher.tsx` | Les trois pastilles (`aria-pressed`, anneau animé `layoutId`). Au clavier, le cercle part du centre du bouton. |
| `client/src/components/CommandPalette.tsx` | Groupe « Thème » de la palette ⌘K. |
| `client/src/components/ui/sonner.tsx` | Les toasts passent en sombre quand le thème a `dark: true`. |
| `client/src/components/motion/DotField.tsx` | Le canvas du hero lit `--foreground` et `--primary` avec `getComputedStyle` : il ne voit pas les classes CSS, d'où la dépendance à `theme` dans son effet. Tout nouveau dessin canvas ou SVG calculé en JS doit faire pareil. |

La classe `dark` est ajoutée à `<html>` pour les thèmes sombres, pour les variantes `dark:` des composants shadcn/ui.

## Ajouter ou retirer un thème

Quatre endroits doivent rester d'accord ; le script de vérification détecte tout écart.

1. **`index.css`** : copie un bloc `[data-theme="…"]` existant et ajuste chaque valeur. Garde exactement les mêmes tokens, avec `color-scheme: light` ou `dark`. Écris les couleurs en hexadécimal (`#rrggbb`), seul format que le script sait contrôler.
2. **`lib/themes.ts`** : ajoute l'entrée dans `THEMES`. `themeColor` doit être égal à `--background` ; `dark` doit correspondre à `color-scheme`.
3. **`client/index.html`** : ajoute l'identifiant et sa couleur de fond dans l'objet `colors` du script en ligne. Si le thème par défaut change, adapte aussi la ligne `prefers-color-scheme`.
4. **Vérifie** (voir plus bas). Le sélecteur, la palette et les toasts lisent `THEMES` : rien d'autre à modifier.

Pour retirer un thème, fais l'inverse aux trois endroits. Un visiteur qui l'avait choisi retombera sur le thème par défaut, car le script ignore une valeur inconnue.

## Modifier une couleur ou ajouter un token

- Change la valeur du token dans **chaque** bloc de thème, pas seulement dans celui que tu regardes.
- Besoin d'une nouvelle couleur sémantique (avertissement, info…) ? Crée la paire `--x` / `--x-foreground` dans les trois blocs, puis `--color-x` et `--color-x-foreground` dans `@theme inline`. C'est ce qui a été fait pour `--success`.
- Dans un composant, utilise uniquement les classes de tokens : `bg-card`, `text-muted-foreground`, `border-border`, `bg-success text-success-foreground`… Une couleur en dur (`bg-[#1f7a4d]`, `#2b3fe0` dans un `style`) restera identique dans les trois thèmes et cassera au moins l'un d'eux.
- Associe toujours un fond à son texte prévu : `bg-primary` va avec `text-primary-foreground`. Le bouton inversé du site est `bg-foreground text-background`, et au survol `hover:bg-primary hover:text-primary-foreground`. Une couleur de texte héritée par hasard est la cause la plus fréquente de texte illisible dans un thème sombre.
- `--border` est décoratif (contraste ≈ 1,3:1). Il ne doit pas être le seul repère visuel d'un élément interactif : un champ de formulaire a besoin d'un trait à au moins 3:1, par exemple `--muted-foreground`.

## Vérifier

Lance toujours le script après une modification de couleur. Il contrôle la cohérence des quatre fichiers, calcule les contrastes WCAG de chaque paire texte/fond dans chaque thème, et signale les couleurs en dur dans `client/src`. Il sort avec un code non nul en cas de problème.

```bash
node .claude/skills/theme-system/scripts/check-themes.mjs
pnpm check
```

Seuils appliqués : 4,5:1 pour le texte, 3:1 pour le contour de focus. Si une paire échoue, ajuste la couleur du thème concerné plutôt que de baisser le seuil : un visiteur sur écran de téléphone en plein soleil en dépend.

Ensuite, regarde le résultat dans les trois thèmes. Le site doit tourner (`pnpm dev`, ou un build servi par `pnpm start`) :

```bash
node .claude/skills/theme-system/scripts/screenshot-themes.mjs http://localhost:3000 /tmp/themes
```

Le script pose le thème dans `localStorage` avant le chargement et capture chaque page dans chaque thème. Ouvre les captures et cherche : texte peu lisible, bloc resté clair dans un thème sombre, bouton dont le texte disparaît au survol, canvas du hero qui ne suit pas.

## Pièges connus

- **Flash au chargement** : si le thème est posé seulement par React, la page apparaît d'abord en clair. Le script en ligne de `index.html` doit rester avant les feuilles de style et le bundle.
- **Révélation circulaire** : la mise à jour du DOM se fait de façon synchrone dans le rappel de `startViewTransition` (`applyThemeToDocument` puis `flushSync`). Une mise à jour asynchrone ferait capturer l'ancien état deux fois, et l'animation ne montrerait rien.
- **CSP** : si une Content-Security-Policy est ajoutée (par ex. dans `vercel.json`), le script en ligne a besoin d'un hash `sha256-…` dans `script-src`, sinon le thème ne sera plus posé avant le rendu.
- **Images et vidéos** ne changent pas avec le thème : vérifie qu'elles restent lisibles sur fond sombre (les visuels de secours de `ProjectImage` utilisent déjà des tokens).
