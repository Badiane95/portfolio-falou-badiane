import { describe, expect, it } from "vitest";
import { createRateLimiter, getClientIp } from "./rateLimit.js";

describe("createRateLimiter", () => {
  it("autorise `limit` tentatives puis bloque jusqu'à la fin de la fenêtre", () => {
    const limiter = createRateLimiter({ limit: 3, windowMs: 1000 });
    expect(limiter.hit("ip", 0)).toEqual({ allowed: true });
    expect(limiter.hit("ip", 100)).toEqual({ allowed: true });
    expect(limiter.hit("ip", 200)).toEqual({ allowed: true });
    expect(limiter.hit("ip", 300)).toEqual({
      allowed: false,
      retryAfterMs: 700,
    });
    // Fenêtre glissante : la première tentative sort de la fenêtre à t = 1000.
    expect(limiter.hit("ip", 999).allowed).toBe(false);
    expect(limiter.hit("ip", 1000)).toEqual({ allowed: true });
  });

  it("garde des compteurs séparés par clé", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.hit("a", 0).allowed).toBe(true);
    expect(limiter.hit("a", 1).allowed).toBe(false);
    expect(limiter.hit("b", 2).allowed).toBe(true);
  });

  it("borne le nombre de clés en mémoire", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
    limiter.hit("a", 0);
    limiter.hit("b", 0);
    limiter.hit("c", 0); // purge : « a », la plus ancienne, est oubliée
    expect(limiter.hit("c", 1).allowed).toBe(false);
    expect(limiter.hit("a", 1).allowed).toBe(true);
  });

  it("reset vide les compteurs", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });
    limiter.hit("a", 0);
    limiter.reset();
    expect(limiter.hit("a", 1).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prend le premier élément de x-forwarded-for", () => {
    expect(
      getClientIp({ headers: { "x-forwarded-for": " 203.0.113.1 , 10.0.0.1" } })
    ).toBe("203.0.113.1");
  });

  it("se rabat sur l'adresse de la connexion", () => {
    expect(getClientIp({ headers: {}, socket: { remoteAddress: "::1" } })).toBe(
      "::1"
    );
    expect(
      getClientIp({
        headers: { "x-forwarded-for": "" },
        socket: { remoteAddress: "::1" },
      })
    ).toBe("::1");
  });

  it("renvoie « inconnue » sans aucune information", () => {
    expect(getClientIp({ headers: {} })).toBe("inconnue");
  });
});
