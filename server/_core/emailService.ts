import { ENV } from "./env";
import { TRPCError } from "@trpc/server";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envoie un email via l'API Manus Forge
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Email] Forge API not configured");
    return false;
  }

  try {
    const response = await fetch(`${ENV.forgeApiUrl}/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text().catch(() => "");
      console.warn(
        `[Email] Failed to send email (${response.status} ${response.statusText})${
          error ? `: ${error}` : ""
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
 * Génère un email HTML de confirmation pour le visiteur
 */
export function generateConfirmationEmailHTML(
  visitorName: string,
  subject: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Rubik', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0052CC 0%, #06B6D4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          h1 { margin: 0; font-size: 28px; }
          .message { background: white; padding: 20px; border-left: 4px solid #0052CC; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Merci pour votre message ! 🎉</h1>
          </div>
          <div class="content">
            <p>Bonjour ${visitorName},</p>
            <p>Nous avons bien reçu votre message avec le sujet :</p>
            <div class="message">
              <strong>"${subject}"</strong>
            </div>
            <p>Je vous remercie de votre intérêt. Je vais examiner votre message attentivement et vous répondrai dans les plus brefs délais.</p>
            <p>En attendant, n'hésitez pas à consulter mon portfolio pour découvrir mes projets et compétences.</p>
            <p>Cordialement,<br><strong>Falou Badiane</strong><br>Développeur Web & Automation</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Falou Badiane. Tous droits réservés.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Génère un email HTML pour le propriétaire (notification de nouveau message)
 */
export function generateOwnerEmailHTML(
  visitorName: string,
  visitorEmail: string,
  subject: string,
  message: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Rubik', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0052CC 0%, #06B6D4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #0052CC; }
          .message-box { background: white; padding: 20px; border-radius: 4px; margin: 20px 0; border: 1px solid #e5e7eb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          h2 { color: #0052CC; }
          strong { color: #0052CC; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✉️ Nouveau Message de Contact</h1>
          </div>
          <div class="content">
            <h2>Détails du message :</h2>
            <div class="info-box">
              <p><strong>Nom :</strong> ${visitorName}</p>
              <p><strong>Email :</strong> <a href="mailto:${visitorEmail}">${visitorEmail}</a></p>
              <p><strong>Sujet :</strong> ${subject}</p>
            </div>
            <h2>Message :</h2>
            <div class="message-box">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Vous pouvez répondre directement à <strong>${visitorEmail}</strong>
            </p>
          </div>
          <div class="footer">
            <p>Message automatique du système de contact du portfolio</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
