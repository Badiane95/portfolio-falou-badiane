import type { ReactNode } from "react";
import { FadeIn, MaskReveal } from "./motion/Reveal";

export function SectionHeader({
  index,
  label,
  title,
  intro,
  as: Heading = "h2",
  aside,
}: {
  index?: string;
  label: string;
  title: string;
  intro?: ReactNode;
  as?: "h1" | "h2";
  aside?: ReactNode;
}) {
  return (
    <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow">
          {index && <span className="text-primary">{index} / </span>}
          {label}
        </p>
        <Heading
          className={`mt-4 font-medium tracking-[-0.03em] ${
            Heading === "h1" ? "text-5xl leading-[0.95] md:text-7xl" : "text-4xl leading-none md:text-5xl"
          }`}
        >
          <MaskReveal>{title}</MaskReveal>
        </Heading>
        {intro && (
          <FadeIn delay={0.15} className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {intro}
          </FadeIn>
        )}
      </div>
      {aside && <FadeIn delay={0.2}>{aside}</FadeIn>}
    </div>
  );
}
