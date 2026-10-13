import { projectsUsing, skillGroups, skillsUsedAtWork } from "@/data/portfolio";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ArrowUpRight, Briefcase } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { EASE_OUT } from "./motion/Reveal";

/**
 * Explorateur de compétences : choisir une techno affiche, en direct,
 * les projets où elle a servi. Les données viennent de la `stack` des projets.
 */
export function SkillExplorer({ initial = "React" }: { initial?: string }) {
  const [selected, setSelected] = useState(initial);
  const related = projectsUsing(selected);
  const atWork = skillsUsedAtWork.includes(selected);

  return (
    <LayoutGroup>
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-8">
          {skillGroups.map(group => (
            <div key={group.id} className="grid gap-3 sm:grid-cols-[11rem_1fr]">
              <h3 className="eyebrow pt-2">{group.title}</h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.skills.map(skill => {
                  const active = skill === selected;
                  const count = projectsUsing(skill).length;
                  return (
                    <li key={skill}>
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setSelected(skill)}
                        className={`relative rounded-md border px-2.5 py-1.5 text-sm transition-colors ${
                          active
                            ? "border-foreground text-background"
                            : "border-border bg-card hover:border-foreground/40"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="skill-active"
                            className="absolute inset-0 rounded-[5px] bg-foreground"
                            transition={{ type: "spring", stiffness: 500, damping: 38 }}
                          />
                        )}
                        <span className="relative">
                          {skill}
                          {count > 0 && (
                            <sup className={`ml-1 font-mono text-[10px] ${active ? "text-background/70" : "text-muted-foreground"}`}>
                              {count}
                            </sup>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <aside
          aria-live="polite"
          className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24"
        >
          <p className="eyebrow">Utilisé dans</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={selected}
              className="mt-2 text-3xl font-medium tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              {selected}
            </motion.p>
          </AnimatePresence>

          <ul className="mt-6 space-y-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {atWork && (
                <motion.li
                  key="work"
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3, ease: EASE_OUT }}
                >
                  <Link
                    href="/about"
                    className="flex items-center gap-3 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2.5 text-sm"
                  >
                    <Briefcase className="size-4 text-primary" />
                    En entreprise chez Unitee
                  </Link>
                </motion.li>
              )}
              {related.map((project, i) => (
                <motion.li
                  key={project.slug}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04, duration: 0.3, ease: EASE_OUT } }}
                  exit={{ opacity: 0, x: 10, transition: { duration: 0.15 } }}
                >
                  <Link
                    href={`/projects#${project.slug}`}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:border-foreground/40"
                  >
                    <span className="min-w-0 truncate">{project.title}</span>
                    <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
                      {project.year}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {related.length === 0 && !atWork && (
            <p className="mt-4 text-sm text-muted-foreground">
              Pas encore de projet public avec cette techno sur ce site.
            </p>
          )}
        </aside>
      </div>
    </LayoutGroup>
  );
}
