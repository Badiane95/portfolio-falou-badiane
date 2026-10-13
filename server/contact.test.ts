import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter, contactRateLimiter, CONTACT_RATE_LIMIT } from "./routers.js";
import type { TrpcContext } from "./_core/context.js";

// Aucun appel réseau : la notification et l'envoi d'e-mail sont simulés.
const { notifyOwner, sendEmail, OWNER_EMAIL } = vi.hoisted(() => ({
  notifyOwner: vi.fn(),
  sendEmail: vi.fn(),
  OWNER_EMAIL: "proprietaire@example.test",
}));

vi.mock("./_core/notification.js", () => ({ notifyOwner }));

vi.mock("./_core/emailService.js", async importOriginal => ({
  ...(await importOriginal<typeof import("./_core/emailService.js")>()),
  sendEmail,
}));

vi.mock("./_core/env.js", async importOriginal => {
  const mod = await importOriginal<typeof import("./_core/env.js")>();
  return { ENV: { ...mod.ENV, ownerEmail: OWNER_EMAIL } };
});

let ipCounter = 0;

function createPublicContext(ip = `198.51.100.${++ipCounter}`) {
  const setHeader = vi.fn();
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-forwarded-for": ip },
    } as unknown as TrpcContext["req"],
    res: { setHeader } as unknown as TrpcContext["res"],
  };
  return { ctx, setHeader };
}

const VALID = {
  name: "John Doe",
  email: "john@example.com",
  subject: "Collaboration Request",
  message: "I would like to collaborate on a web project with you.",
  website: "",
  elapsedMs: 8000,
};

const SUCCESS = {
  success: true,
  message: "Votre message a été envoyé avec succès!",
};

async function expectRejection(promise: Promise<unknown>, text: string) {
  await expect(promise).rejects.toThrow(text);
  expect(notifyOwner).not.toHaveBeenCalled();
  expect(sendEmail).not.toHaveBeenCalled();
}

beforeEach(() => {
  contactRateLimiter.reset();
  vi.clearAllMocks();
  notifyOwner.mockResolvedValue(true);
  sendEmail.mockResolvedValue(true);
});

describe("contact.send", () => {
  it("envoie la notification et un seul e-mail, au propriétaire", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await expect(caller.contact.send(VALID)).resolves.toEqual(SUCCESS);

    expect(notifyOwner).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0].to).toBe(OWNER_EMAIL);
  });

  it("n'envoie aucun e-mail à l'adresse saisie par le visiteur", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await caller.contact.send({ ...VALID, email: "cible@example.test" });

    const recipients = sendEmail.mock.calls.map(([payload]) => payload.to);
    expect(recipients).not.toContain("cible@example.test");
    expect(recipients).toEqual([OWNER_EMAIL]);
  });

  it("échappe le HTML des valeurs du visiteur dans l'e-mail au propriétaire", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await caller.contact.send({
      ...VALID,
      name: "Audit <b>Test</b>",
      subject: 'Sujet <i>piégé</i> & "cité"',
      message: "Bonjour,\n<script>x</script>\n<img src=x onerror=alert(1)>",
    });

    const { html, subject } = sendEmail.mock.calls[0][0];
    expect(html).toContain("Audit &lt;b&gt;Test&lt;/b&gt;");
    expect(html).toContain(
      "Sujet &lt;i&gt;piégé&lt;/i&gt; &amp; &quot;cité&quot;"
    );
    expect(html).toContain(
      "Bonjour,<br>&lt;script&gt;x&lt;/script&gt;<br>&lt;img src=x onerror=alert(1)&gt;"
    );
    expect(html).not.toContain("<b>Test");
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img");
    // L'objet est du texte brut : il n'est pas échappé, mais tient sur une ligne.
    expect(subject).toBe(
      'Nouveau message de contact : Sujet <i>piégé</i> & "cité"'
    );
  });

  it("supprime les espaces autour des valeurs avant l'envoi", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await caller.contact.send({
      ...VALID,
      name: "  John Doe  ",
      email: " john@example.com ",
    });

    expect(notifyOwner.mock.calls[0][0].title).toBe(
      "Nouveau message de contact de John Doe"
    );
    expect(sendEmail.mock.calls[0][0].html).toContain(
      'mailto:john@example.com"'
    );
  });

  it("refuse une adresse e-mail invalide", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await expectRejection(
      caller.contact.send({ ...VALID, email: "invalid-email" }),
      "Saisissez une adresse e-mail valide"
    );
    await expectRejection(
      caller.contact.send({ ...VALID, email: "a@b.c" }),
      "Saisissez une adresse e-mail valide"
    );
  });

  it("refuse un nom trop court, y compris une fois les espaces retirés", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await expectRejection(
      caller.contact.send({ ...VALID, name: "J" }),
      "Le nom doit contenir au moins 2 caractères"
    );
    await expectRejection(
      caller.contact.send({ ...VALID, name: "  J  " }),
      "Le nom doit contenir au moins 2 caractères"
    );
  });

  it("refuse un sujet trop court", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await expectRejection(
      caller.contact.send({ ...VALID, subject: "Hi" }),
      "Le sujet doit contenir au moins 5 caractères"
    );
  });

  it("refuse un message trop court", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await expectRejection(
      caller.contact.send({ ...VALID, message: "Short" }),
      "Le message doit contenir au moins 10 caractères"
    );
  });

  it("refuse les valeurs au-delà des longueurs maximales", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await expectRejection(
      caller.contact.send({ ...VALID, name: "a".repeat(101) }),
      "Le nom ne doit pas dépasser 100 caractères"
    );
    await expectRejection(
      caller.contact.send({
        ...VALID,
        email: `${"a".repeat(64)}@${"b".repeat(186)}.com`,
      }),
      "L'adresse e-mail ne doit pas dépasser 254 caractères"
    );
    await expectRejection(
      caller.contact.send({ ...VALID, subject: "s".repeat(151) }),
      "Le sujet ne doit pas dépasser 150 caractères"
    );
  });

  it("refuse un message de plus de 5000 caractères mais accepte exactement 5000", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expectRejection(
      caller.contact.send({ ...VALID, message: "m".repeat(5001) }),
      "Le message ne doit pas dépasser 5000 caractères"
    );

    await expect(
      caller.contact.send({
        ...VALID,
        name: "n".repeat(100),
        subject: "s".repeat(150),
        message: "m".repeat(5000),
      })
    ).resolves.toEqual(SUCCESS);
  });

  it("refuse un sujet contenant un retour à la ligne (injection d'en-têtes)", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await expectRejection(
      caller.contact.send({
        ...VALID,
        subject: "Bonjour\r\nBcc: victime@example.test",
      }),
      "Le sujet doit tenir sur une seule ligne"
    );
    await expectRejection(
      caller.contact.send({
        ...VALID,
        subject: "Bonjour\nBcc: victime@example.test",
      }),
      "Le sujet doit tenir sur une seule ligne"
    );
  });

  it("renvoie une erreur en français si la notification échoue", async () => {
    notifyOwner.mockRejectedValueOnce(new Error("Forge indisponible"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await expect(caller.contact.send(VALID)).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
    });
  });
});

describe("contact.send — anti-spam", () => {
  it("champ piège rempli : répond comme un succès sans rien envoyer, journal sans données personnelles", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await expect(
      caller.contact.send({
        ...VALID,
        name: "Robot Spammeur",
        email: "robot@example.test",
        website: "https://spam.example",
      })
    ).resolves.toEqual(SUCCESS);

    expect(notifyOwner).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
    expect(info).toHaveBeenCalledTimes(1);
    const logged = info.mock.calls.flat().join(" ");
    expect(logged).toContain("champ piège");
    for (const personal of [
      "Robot Spammeur",
      "robot@example.test",
      "spam.example",
      "198.51.100.",
    ]) {
      expect(logged).not.toContain(personal);
    }
  });

  it("envoi en moins de 3 s : répond comme un succès sans rien envoyer", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const caller = appRouter.createCaller(createPublicContext().ctx);

    await expect(
      caller.contact.send({ ...VALID, elapsedMs: 2999 })
    ).resolves.toEqual(SUCCESS);
    await expect(
      caller.contact.send({ ...VALID, elapsedMs: 0 })
    ).resolves.toEqual(SUCCESS);

    expect(notifyOwner).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("durée de remplissage absente : traité comme un robot", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const caller = appRouter.createCaller(createPublicContext().ctx);
    const { elapsedMs: _omis, ...sansDuree } = VALID;

    await expect(caller.contact.send(sansDuree)).resolves.toEqual(SUCCESS);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("à partir de 3 s, l'envoi part normalement", async () => {
    const caller = appRouter.createCaller(createPublicContext().ctx);
    await caller.contact.send({ ...VALID, elapsedMs: 3000 });
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("contact.send — limitation de débit", () => {
  it(`refuse le ${CONTACT_RATE_LIMIT.limit + 1}e envoi depuis la même IP avec TOO_MANY_REQUESTS`, async () => {
    const { ctx, setHeader } = createPublicContext("203.0.113.7");
    const caller = appRouter.createCaller(ctx);

    for (let i = 0; i < CONTACT_RATE_LIMIT.limit; i++) {
      await expect(caller.contact.send(VALID)).resolves.toEqual(SUCCESS);
    }

    const error = await caller.contact.send(VALID).catch(e => e);
    expect(error).toBeInstanceOf(TRPCError);
    expect(error.code).toBe("TOO_MANY_REQUESTS");
    expect(error.message).toMatch(
      /^Trop de messages envoyés depuis votre connexion\. Réessayez dans 10 minutes\.$/
    );
    expect(setHeader).toHaveBeenCalledWith("Retry-After", "600");
    expect(sendEmail).toHaveBeenCalledTimes(CONTACT_RATE_LIMIT.limit);
  });

  it("identifie l'IP par le premier élément de x-forwarded-for", async () => {
    for (let i = 0; i < CONTACT_RATE_LIMIT.limit; i++) {
      await appRouter
        .createCaller(createPublicContext(`203.0.113.8, 10.0.0.${i}`).ctx)
        .contact.send(VALID);
    }
    await expect(
      appRouter
        .createCaller(createPublicContext("203.0.113.8").ctx)
        .contact.send(VALID)
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    // Une autre IP n'est pas concernée.
    await expect(
      appRouter
        .createCaller(createPublicContext("203.0.113.9").ctx)
        .contact.send(VALID)
    ).resolves.toEqual(SUCCESS);
  });

  it("compte aussi les tentatives invalides et les envois de robots", async () => {
    vi.spyOn(console, "info").mockImplementation(() => {});
    const caller = appRouter.createCaller(
      createPublicContext("203.0.113.10").ctx
    );

    for (let i = 0; i < CONTACT_RATE_LIMIT.limit; i++) {
      await caller.contact
        .send({ ...VALID, website: "https://spam.example" })
        .catch(() => {});
    }
    await expect(
      caller.contact.send({ ...VALID, email: "invalide" })
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });
});
