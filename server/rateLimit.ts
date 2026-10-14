import type { IncomingHttpHeaders } from "http";

export type RateLimitVerdict =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

export type RateLimiter = {
  /** Enregistre une tentative pour `key` et indique si elle est autorisée. */
  hit(key: string, now?: number): RateLimitVerdict;
  /** Vide tous les compteurs (utilisé par les tests). */
  reset(): void;
};

/**
 * Limiteur de débit en mémoire, à fenêtre glissante : on garde, par clé,
 * l'horodatage des tentatives acceptées pendant les `windowMs` dernières ms.
 *
 * ATTENTION : l'état vit dans la mémoire du processus. Sur Vercel, chaque
 * instance de la fonction serverless a ses propres compteurs, perdus à chaque
 * démarrage à froid ; plusieurs instances en parallèle multiplient donc la
 * limite. C'est un garde-fou, pas une protection forte : celle-ci passe par une
 * règle de limitation de débit du pare-feu Vercel (Firewall > Rate limiting)
 * sur POST /api/trpc/contact.send, à configurer par le propriétaire du projet.
 */
export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 10_000,
}: {
  limit: number;
  windowMs: number;
  /** Nombre de clés au-delà duquel on purge, pour borner la mémoire. */
  maxKeys?: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();

  // Array.from plutôt que for…of : tsconfig.json ne fixe pas de `target`, et
  // l'itération directe d'une Map y est refusée.
  const purge = (now: number) => {
    Array.from(hits.entries()).forEach(([key, stamps]) => {
      if (stamps[stamps.length - 1] <= now - windowMs) hits.delete(key);
    });
    // Encore trop de clés actives : on oublie les plus anciennes (ordre d'insertion).
    const overflow = hits.size - maxKeys;
    if (overflow > 0)
      Array.from(hits.keys())
        .slice(0, overflow)
        .forEach(key => hits.delete(key));
  };

  return {
    hit(key, now = Date.now()) {
      const recent = (hits.get(key) ?? []).filter(t => t > now - windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return {
          allowed: false,
          retryAfterMs: Math.max(0, recent[0] + windowMs - now),
        };
      }
      recent.push(now);
      hits.set(key, recent);
      if (hits.size > maxKeys) purge(now);
      return { allowed: true };
    },
    reset() {
      hits.clear();
    },
  };
}

/**
 * Adresse IP du visiteur : premier élément de `x-forwarded-for`, sinon l'adresse
 * de la connexion TCP.
 *
 * Sur Vercel, `x-forwarded-for` est réécrit par la plateforme et désigne bien le
 * client. En auto-hébergement (`pnpm start`) sans proxy inverse devant, ce
 * en-tête est fourni par le client lui-même et peut être falsifié pour
 * contourner la limite : il faut alors un proxy qui le réécrit.
 */
export function getClientIp(req: {
  headers: IncomingHttpHeaders;
  socket?: { remoteAddress?: string | undefined } | null;
}): string {
  const header = req.headers["x-forwarded-for"];
  const raw = Array.isArray(header) ? header[0] : header;
  const first = raw?.split(",")[0]?.trim();
  return first || req.socket?.remoteAddress || "inconnue";
}
