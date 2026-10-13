import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { EASE_OUT } from "./motion/Reveal";

type Field = "name" | "email" | "subject" | "message";
type Values = Record<Field, string>;

// Mêmes règles que la validation zod du serveur (server/routers.ts).
const RULES: Record<Field, { label: string; min: number; check?: (v: string) => boolean; message: string }> = {
  name: { label: "Nom", min: 2, message: "Le nom doit contenir au moins 2 caractères." },
  email: {
    label: "E-mail",
    min: 1,
    check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: "Saisissez une adresse e-mail valide.",
  },
  subject: { label: "Sujet", min: 5, message: "Le sujet doit contenir au moins 5 caractères." },
  message: { label: "Message", min: 10, message: "Le message doit contenir au moins 10 caractères." },
};

const EMPTY: Values = { name: "", email: "", subject: "", message: "" };

function validate(field: Field, value: string): string | null {
  const rule = RULES[field];
  const v = value.trim();
  if (v.length < rule.min) return rule.message;
  if (rule.check && !rule.check(v)) return rule.message;
  return null;
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const mutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSent(true);
      setValues(EMPTY);
      setTouched({});
      setTimeout(() => setSent(false), 4000);
    },
    onError: error => setServerError(error.message || "L'envoi a échoué. Réessayez dans un instant."),
  });

  const errors = Object.fromEntries(
    (Object.keys(RULES) as Field[]).map(f => [f, validate(f, values[f])])
  ) as Record<Field, string | null>;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setServerError(null);
    setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    const firstInvalid = (Object.keys(RULES) as Field[]).find(f => errors[f]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    mutation.mutate({
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    });
  };

  const state = mutation.isPending ? "pending" : sent ? "sent" : "idle";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Input field="name" autoComplete="name" values={values} errors={errors} touched={touched} onChange={onChange} setTouched={setTouched} />
        <Input field="email" type="email" autoComplete="email" values={values} errors={errors} touched={touched} onChange={onChange} setTouched={setTouched} />
      </div>
      <Input field="subject" values={values} errors={errors} touched={touched} onChange={onChange} setTouched={setTouched} />
      <Input field="message" multiline values={values} errors={errors} touched={touched} onChange={onChange} setTouched={setTouched} />

      {serverError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          layout
          disabled={state === "pending"}
          className={`relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-md px-6 text-sm font-medium text-background transition-colors disabled:cursor-wait ${
            state === "sent" ? "bg-[#1f7a4d]" : "bg-foreground hover:bg-primary"
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
  touched,
  onChange,
  setTouched,
}: {
  field: Field;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  values: Values;
  errors: Record<Field, string | null>;
  touched: Partial<Record<Field, boolean>>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setTouched: (fn: (t: Partial<Record<Field, boolean>>) => Partial<Record<Field, boolean>>) => void;
}) {
  const id = `contact-${field}`;
  const error = touched[field] ? errors[field] : null;
  const rule = RULES[field];
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

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="eyebrow">
          {rule.label}
        </label>
        {field === "message" && (
          <span className="font-mono text-[11px] text-muted-foreground">{values.message.trim().length} car.</span>
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
