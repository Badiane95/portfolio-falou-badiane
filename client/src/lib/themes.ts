// Les thèmes de couleur du site. Les valeurs des couleurs vivent dans
// client/src/index.css ([data-theme="…"]) ; ce fichier décrit seulement
// les thèmes pour l'interface (sélecteur, palette, meta theme-color).
// Garder la liste des identifiants synchronisée avec le script en ligne
// de client/index.html (voir le skill .claude/skills/theme-system).

export const THEMES = [
  { id: "clair", label: "Clair", swatch: "#ffffff", themeColor: "#ffffff", dark: false },
  { id: "nuit", label: "Bleu nuit", swatch: "#0b1530", themeColor: "#0b1530", dark: true },
  { id: "noir", label: "Noir", swatch: "#0a0a0a", themeColor: "#0a0a0a", dark: true },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_STORAGE_KEY = "theme";

/** Thème d'un nouveau visiteur. À garder identique dans le script en ligne et sur <html> dans client/index.html. */
export const DEFAULT_THEME: ThemeId = "nuit";

export const isThemeId = (value: unknown): value is ThemeId =>
  THEMES.some(t => t.id === value);

export const themeById = (id: ThemeId) => THEMES.find(t => t.id === id)!;

/** Applique le thème au document : attribut, classe `dark`, couleur du navigateur. */
export function applyThemeToDocument(id: ThemeId) {
  const theme = themeById(id);
  const root = document.documentElement;
  root.dataset.theme = id;
  root.classList.toggle("dark", theme.dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme.themeColor);
}
