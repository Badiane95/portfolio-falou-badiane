import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { publicProcedure, router } from "./_core/trpc.js";
import { TRPCError } from "@trpc/server";
import { notifyOwner } from "./_core/notification.js";
import { emailProvider, generateOwnerEmailHTML, isForgeConfigured, sendEmail } from "./_core/emailService.js";
import { ENV } from "./_core/env.js";
import { CONTACT_MIN_FILL_MS, contactInputSchema, type ContactInput } from "../shared/contact.js";
import { createRateLimiter, getClientIp } from "./rateLimit.js";

/**
 * Limite d'envoi du formulaire de contact : 5 tentatives par IP sur une fenêtre
 * glissante de 10 minutes. Compteurs en mémoire, donc propres à chaque instance
 * serverless sur Vercel (voir server/rateLimit.ts) : la vraie protection est une
 * règle de limitation de débit du pare-feu Vercel, à configurer par le propriétaire.
 */
export const CONTACT_RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 } as const;
export const contactRateLimiter = createRateLimiter(CONTACT_RATE_LIMIT);

const CONTACT_SUCCESS = {
  success: true,
  message: "Votre message a été envoyé avec succès!",
} as const;

/** Raison de considérer l'envoi comme du spam (pour le journal), ou null. */
function spamReason(input: Pick<ContactInput, "website" | "elapsedMs">): string | null {
  if (input.website && input.website.trim() !== "") return "champ piège rempli";
  if (input.elapsedMs === undefined) return "durée de remplissage absente";
  if (input.elapsedMs < CONTACT_MIN_FILL_MS) return "formulaire envoyé trop vite";
  return null;
}

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
      // Limitation de débit avant la validation : chaque tentative compte.
      .use(({ ctx, next }) => {
        const verdict = contactRateLimiter.hit(getClientIp(ctx.req));
        if (!verdict.allowed) {
          const minutes = Math.max(1, Math.ceil(verdict.retryAfterMs / 60_000));
          if (typeof ctx.res?.setHeader === "function") {
            ctx.res.setHeader("Retry-After", String(Math.ceil(verdict.retryAfterMs / 1000)));
          }
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Trop de messages envoyés depuis votre connexion. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.`,
          });
        }
        return next();
      })
      .input(contactInputSchema)
      .mutation(async ({ input }) => {
        // Anti-spam : on répond comme un succès sans rien envoyer, pour ne pas
        // renseigner le robot. Journal sans aucune donnée personnelle.
        const reason = spamReason(input);
        if (reason) {
          console.info(`[Contact] Envoi ignoré (anti-spam) : ${reason}.`);
          return CONTACT_SUCCESS;
        }

        // Canaux d'envoi vers le propriétaire, lancés en parallèle. La notification Manus
        // n'existe que si Forge est configuré ; l'e-mail passe par Resend (ou Forge).
        const notification = isForgeConfigured()
          ? notifyOwner({
              title: `Nouveau message de contact de ${input.name}`,
              content: `Email: ${input.email}\n\nSujet: ${input.subject}\n\nMessage:\n${input.message}`,
            }).catch(error => {
              console.error("[Contact] Échec de la notification :", error);
              return false;
            })
          : Promise.resolve(false);

        // Pas d'e-mail de confirmation au visiteur : l'adresse saisie n'est pas
        // vérifiée, le formulaire servirait sinon de relais vers n'importe qui.
        // Le propriétaire reçoit le message et répond lui-même (reply-to).
        const email = emailProvider()
          ? sendEmail({
              to: ENV.ownerEmail,
              // sendEmail retire aussi les CR/LF de l'objet (défense en profondeur).
              subject: `Nouveau message de contact : ${input.subject}`,
              html: generateOwnerEmailHTML(input.name, input.email, input.subject, input.message),
              replyTo: input.email,
            })
          : Promise.resolve(false);

        const [notified, emailed] = await Promise.all([notification, email]);

        // Un succès n'est renvoyé que si le message est réellement parti quelque part.
        if (!notified && !emailed) {
          if (!emailProvider() && !isForgeConfigured()) {
            console.error(
              "[Contact] Aucun canal d'envoi configuré : définissez RESEND_API_KEY (et OWNER_EMAIL) dans les variables d'environnement."
            );
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Le message n'a pas pu être envoyé. Écrivez-moi directement par e-mail.",
          });
        }

        return CONTACT_SUCCESS;
      })
  }),
});

export type AppRouter = typeof appRouter;
