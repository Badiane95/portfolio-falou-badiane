import { useState } from "react";

/**
 * Image de projet avec un visuel de secours typographique si le fichier
 * distant ne se charge pas.
 */
export function ProjectImage({
  src,
  title,
  index,
  className,
  eager = false,
}: {
  src?: string;
  title: string;
  index: number;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={title}
        className={`relative grid place-items-center overflow-hidden bg-foreground text-background ${className ?? ""}`}
      >
        <span className="font-mono text-6xl font-medium opacity-90">{String(index + 1).padStart(2, "0")}</span>
        <span className="absolute bottom-3 left-3 right-3 truncate font-mono text-[11px] uppercase tracking-[0.18em] opacity-60">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      width={1200}
      height={750}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className ?? ""}`}
    />
  );
}
