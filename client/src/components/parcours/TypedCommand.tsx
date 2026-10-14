import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Une commande qui se tape caractère par caractère quand elle arrive à l'écran. */
export function TypedCommand({ prompt, command }: { prompt: string; command: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? command.length : 0);

  useEffect(() => {
    if (reduce) {
      setCount(command.length);
      return;
    }
    if (!inView) return;
    const timer = window.setInterval(() => {
      setCount(c => {
        if (c >= command.length) {
          window.clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, 45);
    return () => window.clearInterval(timer);
  }, [inView, reduce, command.length]);

  const done = count >= command.length;

  return (
    <p ref={ref} className="font-mono text-sm">
      <span className="sr-only">
        {prompt} {command}
      </span>
      <span aria-hidden="true">
        <span className="text-success">{prompt}</span> <span>{command.slice(0, count)}</span>
        <span
          className={`ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-foreground ${done ? "motion-safe:animate-pulse" : ""}`}
        />
      </span>
    </p>
  );
}
