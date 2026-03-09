import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { sendEmail, generateConfirmationEmailHTML, generateOwnerEmailHTML } from "./_core/emailService";
import { ENV } from "./_core/env";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

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
          // Envoyer une notification au propriétaire du portfolio
          const notificationSent = await notifyOwner({
            title: `Nouveau message de contact de ${input.name}`,
            content: `Email: ${input.email}\n\nSujet: ${input.subject}\n\nMessage:\n${input.message}`
          });

          if (!notificationSent) {
            console.warn("[Contact] Notification service unavailable, but message was received");
          }

          // Envoyer un email de confirmation au visiteur
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

          // Envoyer un email au propriétaire
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
