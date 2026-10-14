import { afterEach, describe, expect, it, vi } from "vitest";
import * as emailService from "./_core/emailService.js";
import {
  emailProvider,
  escapeHtml,
  generateOwnerEmailHTML,
  sendEmail,
  toSingleLine,
} from "./_core/emailService.js";
import { ENV } from "./_core/env.js";

// Services Forge et Resend factices : fetch est remplacé, aucun appel réseau.
// Resend est désactivé par défaut ; les tests qui en ont besoin posent la clé.
vi.mock("./_core/env.js", async importOriginal => {
  const mod = await importOriginal<typeof import("./_core/env.js")>();
  return {
    ENV: {
      ...mod.ENV,
      forgeApiUrl: "http://forge.invalid",
      forgeApiKey: "cle-factice",
      resendApiKey: "",
      resendApiUrl: "http://resend.invalid",
      contactFromEmail: "Portfolio <onboarding@resend.dev>",
    },
  };
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  ENV.resendApiKey = "";
  ENV.forgeApiUrl = "http://forge.invalid";
  ENV.forgeApiKey = "cle-factice";
});

describe("escapeHtml", () => {
  it("échappe les cinq caractères spéciaux HTML", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;"
    );
  });

  it("n'échappe pas deux fois l'esperluette", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });
});

describe("generateOwnerEmailHTML", () => {
  const html = generateOwnerEmailHTML(
    "Audit <b>Test</b>",
    "o'brien@example.test",
    "Sujet <i>x</i>",
    "Ligne 1\r\n<script>x</script>\nLigne 3"
  );

  it("échappe le nom, l'e-mail, le sujet et le message", () => {
    expect(html).toContain("Audit &lt;b&gt;Test&lt;/b&gt;");
    expect(html).toContain('href="mailto:o&#39;brien@example.test"');
    expect(html).toContain("Sujet &lt;i&gt;x&lt;/i&gt;");
    expect(html).not.toContain("<b>Test");
    expect(html).not.toContain("<i>x");
    expect(html).not.toContain("<script>");
  });

  it("convertit les sauts de ligne du message en <br> après l'échappement", () => {
    expect(html).toContain(
      "Ligne 1<br>&lt;script&gt;x&lt;/script&gt;<br>Ligne 3"
    );
  });
});

describe("gabarit de confirmation au visiteur", () => {
  it("n'existe plus", () => {
    expect("generateConfirmationEmailHTML" in emailService).toBe(false);
  });
});

describe("sendEmail", () => {
  it("retire les CR/LF de l'objet avant l'envoi", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const ok = await sendEmail({
      to: "proprietaire@example.test",
      subject: "Bonjour\r\nBcc: victime@example.test\n",
      html: "<p>x</p>",
    });

    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://forge.invalid/email/send");
    const body = JSON.parse(init.body);
    expect(body.subject).toBe("Bonjour Bcc: victime@example.test");
    expect(body.to).toBe("proprietaire@example.test");
  });

  it("toSingleLine remplace chaque suite de retours à la ligne par une espace", () => {
    expect(toSingleLine("a\r\n\r\nb\rc\nd")).toBe("a b c d");
  });

  it("passe par Resend quand RESEND_API_KEY est définie, avec reply-to", async () => {
    ENV.resendApiKey = "re_factice";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('{"id":"x"}', { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const ok = await sendEmail({
      to: "proprietaire@example.test",
      subject: "Objet",
      html: "<p>x</p>",
      replyTo: "visiteur@example.test",
    });

    expect(ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://resend.invalid/emails");
    expect(init.headers.Authorization).toBe("Bearer re_factice");
    expect(JSON.parse(init.body)).toEqual({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["proprietaire@example.test"],
      subject: "Objet",
      html: "<p>x</p>",
      reply_to: "visiteur@example.test",
    });
  });

  it("renvoie false si le fournisseur répond une erreur", async () => {
    ENV.resendApiKey = "re_factice";
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("refusé", { status: 403 }))
    );

    await expect(
      sendEmail({ to: "proprietaire@example.test", subject: "Objet", html: "x" })
    ).resolves.toBe(false);
  });

  it("sans aucun fournisseur : renvoie false sans appel réseau", async () => {
    ENV.forgeApiUrl = "";
    ENV.forgeApiKey = "";
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(emailProvider()).toBeNull();
    await expect(
      sendEmail({ to: "proprietaire@example.test", subject: "Objet", html: "x" })
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
