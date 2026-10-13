import { NAV_LINKS, useCommandPalette } from "@/components/CommandPalette";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { profile } from "@/data/portfolio";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { EASE_OUT } from "./motion/Reveal";

const isActive = (href: string, location: string) =>
  href === "/" ? location === "/" : location.startsWith(href);

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { open: openPalette } = useCommandPalette();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useEffect(() => setMenuOpen(false), [location]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const links = NAV_LINKS.filter(l => l.href !== "/");
  // La pastille suit le lien survolé, sinon revient sur la page courante.
  const highlighted = hovered ?? links.find(l => isActive(l.href, location))?.href ?? null;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${profile.name}, accueil`}>
          <span className="grid size-8 place-items-center rounded-md bg-foreground font-mono text-xs font-medium text-background transition-transform duration-300 group-hover:-rotate-6">
            FB
          </span>
          <span className="hidden text-sm font-medium sm:inline">{profile.name}</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
            {links.map(link => {
              const active = isActive(link.href, location);
              return (
                <li key={link.href} className="relative">
                  {highlighted === link.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-secondary"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(link.href)}
                    onFocus={() => setHovered(link.href)}
                    onBlur={() => setHovered(null)}
                    className={`relative block px-3 py-1.5 text-sm transition-colors ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {active && <span className="absolute -bottom-[13px] left-3 right-3 h-px bg-primary" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground sm:flex"
            aria-label="Ouvrir la palette de commandes (Ctrl+K)"
          >
            Rechercher
            <kbd className="rounded border border-border px-1 text-[10px]">⌘K</kbd>
          </button>

          <button
            type="button"
            className="relative grid size-10 place-items-center rounded-md md:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen(o => !o)}
          >
            <span
              className={`absolute h-px w-5 bg-foreground transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1"}`}
            />
            <span
              className={`absolute h-px w-5 bg-foreground transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1"}`}
            />
          </button>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 right-0 h-px origin-left bg-primary"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            className="overflow-hidden border-t border-border md:hidden"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <ul className="container py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: EASE_OUT }}
                >
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href, location) ? "page" : undefined}
                    className="flex items-baseline gap-3 py-2.5 text-2xl font-medium tracking-tight aria-[current=page]:text-primary"
                  >
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
