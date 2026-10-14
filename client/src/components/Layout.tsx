import { CommandPaletteProvider } from "@/components/CommandPalette";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { EASE_OUT } from "./motion/Reveal";

/**
 * `location` est passé par l'appelant (et au <Switch>) pour que la page
 * sortante garde son contenu pendant l'animation de sortie.
 */
export function Layout({ location, children }: { location: string; children: ReactNode }) {
  // Chaque nouvelle page repart du haut, sauf si l'URL vise une ancre.
  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);

  return (
    <CommandPaletteProvider>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        Aller au contenu
      </a>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location}
          id="contenu"
          tabIndex={-1}
          className="outline-none"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </CommandPaletteProvider>
  );
}
