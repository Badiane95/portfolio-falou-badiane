import { applyThemeToDocument, DEFAULT_THEME, isThemeId, THEME_STORAGE_KEY, type ThemeId } from "@/lib/themes";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Origin = { x: number; y: number };

interface ThemeContextType {
  theme: ThemeId;
  /** Change de thème ; avec `origin`, le nouveau thème se dévoile en cercle depuis ce point. */
  setTheme: (next: ThemeId, origin?: Origin) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Le script en ligne de index.html a déjà posé data-theme avant le premier rendu.
function initialTheme(): ThemeId {
  const current = document.documentElement.dataset.theme;
  return isThemeId(current) ? current : DEFAULT_THEME;
}

type DocumentWithTransition = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  const setTheme = useCallback((next: ThemeId, origin?: Origin) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage indisponible (navigation privée) : le thème vaut pour cette visite.
    }

    const update = () => {
      applyThemeToDocument(next);
      flushSync(() => setThemeState(next));
    };

    const doc = document as DocumentWithTransition;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!origin || reduce || !doc.startViewTransition) {
      update();
      return;
    }

    // Révélation circulaire via l'API View Transitions.
    const transition = doc.startViewTransition(update);
    transition.ready.then(() => {
      const radius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
