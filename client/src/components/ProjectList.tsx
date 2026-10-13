import { ProjectImage } from "@/components/ProjectImage";
import { VideoFacade } from "@/components/VideoFacade";
import type { Project } from "@/data/portfolio";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { ArrowUpRight, Github, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { EASE_OUT } from "./motion/Reveal";

type Props =
  | { projects: Project[]; mode: "link" }
  | { projects: Project[]; mode: "expand"; openSlug: string | null; onToggle: (slug: string) => void };

/**
 * Liste éditoriale de projets. Sur un écran avec souris, un aperçu de l'image
 * suit le curseur et s'incline selon sa vitesse.
 */
export function ProjectList(props: Props) {
  const { projects } = props;
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();
  const withPreview = finePointer && !reduce;

  const [hovered, setHovered] = useState<string | null>(null);
  const [armed, setArmed] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const velocityX = useVelocity(springX);
  const rotate = useTransform(velocityX, [-1500, 0, 1500], [-7, 0, 7], { clamp: true });

  const openSlug = props.mode === "expand" ? props.openSlug : null;
  const previewSlug = hovered && hovered !== openSlug ? hovered : null;

  return (
    <div
      className="relative"
      onPointerMove={
        withPreview
          ? e => {
              x.set(e.clientX);
              y.set(e.clientY);
            }
          : undefined
      }
      onPointerEnter={withPreview ? () => setArmed(true) : undefined}
      onPointerLeave={() => setHovered(null)}
    >
      <ul className="border-t border-border">
        {projects.map((project, index) => {
          const open = openSlug === project.slug;
          const row = (
            <RowContent project={project} index={index} open={open} mode={props.mode} />
          );
          const rowClass =
            "group relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 text-left md:grid-cols-[3.5rem_1fr_14rem_4rem_2rem] md:py-7";

          return (
            <li
              key={project.slug}
              id={project.slug}
              className="relative scroll-mt-24 border-b border-border"
              onPointerEnter={() => setHovered(project.slug)}
            >
              {props.mode === "link" ? (
                <Link href={`/projects#${project.slug}`} className={rowClass}>
                  {row}
                </Link>
              ) : (
                <button
                  type="button"
                  className={rowClass}
                  aria-expanded={open}
                  aria-controls={`details-${project.slug}`}
                  onClick={() => props.onToggle(project.slug)}
                >
                  {row}
                </button>
              )}

              {props.mode === "expand" && (
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={`details-${project.slug}`}
                      key="details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <ProjectDetails project={project} index={index} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ul>

      {withPreview && armed && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[190px] w-[300px] overflow-hidden rounded-lg shadow-2xl shadow-black/20 md:block"
          style={{ x: springX, y: springY, rotate, marginLeft: 28, marginTop: -95 }}
          initial={false}
          animate={{ opacity: previewSlug ? 1 : 0, scale: previewSlug ? 1 : 0.85 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          {projects.map((p, i) => (
            <motion.div
              key={p.slug}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: previewSlug === p.slug ? 1 : 0, scale: previewSlug === p.slug ? 1 : 1.08 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <ProjectImage src={p.image} title={p.title} index={i} className="size-full" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function RowContent({
  project,
  index,
  open,
  mode,
}: {
  project: Project;
  index: number;
  open: boolean;
  mode: "link" | "expand";
}) {
  return (
    <>
      {/* Trait qui se dessine sous la ligne au survol */}
      <span
        aria-hidden="true"
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2">
        <span className="block text-xl font-medium tracking-tight md:text-2xl">
          {project.title}
          {project.status && (
            <span className="ml-3 inline-flex translate-y-[-3px] items-center gap-1.5 rounded-full border border-primary/30 px-2 py-0.5 align-middle font-mono text-[10px] uppercase tracking-wider text-primary">
              <span className="size-1.5 animate-pulse rounded-full bg-primary" />
              {project.status}
            </span>
          )}
        </span>
        <span className="mt-1 block text-sm text-muted-foreground">{project.context}</span>
      </span>
      <span className="hidden truncate font-mono text-xs text-muted-foreground md:block">
        {project.stack.slice(0, 3).join(" · ")}
      </span>
      <span className="hidden font-mono text-xs text-muted-foreground md:block">{project.year}</span>
      <span className="justify-self-end text-muted-foreground transition-colors group-hover:text-foreground">
        {mode === "link" ? (
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        ) : (
          <Plus className={`size-5 transition-transform duration-500 ${open ? "rotate-45" : ""}`} />
        )}
      </span>
    </>
  );
}

function ProjectDetails({ project, index }: { project: Project; index: number }) {
  return (
    <div className="grid gap-8 pb-10 md:grid-cols-[3.5rem_1fr] md:gap-x-4">
      <div className="hidden md:block" />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <ProjectImage
          src={project.image}
          title={project.title}
          index={index}
          eager
          className="aspect-[16/10] w-full rounded-lg"
        />
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-muted-foreground">{project.details}</p>
          <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.stack.map(tech => (
              <li key={tech} className="rounded-md border border-border bg-card px-2 py-1 font-mono text-xs">
                {tech}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm text-background transition-colors hover:bg-primary"
              >
                Voir le projet <ArrowUpRight className="size-4" />
              </a>
            )}
            {project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-foreground"
              >
                <Github className="size-4" /> Code source
              </a>
            )}
          </div>
        </div>
        {project.videos && (
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {project.videos.map(v => (
              <VideoFacade key={v.id} id={v.id} title={v.title} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
