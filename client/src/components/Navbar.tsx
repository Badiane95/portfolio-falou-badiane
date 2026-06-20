import { useState, useEffect, useRef, useCallback } from "react";
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
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => { setMounted(true); }, []);

  const updateIndicator = useCallback(() => {
    const activeIdx = NAV_LINKS.findIndex((l) =>
      l.href === "/" ? location === "/" : location.startsWith(l.href),
    );
    const el = itemRefs.current[activeIdx];
    const nav = navRef.current;
    if (!el || !nav) { setIndicator((s) => ({ ...s, opacity: 0 })); return; }
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setIndicator({ left: elRect.left - navRect.left, width: elRect.width, opacity: 1 });
  }, [location]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 8);
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);
  useEffect(() => { updateIndicator(); }, [updateIndicator]);
  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#0052CC] via-[#06B6D4] to-[#0052CC] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%`, opacity: scrollProgress > 0 ? 1 : 0 }}
        />
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100/80"
            : "bg-white/50 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">

          {/* Logo */}
          <a
            href="/"
            className="relative inline-flex flex-col text-xl md:text-2xl font-bold text-[#0052CC] hover:text-[#003d99] transition-colors group"
            aria-label="Retour à l'accueil"
          >
            <span>
              Falou<span className="text-[#06B6D4]">.</span>
            </span>
            <span
              className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-gradient-to-r from-[#0052CC] to-[#06B6D4] rounded-full group-hover:w-full transition-all duration-300 ease-out"
            />
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul ref={navRef} className="relative flex items-center gap-1">
              {/* Sliding Indicator */}
              <span
                aria-hidden="true"
                style={{
                  left: indicator.left,
                  width: indicator.width,
                  opacity: indicator.opacity,
                  transition:
                    "left 450ms cubic-bezier(0.34, 1.56, 0.64, 1), width 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 250ms ease",
                }}
                className="absolute bottom-0 h-[2px] bg-gradient-to-r from-[#0052CC] to-[#06B6D4] rounded-full pointer-events-none"
              />

              {NAV_LINKS.map((link, idx) => {
                const isActive = link.href === "/" ? location === "/" : location.startsWith(link.href);
                return (
                  <li
                    key={link.href}
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    className="relative"
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? "translateY(0)" : "translateY(-10px)",
                      transition: `opacity 450ms ease ${idx * 80}ms, transform 450ms ease ${idx * 80}ms`,
                    }}
                  >
                    <a
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium block transition-all duration-200 ${
                        isActive
                          ? "text-[#0052CC]"
                          : "text-[#374151] hover:text-[#0052CC] hover:bg-[#0052CC]/5"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#06B6D4] animate-pulse" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Hamburger */}
          <button
            className="md:hidden relative z-50 p-2 rounded-lg text-[#1f2937] hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0052CC]"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <span className="flex flex-col gap-1.5 w-6" aria-hidden="true">
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
      </header>

      {/* Mobile Overlay */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-all duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
      />

      {/* Mobile Menu (slide-in from right) */}
      <div
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`fixed top-0 right-0 z-40 h-full w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-100 transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col pt-20 pb-6 px-6 h-full">
          <nav aria-label="Navigation mobile">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, idx) => {
                const isActive = link.href === "/" ? location === "/" : location.startsWith(link.href);
                return (
                  <li
                    key={link.href}
                    style={{
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen ? "translateX(0)" : "translateX(20px)",
                      transition: `opacity 350ms ease ${idx * 80 + 100}ms, transform 350ms ease ${idx * 80 + 100}ms`,
                    }}
                  >
                    <a
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeMobile}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                        isActive
                          ? "text-[#0052CC] bg-[#0052CC]/8"
                          : "text-[#374151] hover:bg-gray-50 hover:text-[#0052CC]"
                      }`}
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
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">Falou Badiane &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
