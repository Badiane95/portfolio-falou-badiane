import { useEffect } from "react";
import { profile } from "@/data/portfolio";

/** Met à jour le titre de l'onglet pour la page courante. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${profile.name}` : `${profile.name} — ${profile.role}`;
  }, [title]);
}
