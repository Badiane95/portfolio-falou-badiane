import { motion } from "framer-motion";
import { EASE_OUT } from "../motion/Reveal";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

/** Niveau de langue sur l'échelle européenne (CECRL), le niveau suivant en pointillés. */
export function CefrScale({
  name,
  level,
  cefr,
  native,
}: {
  name: string;
  level: string;
  cefr: string;
  native: boolean;
}) {
  const reached = LEVELS.indexOf(cefr as (typeof LEVELS)[number]);

  return (
    <div>
      <p className="flex items-baseline justify-between gap-3">
        <span className="text-lg">{name}</span>
        <span className="text-sm text-muted-foreground">{level}</span>
      </p>
      <ol
        className="mt-2 grid grid-cols-6 gap-1"
        aria-label={native ? `${name} : langue maternelle` : `${name} : niveau ${cefr} sur une échelle de A1 à C2`}
      >
        {LEVELS.map((l, i) => {
          const done = i <= reached;
          const next = !native && i === reached + 1;
          return (
            <motion.li
              key={l}
              aria-hidden="true"
              className={`grid h-8 place-items-center rounded-md font-mono text-[11px] ${
                done
                  ? "bg-primary text-primary-foreground"
                  : next
                    ? "border border-dashed border-primary text-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: EASE_OUT, delay: i * 0.06 }}
            >
              {l}
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
