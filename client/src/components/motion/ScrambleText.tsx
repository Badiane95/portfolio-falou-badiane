import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]=+*#$%&";

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Texte qui se « décode » : chaque caractère défile parmi des glyphes
 * aléatoires avant de se fixer, de gauche à droite.
 * Rejoué au survol si `replayOnHover` est actif.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 900,
  replayOnHover = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  replayOnHover?: boolean;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? text : "");
  const frame = useRef<number | null>(null);

  const run = useCallback(
    (startDelay: number) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      const chars = Array.from(text);
      // Instant de fixation de chaque caractère : progression + un peu d'aléa.
      const settleAt = chars.map((_, i) => (i / chars.length) * duration * 0.75 + Math.random() * duration * 0.25);
      let start: number | null = null;

      const tick = (now: number) => {
        if (start === null) start = now + startDelay;
        const elapsed = now - start;
        if (elapsed < 0) {
          frame.current = requestAnimationFrame(tick);
          return;
        }
        let done = true;
        const next = chars
          .map((char, i) => {
            if (char === " " || elapsed >= settleAt[i]) return char;
            done = false;
            return randomGlyph();
          })
          .join("");
        setDisplay(next);
        if (!done) frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [text, duration]
  );

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    run(delay);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [reduce, run, delay, text]);

  return (
    <span
      className={className}
      onMouseEnter={replayOnHover && !reduce ? () => run(0) : undefined}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || " "}</span>
    </span>
  );
}
