import { FadeIn } from "@/components/motion/Reveal";
import { CefrScale } from "@/components/parcours/CefrScale";
import { GitLog } from "@/components/parcours/GitLog";
import { SectionHeader } from "@/components/SectionHeader";
import { languages, profile, qualities } from "@/data/portfolio";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Download } from "lucide-react";

export default function About() {
  usePageTitle("Parcours");

  return (
    <section className="container pt-20 md:pt-28">
      <SectionHeader
        as="h1"
        label="Parcours"
        title="Entre code et données"
        intro={
          <>
            {profile.pitch} {profile.interests}
          </>
        }
        aside={
          <a
            href={profile.cv}
            download
            className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="size-4" /> Télécharger le CV
          </a>
        }
      />

      <FadeIn>
        <h2 className="eyebrow mb-4">
          Historique · formation et entreprise, de la plus récente à la plus ancienne étape
        </h2>
        <GitLog />
        <p className="mt-3 text-sm text-muted-foreground">
          Ouvrez une étape pour le détail. Les deux branches avancent en parallèle depuis 2025 : c'est l'alternance.
        </p>
      </FadeIn>

      <div className="mt-20 grid gap-16 md:grid-cols-2">
        <FadeIn>
          <h2 className="eyebrow mb-6">Langues</h2>
          <div className="space-y-6">
            {languages.map(l => (
              <CefrScale key={l.name} {...l} />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h2 className="eyebrow mb-6">Qualités</h2>
          <ul className="flex flex-wrap gap-2">
            {qualities.map(q => (
              <li key={q} className="rounded-md border border-border bg-card px-3 py-1.5">
                {q}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
