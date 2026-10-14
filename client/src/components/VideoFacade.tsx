import { Play } from "lucide-react";
import { useState } from "react";

/**
 * Vignette cliquable qui ne charge le lecteur YouTube (domaine sans cookies)
 * qu'au clic : aucune requête vers YouTube tant que le visiteur n'a pas choisi.
 */
export function VideoFacade({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg bg-foreground">
      {playing ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 text-background"
          aria-label={`Lire la vidéo : ${title}`}
        >
          <span className="grid size-12 place-items-center rounded-full border border-background/40 transition-transform duration-300 group-hover:scale-110">
            <Play className="size-5 translate-x-px" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] opacity-70">{title}</span>
        </button>
      )}
    </div>
  );
}
