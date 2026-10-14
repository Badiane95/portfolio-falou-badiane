import { ENV } from "./env.js";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  /** Adresse utilisée quand le destinataire clique sur « Répondre ». */
  replyTo?: string;
}

const SEND_TIMEOUT_MS = 8000;

/** L'API Manus Forge n'existe que sur l'hébergement Manus (ancien déploiement). */
export function isForgeConfigured(): boolean {
  return Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
}

/** Fournisseur d'e-mail disponible : Resend en priorité, Forge en repli, sinon aucun. */
export function emailProvider(): "resend" | "forge" | null {
  if (ENV.resendApiKey) return "resend";
  if (isForgeConfigured()) return "forge";
  return null;
}

/**
 * Envoie un e-mail via Resend (ou l'API Manus Forge à défaut). Renvoie false,
 * sans lever d'erreur, si aucun fournisseur n'est configuré ou si l'envoi échoue.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const provider = emailProvider();
  if (!provider) {
    console.warn("[Email] Aucun service d'e-mail configuré (RESEND_API_KEY ou Forge).");
    return false;
  }

  const subject = toSingleLine(payload.subject);

  try {
    const response =
      provider === "resend"
        ? await fetch(`${ENV.resendApiUrl}/emails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ENV.resendApiKey}`,
            },
            body: JSON.stringify({
              from: ENV.contactFromEmail,
              to: [payload.to],
              subject,
              html: payload.html,
              ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
            }),
            signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
          })
        : await fetch(`${ENV.forgeApiUrl}/email/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ENV.forgeApiKey}`,
            },
            body: JSON.stringify({ to: payload.to, subject, html: payload.html }),
            signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
          });

    if (!response.ok) {
      const error = await response.text().catch(() => "");
      console.warn(
        `[Email] Échec de l'envoi via ${provider} (${response.status} ${response.statusText})${
          error ? `: ${error.slice(0, 300)}` : ""
        }`
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

/**
 * Échappe les caractères spéciaux HTML. À appliquer à toute valeur saisie par un
 * visiteur avant de l'insérer dans un gabarit d'e-mail.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Remplace les retours chariot et sauts de ligne par une espace : l'objet d'un
 * e-mail doit tenir sur une seule ligne (sinon risque d'injection d'en-têtes).
 */
export function toSingleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/**
 * Génère l'e-mail HTML envoyé au propriétaire pour chaque nouveau message.
 * Toutes les valeurs du visiteur sont échappées ; les sauts de ligne du message
 * deviennent des <br> après l'échappement. Styles en ligne (beaucoup de
 * messageries ignorent <style>), police système et couleurs neutres.
 */
export function generateOwnerEmailHTML(
  visitorName: string,
  visitorEmail: string,
  subject: string,
  message: string
): string {
  const name = escapeHtml(visitorName);
  const email = escapeHtml(visitorEmail);
  const safeSubject = escapeHtml(subject);
  const body = escapeHtml(message).replace(/\r\n|\r|\n/g, "<br>");

  const label =
    "padding:6px 16px 6px 0;color:#71717a;vertical-align:top;white-space:nowrap;";
  const value = "padding:6px 0;color:#18181b;word-break:break-word;";

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nouveau message de contact</title>
  </head>
  <body style="margin:0;padding:24px 12px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;color:#18181b;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:8px;padding:32px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#71717a;">Portfolio · Formulaire de contact</p>
      <h1 style="margin:0 0 24px;font-size:20px;font-weight:600;">Nouveau message</h1>
      <table role="presentation" style="border-collapse:collapse;font-size:14px;">
        <tr><td style="${label}">Nom</td><td style="${value}">${name}</td></tr>
        <tr><td style="${label}">E-mail</td><td style="${value}"><a href="mailto:${email}" style="color:#18181b;">${email}</a></td></tr>
        <tr><td style="${label}">Sujet</td><td style="${value}">${safeSubject}</td></tr>
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #e4e4e7;font-size:15px;word-break:break-word;">${body}</div>
      <p style="margin:32px 0 0;font-size:12px;color:#71717a;">Pour répondre, écrivez à ${email}. Message transmis automatiquement par le formulaire de contact du portfolio.</p>
    </div>
  </body>
</html>
`;
}
