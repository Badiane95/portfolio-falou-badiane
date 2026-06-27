import { initTRPC } from "@trpc/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { z } from "zod";
import { notifyOwner } from "../../server/_core/notification";
import { sendEmail, generateConfirmationEmailHTML, generateOwnerEmailHTML } from "../../server/_core/emailService";
import { ENV } from "../../server/_core/env";

const t = initTRPC.create({ transformer: superjson });

const router = t.router;
const publicProcedure = t.procedure;

const appRouter = router({
  contact: router({
    send: publicProcedure
      .input(z.object({
        name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        email: z.string().email("Email invalide"),
        subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
        message: z.string().min(10, "Le message doit contenir au moins 10 caractères")
      }))
      .mutation(async ({ input }) => {
        try {
          const notificationSent = await notifyOwner({
            title: `Nouveau message de contact de ${input.name}`,
            content: `Email: ${input.email}\n\nSujet: ${input.subject}\n\nMessage:\n${input.message}`
          });

          if (!notificationSent) {
            console.warn("[Contact] Notification service unavailable, but message was received");
          }

          if (input.email) {
            const confirmationHTML = generateConfirmationEmailHTML(input.name, input.subject);
            const confirmationSent = await sendEmail({
              to: input.email,
              subject: "Confirmation de réception - Portfolio Falou Badiane",
              html: confirmationHTML
            });
            if (!confirmationSent) {
              console.warn("[Contact] Failed to send confirmation email to visitor");
            }
          }

          if (ENV.ownerEmail) {
            const ownerHTML = generateOwnerEmailHTML(
              input.name,
              input.email,
              input.subject,
              input.message
            );
            const ownerEmailSent = await sendEmail({
              to: ENV.ownerEmail,
              subject: `Nouveau message de contact: ${input.subject}`,
              html: ownerHTML
            });
            if (!ownerEmailSent) {
              console.warn("[Contact] Failed to send email to owner");
            }
          }

          return {
            success: true,
            message: "Votre message a été envoyé avec succès!"
          };
        } catch (error) {
          console.error("[Contact] Error sending notification:", error);
          throw new Error("Erreur lors de l'envoi du message. Veuillez réessayer.");
        }
      })
  }),
});

export type AppRouter = typeof appRouter;

async function handler(req: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => undefined,
  });
}

export const GET = handler;
export const POST = handler;
