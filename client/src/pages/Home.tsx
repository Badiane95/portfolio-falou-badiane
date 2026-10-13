import { copyEmail } from "@/components/CommandPalette";
import { CountUp } from "@/components/motion/CountUp";
import { DotField } from "@/components/motion/DotField";
import { FadeIn, SplitLetters } from "@/components/motion/Reveal";
import { ScrambleText } from "@/components/motion/ScrambleText";
import { ProjectList } from "@/components/ProjectList";
import { SectionHeader } from "@/components/SectionHeader";
import { metrics, profile, projects } from "@/data/portfolio";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ArrowRight, ArrowUpRight, Copy, Download } from "lucide-react";
import { Link } from "wouter";

const services = [
  {
    title: "Full-stack",
    text: "Applications React typées de bout en bout : API tRPC ou REST, base SQL ou NoSQL, tests.",
    stack: "React · TypeScript · Node.js · tRPC · MySQL",
  },
  {
    title: "Automatisation & IA",
    text: "Workflows IA et scripts de web scraping qui transforment des données brutes en décisions.",
    stack: "Workflows IA · Puppeteer · Python · Data viz",
  },
  {
    title: "Interfaces",
    text: "Maquettes Figma intégrées au pixel près, responsive, accessibles et animées avec retenue.",
    stack: "Figma · Tailwind CSS · Framer Motion",
  },
];

export default function Home() {
  usePageTitle();
  const featured = projects.filter(p => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <DotField className="opacity-70 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_75%)]" />
        <div className="container relative pb-16 pt-20 md:pb-24 md:pt-32">
          <p className="eyebrow">
            <ScrambleText text={`${profile.role} — ${profile.location}`} delay={250} />
          </p>
          <h1 className="mt-6 text-[clamp(3.5rem,13vw,10rem)] font-medium leading-[0.88] tracking-[-0.05em]">
            <SplitLetters text="Falou" delay={0.1} className="block" />
            <SplitLetters text="Badiane" delay={0.25} className="block text-primary" />
          </h1>

          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <FadeIn delay={0.7}>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{profile.pitch}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="group inline-flex h-12 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-primary"
                >
                  Voir les projets
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={profile.cv}
                  download
                  className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-background/60 px-5 text-sm font-medium backdrop-blur transition-colors hover:border-foreground"
                >
                  <Download className="size-4" /> CV (PDF)
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.9}>
              <Link
                href="/about"
                className="block max-w-xs rounded-xl border border-border bg-card/80 p-4 backdrop-blur transition-colors hover:border-foreground/40"
              >
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#1f7a4d] opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#1f7a4d]" />
                  </span>
                  En poste
                </span>
                <span className="mt-2 block text-sm">
                  Développeur web & automatisation chez <strong className="font-medium">Unitee</strong>, depuis septembre 2025.
                </span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Sélection de projets */}
      <section className="container pt-24 md:pt-32">
        <SectionHeader
          index="01"
          label="Sélection"
          title="Projets récents"
          aside={
            <Link href="/projects" className="link-underline inline-flex items-center gap-1 text-sm">
              Les {projects.length} projets <ArrowUpRight className="size-4" />
            </Link>
          }
        />
        <ProjectList projects={featured} mode="link" />
      </section>

      {/* Ce que je fais */}
      <section className="container pt-24 md:pt-32">
        <SectionHeader index="02" label="Savoir-faire" title="Ce que je fais" />
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08} className="flex flex-col gap-4 bg-background p-6 md:p-8">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <h3 className="text-2xl font-medium tracking-tight">{s.title}</h3>
              <p className="text-muted-foreground">{s.text}</p>
              <p className="mt-auto pt-4 font-mono text-xs text-muted-foreground">{s.stack}</p>
            </FadeIn>
          ))}
        </div>
        <FadeIn className="mt-6">
          <Link href="/skills" className="link-underline inline-flex items-center gap-1 text-sm">
            Explorer les compétences, techno par techno <ArrowUpRight className="size-4" />
          </Link>
        </FadeIn>
      </section>

      {/* Chiffres */}
      <section className="container pt-24 md:pt-32">
        <SectionHeader
          index="03"
          label="En entreprise"
          title="Des résultats mesurés"
          intro="Chez Unitee (Station Numixs), depuis septembre 2025 : automatisation, scraping et développement full-stack."
        />
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {metrics.map(m => (
            <FadeIn key={m.label} className="border-t border-foreground pt-4">
              <dt className="sr-only">{m.label}</dt>
              <dd className="text-5xl font-medium tracking-tight md:text-6xl">
                <CountUp value={m.value} suffix={m.suffix} />
              </dd>
              <dd className="mt-2 text-sm text-muted-foreground">{m.label}</dd>
            </FadeIn>
          ))}
        </dl>
      </section>

      {/* Appel au contact */}
      <section className="container pt-24 md:pt-32">
        <div className="rounded-2xl bg-foreground px-6 py-14 text-background md:px-12 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-background/60">04 / Contact</p>
          <Link href="/contact" className="group mt-6 block text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.04em]">
            <ScrambleText text="Parlons de votre projet" replayOnHover duration={700} />
            <ArrowUpRight className="ml-2 inline size-[0.7em] align-baseline transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-background/70">
            <button type="button" onClick={copyEmail} className="inline-flex items-center gap-2 hover:text-background">
              <Copy className="size-4" /> {profile.email}
            </button>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-background">
              LinkedIn ↗
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-background">
              GitHub ↗
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
