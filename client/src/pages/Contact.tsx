import { copyEmail } from "@/components/CommandPalette";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { profile } from "@/data/portfolio";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ArrowUpRight, Copy } from "lucide-react";

export default function Contact() {
  usePageTitle("Contact");

  const channels = [
    { label: "GitHub", value: "Badiane95", href: profile.github },
    { label: "LinkedIn", value: "falou-badiane", href: profile.linkedin },
  ];

  return (
    <section className="container pt-20 md:pt-28">
      <SectionHeader
        as="h1"
        label="Contact"
        title="Parlons-en"
        intro="Un projet, une alternance ou une simple question : écrivez-moi."
      />

      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <FadeIn className="space-y-2">
          <button
            type="button"
            onClick={copyEmail}
            className="group flex w-full items-center justify-between gap-4 border-b border-border py-4 text-left"
          >
            <span>
              <span className="eyebrow block">E-mail</span>
              <span className="mt-1 block break-all text-lg">{profile.email}</span>
            </span>
            <Copy className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            <span className="sr-only">Copier l'adresse</span>
          </button>
          {channels.map(c => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 border-b border-border py-4"
            >
              <span>
                <span className="eyebrow block">{c.label}</span>
                <span className="mt-1 block text-lg">{c.value}</span>
              </span>
              <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </a>
          ))}
        </FadeIn>

        <FadeIn delay={0.1}>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}
