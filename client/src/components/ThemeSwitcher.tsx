import { useTheme } from "@/contexts/ThemeContext";
import { THEMES } from "@/lib/themes";
import { motion } from "framer-motion";
import type { MouseEvent } from "react";

/** Trois pastilles (clair, bleu nuit, noir). Le thème choisi se dévoile en cercle depuis le clic. */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const choose = (id: (typeof THEMES)[number]["id"]) => (e: MouseEvent<HTMLButtonElement>) => {
    if (id === theme) return;
    // Activation au clavier : pas de coordonnées de pointeur, on part du centre du bouton.
    const rect = e.currentTarget.getBoundingClientRect();
    const fromPointer = e.clientX !== 0 || e.clientY !== 0;
    setTheme(id, {
      x: fromPointer ? e.clientX : rect.left + rect.width / 2,
      y: fromPointer ? e.clientY : rect.top + rect.height / 2,
    });
  };

  return (
    <div role="group" aria-label="Thème de couleur" className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
      {THEMES.map(t => {
        const active = t.id === theme;
        return (
          <button
            key={t.id}
            type="button"
            onClick={choose(t.id)}
            aria-pressed={active}
            aria-label={`Thème ${t.label.toLowerCase()}`}
            title={t.label}
            className="relative grid size-6 place-items-center rounded-full"
          >
            {active && (
              <motion.span
                layoutId="theme-ring"
                className="absolute inset-0 rounded-full ring-2 ring-primary"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            <span
              className="size-4 rounded-full border border-foreground/25"
              style={{ backgroundColor: t.swatch }}
            />
          </button>
        );
      })}
    </div>
  );
}
