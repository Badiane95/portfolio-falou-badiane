import { FadeIn } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { education, experience, languages, profile, qualities } from "@/data/portfolio";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { ReactNode } from "react";

function Timeline({ children }: { children: ReactNode }) {
  return (
    <div className="relative pl-6">
      {/* Fil du temps qui se dessine au défilement */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-1 h-full w-px origin-top bg-foreground"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -20% 0px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <ol className="space-y-10">{children}</ol>
    </div>
  );
}

function Entry({ period, title, place, children }: { period: string; title: string; place: string; children?: ReactNode }) {
  return (
    <li className="relative">
      <span aria-hidden="true" className="absolute -left-[29px] top-1.5 size-[9px] rounded-full border border-foreground bg-background" />
      <FadeIn>
        <p className="font-mono text-xs text-muted-foreground">{period}</p>
        <h3 className="mt-1 text-xl font-medium tracking-tight">{title}</h3>
        <p className="text-sm text-primary">{place}</p>
        {children}
      </FadeIn>
    </li>
  );
}

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
            className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            <Download className="size-4" /> Télécharger le CV
          </a>
        }
      />

      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <h2 className="eyebrow mb-8">Expérience</h2>
          <Timeline>
            {experience.map(e => (
              <Entry key={e.period} period={e.period} title={e.title} place={e.place}>
                <p className="mt-1 text-sm text-muted-foreground">{e.location}</p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  {e.points.map(point => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-muted-foreground" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Entry>
            ))}
          </Timeline>
        </div>

        <div className="space-y-16">
          <div>
            <h2 className="eyebrow mb-8">Formation</h2>
            <Timeline>
              {education.map(e => (
                <Entry key={e.title} period={e.period} title={e.title} place={e.place}>
                  {e.note && <p className="mt-2 text-sm text-muted-foreground">{e.note}</p>}
                </Entry>
              ))}
            </Timeline>
          </div>

          <FadeIn>
            <h2 className="eyebrow mb-4">Langues</h2>
            <ul className="space-y-1 text-lg">
              {languages.map(l => (
                <li key={l.name}>
                  {l.name} <span className="text-muted-foreground">— {l.level}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn>
            <h2 className="eyebrow mb-4">Qualités</h2>
            <ul className="flex flex-wrap gap-1.5">
              {qualities.map(q => (
                <li key={q} className="rounded-md border border-border bg-card px-2.5 py-1 text-sm">
                  {q}
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
