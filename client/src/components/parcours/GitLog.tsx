import { education, experience } from "@/data/portfolio";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { EASE_OUT } from "../motion/Reveal";
import { TypedCommand } from "./TypedCommand";
import { WeekRhythm } from "./WeekRhythm";

/*
 * Le parcours présenté comme un `git log --graph` : une branche « formation »
 * et une branche « entreprise » qui s'en détache. Le graphe est dessiné en CSS
 * (une colonne par branche) à partir des dates de début des étapes.
 */

type Lane = "formation" | "entreprise";
type Filter = Lane | "tout";

const LANE_X: Record<Lane, number> = { formation: 14, entreprise: 42 };
// Hauteur (px) du nœud depuis le haut de la ligne, alignée sur la 1re ligne de texte.
const NODE_Y = 24;
const LANE_BG: Record<Lane, string> = { formation: "bg-success", entreprise: "bg-primary" };
const LANE_BORDER: Record<Lane, string> = { formation: "border-success", entreprise: "border-primary" };
const LANE_TEXT: Record<Lane, string> = { formation: "text-success", entreprise: "text-primary" };
const LANE_STROKE: Record<Lane, string> = { formation: "stroke-success", entreprise: "stroke-primary" };

type Commit = {
  id: string;
  lane: Lane;
  start: string;
  period: string;
  title: string;
  place: string;
  location?: string;
  points?: string[];
  note?: string;
  rhythm?: { ecole: number; entreprise: number };
  current?: boolean;
};

/** Empreinte courte et stable (djb2) pour habiller chaque étape comme un commit. */
function shortHash(text: string) {
  let h = 5381;
  for (const char of text) h = ((h << 5) + h + char.charCodeAt(0)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 7);
}

const COMMITS: Commit[] = [
  ...experience.map(e => ({ ...e, lane: "entreprise" as const })),
  ...education.map(e => ({ ...e, lane: "formation" as const })),
]
  .sort((a, b) => b.start.localeCompare(a.start))
  .map(c => ({ ...c, id: shortHash(c.title + c.start) }));

// Pour chaque branche : sa plus ancienne étape, et l'étape « parente » dont elle part.
const FIRST: Record<Lane, number> = {
  formation: COMMITS.map(c => c.lane).lastIndexOf("formation"),
  entreprise: COMMITS.map(c => c.lane).lastIndexOf("entreprise"),
};
const PARENT: Record<Lane, number | null> = {
  formation: null,
  entreprise: (() => {
    const i = COMMITS.findIndex((c, idx) => idx > FIRST.entreprise && c.lane === "formation");
    return i === -1 ? null : i;
  })(),
};
// L'étiquette de branche va sur l'étape la plus récente de chaque branche ; HEAD sur la toute première.
const BRANCH_TIP: Record<Lane, number> = {
  formation: COMMITS.findIndex(c => c.lane === "formation"),
  entreprise: COMMITS.findIndex(c => c.lane === "entreprise"),
};

type Segment = "above" | "below" | "through";

function segmentsFor(lane: Lane, row: number): Segment[] {
  const first = FIRST[lane];
  const parent = PARENT[lane];
  if (COMMITS[row].lane === lane) {
    const below = row < first || (row === first && parent !== null);
    return below ? ["above", "below"] : ["above"];
  }
  const through = row < first || (parent !== null && row > first && row < parent);
  return through ? ["through"] : [];
}

const LANES: Lane[] = ["formation", "entreprise"];

export function GitLog() {
  const [filter, setFilter] = useState<Filter>("tout");
  const [open, setOpen] = useState<Set<string>>(() => new Set([COMMITS[0].id]));

  const toggle = (id: string) =>
    setOpen(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const dimmed = (lane: Lane) => filter !== "tout" && filter !== lane;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {/* Barre de fenêtre + filtres de branche */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">parcours — git log</span>
        </div>
        <LayoutGroup id="git-filter">
          <div role="group" aria-label="Filtrer par branche" className="flex gap-1 font-mono text-xs">
            {(["tout", ...LANES] as Filter[]).map(f => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`relative rounded-md px-2.5 py-1 transition-colors ${
                  filter === f ? "text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === f && (
                  <motion.span
                    layoutId="git-filter-pill"
                    className="absolute inset-0 rounded-md bg-foreground"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {f !== "tout" && <span aria-hidden="true" className={`size-2 rounded-full ${LANE_BG[f]}`} />}
                  {f}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="px-4 pb-4 pt-5 md:px-6">
        <TypedCommand prompt="~/parcours $" command="git log --graph --all" />

        {/* Haut du graphe : les deux branches arrivent à aujourd'hui */}
        <div aria-hidden="true" className="relative mt-4 grid h-8 grid-cols-[64px_1fr]">
          <div className="relative">
            {LANES.map(lane => (
              <span
                key={lane}
                className={`absolute bottom-0 top-0 w-[2px] -translate-x-1/2 transition-opacity duration-300 ${LANE_BG[lane]} [mask-image:linear-gradient(to_bottom,transparent,black)]`}
                style={{ left: LANE_X[lane], opacity: dimmed(lane) ? 0.25 : 1 }}
              />
            ))}
          </div>
          <span className="self-start font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            aujourd'hui
          </span>
        </div>

        <ol>
          {COMMITS.map((commit, row) => {
            const isOpen = open.has(commit.id);
            const detailsId = `etape-${commit.id}`;
            const tips = LANES.filter(lane => BRANCH_TIP[lane] === row);
            return (
              <motion.li
                key={commit.id}
                className="relative grid grid-cols-[64px_1fr]"
                animate={{ opacity: dimmed(commit.lane) ? 0.35 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Graphe de la ligne */}
                <div aria-hidden="true" className="relative">
                  {LANES.map(lane =>
                    segmentsFor(lane, row).map(seg => (
                      <motion.span
                        key={`${lane}-${seg}`}
                        className={`absolute w-[2px] -translate-x-1/2 origin-top transition-opacity duration-300 ${LANE_BG[lane]}`}
                        style={{
                          left: LANE_X[lane],
                          top: seg === "below" ? NODE_Y : 0,
                          ...(seg === "above" ? { height: NODE_Y } : { bottom: 0 }),
                          opacity: dimmed(lane) ? 0.25 : 1,
                        }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                        transition={{ duration: 0.5, ease: EASE_OUT, delay: seg === "below" ? 0.25 : 0 }}
                      />
                    ))
                  )}

                  {/* Départ de branche : courbe depuis l'étape parente */}
                  {LANES.filter(lane => PARENT[lane] === row).map(lane => (
                    <svg
                      key={`branche-${lane}`}
                      className="absolute left-0 top-0 overflow-visible transition-opacity duration-300"
                      width="64"
                      height={NODE_Y}
                      style={{ opacity: dimmed(lane) ? 0.25 : 1 }}
                    >
                      <motion.path
                        d={`M ${LANE_X[commit.lane]} ${NODE_Y} C ${LANE_X[commit.lane]} ${NODE_Y * 0.4}, ${LANE_X[lane]} ${NODE_Y * 0.6}, ${LANE_X[lane]} 0`}
                        fill="none"
                        strokeWidth="2"
                        className={LANE_STROKE[lane]}
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.3 }}
                      />
                    </svg>
                  ))}

                  {/* Nœud de l'étape */}
                  <motion.span
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: LANE_X[commit.lane], top: NODE_Y }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 420, damping: 22, delay: 0.15 }}
                  >
                    {commit.current && (
                      <span
                        className={`absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping ${LANE_BG[commit.lane]}`}
                      />
                    )}
                    <span
                      className={`relative block size-3.5 rounded-full border-2 ${LANE_BORDER[commit.lane]} ${
                        commit.current ? LANE_BG[commit.lane] : "bg-card"
                      }`}
                    />
                  </motion.span>
                </div>

                {/* Contenu de l'étape */}
                <div className="min-w-0 pb-7 pt-3">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    onClick={() => toggle(commit.id)}
                    className="group grid w-full grid-cols-[1fr_auto] gap-x-3 text-left"
                  >
                    <span className="flex min-h-6 min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
                      <span className="text-muted-foreground">{commit.id}</span>
                      {tips.map(lane => (
                        <span
                          key={lane}
                          className={`rounded-full border px-2 py-px ${LANE_BORDER[lane]} ${LANE_TEXT[lane]}`}
                        >
                          {row === 0 ? `HEAD → ${lane}` : lane}
                        </span>
                      ))}
                      <span className="text-muted-foreground">{commit.period}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`row-span-3 mt-1 size-4 text-muted-foreground transition-transform duration-300 group-hover:text-foreground ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                    <span className="mt-1 block text-lg font-medium leading-snug tracking-tight transition-colors group-hover:text-primary md:text-xl">
                      {commit.title}
                    </span>
                    <span className={`block text-sm ${LANE_TEXT[commit.lane]}`}>{commit.place}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={detailsId}
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-3 text-muted-foreground">
                          {commit.location && <p className="font-mono text-xs">{commit.location}</p>}
                          {commit.points && (
                            <ul className="space-y-2">
                              {commit.points.map(point => (
                                <li key={point} className="flex gap-3">
                                  <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-muted-foreground" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          )}
                          {commit.note && <p>{commit.note}</p>}
                          {commit.rhythm && <WeekRhythm {...commit.rhythm} />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
