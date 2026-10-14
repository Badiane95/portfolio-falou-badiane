import { ProjectList } from "@/components/ProjectList";
import { SectionHeader } from "@/components/SectionHeader";
import { projects } from "@/data/portfolio";
import { useHash } from "@/hooks/useHash";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Projects() {
  usePageTitle("Projets");
  const hash = useHash();
  const [, navigate] = useLocation();
  const openSlug = projects.some(p => p.slug === hash) ? hash : null;

  // Une URL /projects#slug ouvre le projet et l'amène à l'écran.
  useEffect(() => {
    if (!openSlug) return;
    const t = setTimeout(() => {
      document.getElementById(openSlug)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(t);
  }, [openSlug]);

  const toggle = (slug: string) =>
    navigate(openSlug === slug ? "/projects" : `/projects#${slug}`, { replace: true });

  return (
    <section className="container pt-20 md:pt-28">
      <SectionHeader
        as="h1"
        label="Projets"
        title="Ce que j'ai construit"
        intro="Projets universitaires, personnels et créatifs. Ouvrez une ligne pour le détail, la stack et les liens."
        aside={<p className="font-mono text-sm text-muted-foreground">{String(projects.length).padStart(2, "0")} projets</p>}
      />
      <ProjectList projects={projects} mode="expand" openSlug={openSlug} onToggle={toggle} />
    </section>
  );
}
