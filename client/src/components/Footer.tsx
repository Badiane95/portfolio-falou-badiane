import { NAV_LINKS, copyEmail } from "@/components/CommandPalette";
import { profile } from "@/data/portfolio";
import { ArrowUp } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <p className="text-lg font-medium tracking-tight">{profile.name}</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Site conçu et développé à la main : React, TypeScript, Tailwind CSS, Framer Motion et un canvas 2D.
          </p>
        </div>

        <nav aria-label="Pied de page" className="space-y-3">
          <p className="eyebrow">Pages</p>
          <ul className="space-y-1.5 text-sm">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="link-underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <p className="eyebrow">Ailleurs</p>
          <ul className="space-y-1.5 text-sm">
            <li>
              <a className="link-underline" href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a className="link-underline" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <button type="button" className="link-underline" onClick={copyEmail}>
                Copier l'e-mail
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container flex items-center justify-between border-t border-border py-5 font-mono text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          className="group inline-flex items-center gap-1.5 hover:text-foreground"
        >
          Haut de page
          <ArrowUp className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
