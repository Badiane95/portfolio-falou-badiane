import { ScrambleText } from "@/components/motion/ScrambleText";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function NotFound() {
  usePageTitle("Page introuvable");
  const [location] = useLocation();

  return (
    <section className="container flex min-h-[60vh] flex-col justify-center pt-20">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 text-[clamp(5rem,20vw,14rem)] font-medium leading-none tracking-[-0.06em]">
        <ScrambleText text="404" duration={1200} replayOnHover />
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        La page <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">{location}</code>{" "}
        n'existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex w-fit items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Retour à l'accueil
      </Link>
    </section>
  );
}
