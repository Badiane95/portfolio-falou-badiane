import { motion } from "framer-motion";
import { EASE_OUT } from "../motion/Reveal";

/** Le rythme de l'alternance : une semaine de cinq jours, répartie entre école et entreprise. */
export function WeekRhythm({ ecole, entreprise }: { ecole: number; entreprise: number }) {
  const days = [
    ...Array.from({ length: ecole }, () => "école" as const),
    ...Array.from({ length: entreprise }, () => "entreprise" as const),
  ];

  return (
    <figure className="pt-1">
      <figcaption className="eyebrow mb-2">Une semaine en alternance</figcaption>
      <ol
        className="flex gap-1"
        aria-label={`${ecole} jours à l'école et ${entreprise} jours en entreprise par semaine`}
      >
        {days.map((kind, i) => (
          <motion.li
            key={i}
            aria-hidden="true"
            className={`grid h-9 flex-1 place-items-center rounded-md font-mono text-[11px] ${
              kind === "école" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
            }`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_OUT, delay: i * 0.07 }}
          >
            {kind}
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}
