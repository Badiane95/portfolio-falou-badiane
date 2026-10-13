import { SectionHeader } from "@/components/SectionHeader";
import { SkillExplorer } from "@/components/SkillExplorer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Skills() {
  usePageTitle("Compétences");

  return (
    <section className="container pt-20 md:pt-28">
      <SectionHeader
        as="h1"
        label="Compétences"
        title="Ma boîte à outils"
        intro="Choisissez une techno : la liste des projets où je l'ai utilisée se met à jour. Le petit chiffre indique le nombre de projets concernés."
      />
      <SkillExplorer />
    </section>
  );
}
