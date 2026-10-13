import { z } from "zod";

/**
 * Règles du formulaire de contact, partagées par le client (validation en
 * direct dans client/src/components/ContactForm.tsx) et par le serveur
 * (procédure contact.send dans server/routers.ts). Une seule source de vérité :
 * le client ne peut plus accepter une valeur que le serveur refuserait.
 */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 5, max: 150 },
  message: { min: 10, max: 5000 },
} as const;

/**
 * Durée minimale (en ms) entre l'ouverture du formulaire et l'envoi. En dessous,
 * l'envoi vient presque sûrement d'un robot : le serveur l'ignore sans le dire.
 */
export const CONTACT_MIN_FILL_MS = 3000;

// Aucun retour chariot ni saut de ligne : ces valeurs finissent dans un titre
// ou dans l'objet d'un e-mail (risque d'injection d'en-têtes).
const SINGLE_LINE = /^[^\r\n]*$/;

/** Champs visibles du formulaire. `.trim()` s'applique avant les contrôles de longueur. */
export const contactFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.name.min,
      `Le nom doit contenir au moins ${CONTACT_LIMITS.name.min} caractères.`
    )
    .max(
      CONTACT_LIMITS.name.max,
      `Le nom ne doit pas dépasser ${CONTACT_LIMITS.name.max} caractères.`
    )
    .regex(SINGLE_LINE, "Le nom doit tenir sur une seule ligne."),
  email: z
    .string()
    .trim()
    .min(1, "Saisissez votre adresse e-mail.")
    .max(
      CONTACT_LIMITS.email.max,
      `L'adresse e-mail ne doit pas dépasser ${CONTACT_LIMITS.email.max} caractères.`
    )
    .pipe(z.email("Saisissez une adresse e-mail valide.")),
  subject: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.subject.min,
      `Le sujet doit contenir au moins ${CONTACT_LIMITS.subject.min} caractères.`
    )
    .max(
      CONTACT_LIMITS.subject.max,
      `Le sujet ne doit pas dépasser ${CONTACT_LIMITS.subject.max} caractères.`
    )
    .regex(SINGLE_LINE, "Le sujet doit tenir sur une seule ligne."),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.message.min,
      `Le message doit contenir au moins ${CONTACT_LIMITS.message.min} caractères.`
    )
    .max(
      CONTACT_LIMITS.message.max,
      `Le message ne doit pas dépasser ${CONTACT_LIMITS.message.max} caractères.`
    ),
});

/** Entrée complète de contact.send : les champs visibles et les deux signaux anti-spam. */
export const contactInputSchema = contactFieldsSchema.extend({
  /** Champ piège, invisible pour un humain : s'il est rempli, l'envoi vient d'un robot. */
  website: z.string().optional(),
  /** Temps écoulé (ms) entre l'ouverture du formulaire et l'envoi, mesuré par le client. */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type ContactField = keyof typeof contactFieldsSchema.shape;
export type ContactFields = z.infer<typeof contactFieldsSchema>;
export type ContactInput = z.input<typeof contactInputSchema>;
