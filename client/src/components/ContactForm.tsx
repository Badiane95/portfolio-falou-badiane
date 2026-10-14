import { profile } from "@/data/portfolio";
import { trpc } from "@/lib/trpc";
import { CONTACT_LIMITS, contactFieldsSchema, type ContactField } from "@shared/contact";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { EASE_OUT } from "./motion/Reveal";

type Field = ContactField;
type Values = Record<Field, string>;
type FieldErrors = Partial<Record<Field, string>>;

const FIELDS: Field[] = ["name", "email", "subject", "message"];
const LABELS: Record<Field, string> = { name: "Nom", email: "E-mail", subject: "Sujet", message: "Message" };
const EMPTY: Values = { name: "", email: "", subject: "", message: "" };
const SEND_FAILED = "Le message n'a pas pu partir depuis le site. Il est prêt à être envoyé depuis votre messagerie :";

// Même schéma zod que le serveur (shared/contact.ts) : mêmes règles, mêmes messages.
function validate(field: Field, value: string): string | null {
  const result = contactFieldsSchema.shape[field].safeParse(value);
  return result.success ? null : (result.error.issues[0]?.message ?? "Valeur invalide.");
}

const isField = (value: unknown): value is Field => FIELDS.includes(value as Field);

/**
 * Traduit une erreur du serveur en message lisible. Une erreur de validation
 * arrive sous forme de JSON (liste des problèmes zod) : on en extrait les
 * messages par champ au lieu d'afficher le JSON brut.
 */
function readServerError(error: { message: string; data?: { code?: string } | null }): {
  message: string;
  fields: FieldErrors;
  /** Proposer l'envoi par la messagerie du visiteur (panne d'envoi, réseau…). */
  mailto: boolean;
} {
  const code = error.data?.code;
  if (code === "TOO_MANY_REQUESTS") {
    return { message: error.message || "Trop de messages envoyés. Réessayez plus tard.", fields: {}, mailto: true };
  }
  if (code === "BAD_REQUEST") {
    const fields: FieldErrors = {};
    try {
      const issues: unknown = JSON.parse(error.message);
      if (Array.isArray(issues)) {
        for (const issue of issues) {
          const field = issue?.path?.[0];
          if (isField(field) && typeof issue.message === "string" && !fields[field]) fields[field] = issue.message;
        }
      }
    } catch {
      // Pas du JSON : on garde le message générique ci-dessous.
    }
    return { message: "Certains champs ne sont pas valides. Corrigez-les puis renvoyez le message.", fields, mailto: false };
  }
  return { message: SEND_FAILED, fields: {}, mailto: true };
}

/** Lien mailto pré-rempli avec le contenu du formulaire, en solution de secours. */
function mailtoHref(values: Values): string {
  const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(values.subject.trim())}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverError, setServerError] = useState<{ message: string; mailto: boolean } | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<FieldErrors>({});
  const [sent, setSent] = useState(false);
  // Champ piège : invisible pour un humain, rempli par les robots naïfs.
  const [trap, setTrap] = useState("");
  // Instant d'ouverture du formulaire : le serveur ignore un envoi trop rapide.
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const mutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      setValues(EMPTY);
      setTouched({});
      setTrap("");
      openedAt.current = Date.now();
      setTimeout(() => setSent(false), 4000);
    },
    onError: error => {
      const { message, fields, mailto } = readServerError(error);
      setServerError({ message, mailto });
      setServerFieldErrors(fields);
    },
  });

  const errors = Object.fromEntries(FIELDS.map(f => [f, validate(f, values[f])])) as Record<Field, string | null>;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as Field;
    setServerError(null);
    setServerFieldErrors(s => ({ ...s, [field]: undefined }));
    setValues(v => ({ ...v, [field]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const parsed = contactFieldsSchema.safeParse(values);
    if (!parsed.success) {
      const firstInvalid = FIELDS.find(f => errors[f]);
      if (firstInvalid) document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    mutation.mutate({
      ...parsed.data,
      website: trap,
      elapsedMs: Math.max(0, Math.round(Date.now() - openedAt.current)),
    });
  };

  const state = mutation.isPending ? "pending" : sent ? "sent" : "idle";
  const shownErrors = Object.fromEntries(
    FIELDS.map(f => [f, (touched[f] ? errors[f] : null) ?? serverFieldErrors[f] ?? null])
  ) as Record<Field, string | null>;
  const inputProps = { values, errors: shownErrors, onChange, setTouched };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input field="name" autoComplete="name" {...inputProps} />
        <Input field="email" type="email" autoComplete="email" {...inputProps} />
      </div>
      <Input field="subject" {...inputProps} />
      <Input field="message" multiline {...inputProps} />

      {/* Champ piège anti-spam : hors écran, ignoré des lecteurs d'écran et hors du parcours clavier. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden opacity-0">
        <label htmlFor="contact-website">Site web (laisser vide)</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={e => setTrap(e.target.value)}
        />
      </div>

      {serverError && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          <p>{serverError.message}</p>
          {serverError.mailto && (
            <a
              href={mailtoHref(values)}
              className="mt-1 inline-flex items-center gap-1 font-medium underline underline-offset-4"
            >
              Envoyer à {profile.email} <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          layout
          disabled={state === "pending"}
          className={`relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-6 text-sm font-medium transition-colors disabled:cursor-wait ${
            state === "sent"
              ? "bg-success text-success-foreground"
              : "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
          }`}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              className="inline-flex items-center gap-2"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              {state === "pending" && (
                <>
                  <Loader2 className="size-4 animate-spin" /> Envoi…
                </>
              )}
              {state === "sent" && (
                <>
                  <Check className="size-4" /> Message envoyé
                </>
              )}
              {state === "idle" && (
                <>
                  Envoyer le message <ArrowRight className="size-4" />
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {state === "sent" ? "Merci, je vous réponds rapidement." : "Tous les champs sont obligatoires."}
        </p>
      </div>
    </form>
  );
}

function Input({
  field,
  type = "text",
  multiline = false,
  autoComplete,
  values,
  errors,
  onChange,
  setTouched,
}: {
  field: Field;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  values: Values;
  errors: Record<Field, string | null>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setTouched: (fn: (t: Partial<Record<Field, boolean>>) => Partial<Record<Field, boolean>>) => void;
}) {
  const id = `contact-${field}`;
  const error = errors[field];
  const shared = {
    id,
    name: field,
    value: values[field],
    onChange,
    onBlur: () => setTouched(t => ({ ...t, [field]: true })),
    autoComplete,
    required: true,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: `peer w-full border-0 border-b bg-transparent px-0 py-2.5 text-base outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground ${
      error ? "border-destructive" : "border-border"
    }`,
  };
  const length = values.message.trim().length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="eyebrow">
          {LABELS[field]}
        </label>
        {field === "message" && (
          <span
            className={`font-mono text-[11px] ${length > CONTACT_LIMITS.message.max ? "text-destructive" : "text-muted-foreground"}`}
          >
            {length} / {CONTACT_LIMITS.message.max} car.
          </span>
        )}
      </div>
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={5} className={`${shared.className} block resize-none`} />
        ) : (
          <input {...shared} type={type} />
        )}
        {/* Trait d'accent qui se déploie depuis le centre au focus */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-px w-full origin-center scale-x-0 bg-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100"
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            className="mt-1.5 text-xs text-destructive"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
