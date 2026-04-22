import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Compétences", href: "/skills" },
  { label: "Projets", href: "/projects" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Sliding active indicator
  useEffect(() => {
    const activeIdx = NAV_LINKS.findIndex((l) => {
      if (l.href === "/") return location === "/";
      return location.startsWith(l.href);
    });
    const el = itemRefs.current[activeIdx];
    const nav = navRef.current;
    if (!el || !nav) {
      setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicatorStyle({
      left: elRect.left - navRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-white border-b border-gray-100"
      }`}
    >
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        {/* Logo */}
        <a
          href="/"
          className="text-xl md:text-2xl font-bold text-[#0052CC] hover:text-[#003d99] transition-colors relative group"
          aria-label="Accueil"
        >
          <span className="relative">
            Falou
            <span className="text-[#06B6D4]">.</span>
          </span>
          {/* underline micro-interaction */}
          <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-[#06B6D4] group-hover:w-full transition-all duration-300 rounded-full" />
        </a>

        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul ref={navRef} className="relative flex items-center gap-1">
            {/* Sliding pill indicator */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 h-full rounded-lg bg-[#0052CC]/8 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
              }}
            />
            {NAV_LINKS.map((link, idx) => {
              const isActive =
                link.href === "/"
                  ? location === "/"
                  : location.startsWith(link.href);
              return (
                <li
                  key={link.href}
                  ref={(el) => { itemRefs.current[idx] = el; }}
                  className="relative"
                >
                  <a
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 block ${
                      isActive
                        ? "text-[#0052CC]"
                        : "text-[#374151] hover:text-[#0052CC]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    {/* active dot */}
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#06B6D4]" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#1f2937] hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={mobileOpen}
        >
          {/* Animated hamburger → X */}
          <span className="flex flex-col gap-1.5 w-6">
            <span
              className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0 scale-x-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu — slide down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 border-t border-gray-100" : "max-h-0"
        } bg-white`}
        aria-hidden={!mobileOpen}
      >
        <ul className="flex flex-col py-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? location === "/"
                : location.startsWith(link.href);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`flex items-center justify-between px-6 py-4 text-base font-medium border-b border-gray-50 last:border-0 transition-colors ${
                    isActive
                      ? "text-[#0052CC] bg-[#0052CC]/5"
                      : "text-[#1f2937] hover:bg-gray-50 hover:text-[#0052CC]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] flex-shrink-0" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
