import { ENV } from "./env";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

function generateBaseStyles(): string {
  return `
    body {
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      line-height: 1.7;
      color: #1a1a2e;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
    .header {
      background: #1a1a2e;
      padding: 32px 40px;
      text-align: center;
    }
    .header .logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }
    .header .sub {
      color: #94a3b8;
      font-size: 14px;
      margin-top: 6px;
    }
    .content { padding: 40px; background: #ffffff; }
    .content h2 {
      font-size: 20px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 16px 0;
    }
    .content p {
      font-size: 15px;
      color: #475569;
      margin: 0 0 16px 0;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px 24px;
      margin: 20px 0;
    }
    .card strong {
      color: #1a1a2e;
      font-weight: 600;
    }
    .card .label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .divider {
      height: 1px;
      background: #e2e8f0;
      margin: 24px 0;
    }
    .btn {
      display: inline-block;
      background: #1a1a2e;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 40px;
      text-align: center;
      font-size: 13px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
    .footer a { color: #1a1a2e; text-decoration: none; }
    .signature {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }
    .signature strong { color: #1a1a2e; font-size: 16px; }
    .signature .role { color: #64748b; font-size: 13px; }
    @media only screen and (max-width: 600px) {
      .content { padding: 24px; }
      .header { padding: 24px; }
      .header h1 { font-size: 20px; }
    }
  `;
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
        headers: {
          "List-Unsubscribe": `<mailto:${ENV.ownerEmail || "badiane.falou95@gmail.com"}?subject=unsubscribe>`,
          "Precedence": "bulk",
        },
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
 * Génère un email HTML de confirmation professionnel pour le visiteur
 */
export function generateConfirmationEmailHTML(
  visitorName: string,
  subject: string
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de réception</title>
  <style>${generateBaseStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://falou-badiane.fr/hey.com-favicon-large.ico" alt="FB" class="logo" />
      <h1>Confirmation de réception</h1>
      <p class="sub">Merci de m'avoir contacté</p>
    </div>
    <div class="content">
      <h2>Bonjour ${visitorName},</h2>
      <p>Je confirme avoir bien reçu votre message concernant <strong>"${subject}"</strong>. Votre demande a été transmise et je l'examine avec attention.</p>

      <div class="card">
        <div class="label">Sujet</div>
        <strong>${subject}</strong>
      </div>

      <p>Je m'engage à vous apporter une réponse personnalisée sous 48 heures ouvrées. Si votre demande est urgente, n'hésitez pas à me relire.</p>

      <div class="divider"></div>

      <p style="text-align: center;">
        <a href="https://falou-badiane.fr" class="btn">Decouvrir mon portfolio</a>
      </p>

      <div class="signature">
        <strong>Falou Badiane</strong>
        <p class="role">Développeur Full-Stack & Automatisation IA</p>
        <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
          <a href="mailto:badiane.falou95@gmail.com">badiane.falou95@gmail.com</a>
        </p>
      </div>
    </div>
    <div class="footer">
      <p>Cet email a ete envoye automatiquement suite a votre message sur mon portfolio.</p>
      <p><a href="https://falou-badiane.fr">falou-badiane.fr</a></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Génère un email HTML de notification professionnel pour le propriétaire
 */
export function generateOwnerEmailHTML(
  visitorName: string,
  visitorEmail: string,
  subject: string,
  message: string
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouveau message de contact</title>
  <style>${generateBaseStyles()}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://falou-badiane.fr/hey.com-favicon-large.ico" alt="FB" class="logo" />
      <h1>Nouveau message</h1>
      <p class="sub">Quelqu'un vous a contacte via votre portfolio</p>
    </div>
    <div class="content">
      <div class="card">
        <div class="label">Expediteur</div>
        <strong>${visitorName}</strong>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">
          <a href="mailto:${visitorEmail}" style="color: #1a1a2e;">${visitorEmail}</a>
        </p>
      </div>

      <div class="card">
        <div class="label">Sujet</div>
        <strong>${subject}</strong>
      </div>

      <div class="divider"></div>

      <h2>Message</h2>
      <div class="card" style="background: #ffffff; border-left: 3px solid #1a1a2e;">
        <p style="margin: 0; line-height: 1.8; white-space: pre-wrap;">${message.replace(/\n/g, "<br>")}</p>
      </div>

      <div class="divider"></div>

      <p style="text-align: center;">
        <a href="mailto:${visitorEmail}?subject=Re: ${encodeURIComponent(subject)}" class="btn">Repondre a ${visitorName}</a>
      </p>
    </div>
    <div class="footer">
      <p>Message recu depuis le formulaire de contact de falou-badiane.fr</p>
      <p>Vous pouvez repondre directement a <a href="mailto:${visitorEmail}">${visitorEmail}</a></p>
    </div>
  </div>
</body>
</html>`;
}
