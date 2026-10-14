import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "@/contexts/ThemeContext";
import { profile, projects } from "@/data/portfolio";
import { THEMES } from "@/lib/themes";
import { ArrowUpRight, Check, Copy, CornerDownLeft, Download, FileCode2, Github, Linkedin, Palette } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/projects" },
  { label: "Compétences", href: "/skills" },
  { label: "Parcours", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PaletteContext = createContext<{ open: () => void }>({ open: () => {} });

export const useCommandPalette = () => useContext(PaletteContext);

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast.success("Adresse e-mail copiée");
  } catch {
    toast.error(`Copie impossible : ${profile.email}`);
  }
}

/** Palette de commandes (⌘K / Ctrl+K) pour naviguer au clavier. */
export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Le remplissage automatique de Chrome émet des keydown sans `key` : on les ignore.
      if (typeof e.key === "string" && e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const external = (url: string) => () => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <PaletteContext.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <CommandDialog
        open={isOpen}
        onOpenChange={setOpen}
        title="Palette de commandes"
        description="Rechercher une page, un projet ou une action"
        showCloseButton={false}
      >
        <CommandInput placeholder="Aller à une page, un projet, une action…" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          <CommandGroup heading="Pages">
            {NAV_LINKS.map(link => (
              <CommandItem key={link.href} value={`page ${link.label}`} onSelect={() => run(() => navigate(link.href))}>
                <CornerDownLeft />
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Projets">
            {projects.map(p => (
              <CommandItem
                key={p.slug}
                value={`projet ${p.title} ${p.stack.join(" ")}`}
                onSelect={() => run(() => navigate(`/projects#${p.slug}`))}
              >
                <FileCode2 />
                {p.title}
                <CommandShortcut>{p.year}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Thème">
            {THEMES.map(t => (
              <CommandItem
                key={t.id}
                value={`thème couleur ${t.label}`}
                onSelect={() => run(() => setTheme(t.id, { x: window.innerWidth / 2, y: window.innerHeight / 2 }))}
              >
                <Palette />
                Thème {t.label.toLowerCase()}
                {theme === t.id && (
                  <CommandShortcut>
                    <Check className="size-3.5" />
                  </CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Actions">
            <CommandItem value="copier e-mail email" onSelect={() => run(copyEmail)}>
              <Copy />
              Copier mon adresse e-mail
            </CommandItem>
            <CommandItem value="télécharger cv" onSelect={() => run(external(profile.cv))}>
              <Download />
              Ouvrir le CV (PDF)
            </CommandItem>
            <CommandItem value="github" onSelect={() => run(external(profile.github))}>
              <Github />
              GitHub
              <CommandShortcut><ArrowUpRight className="size-3.5" /></CommandShortcut>
            </CommandItem>
            <CommandItem value="linkedin" onSelect={() => run(external(profile.linkedin))}>
              <Linkedin />
              LinkedIn
              <CommandShortcut><ArrowUpRight className="size-3.5" /></CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </PaletteContext.Provider>
  );
}
