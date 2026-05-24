import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, Send, MapPin, Loader2 } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  useEffect(() => {
    AOS.init({ duration: 800, once: false, offset: 100 });
  }, []);

  const sendContactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Message envoyé ! Je vous répondrai bientôt.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de l'envoi du message");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Le nom est obligatoire"); return; }
    if (formData.name.trim().length < 2) { toast.error("Le nom doit contenir au moins 2 caractères"); return; }
    if (!formData.email.trim()) { toast.error("L'email est obligatoire"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { toast.error("Veuillez entrer un email valide"); return; }
    if (!formData.subject.trim()) { toast.error("Le sujet est obligatoire"); return; }
    if (formData.subject.trim().length < 5) { toast.error("Le sujet doit contenir au moins 5 caractères"); return; }
    if (!formData.message.trim()) { toast.error("Le message est obligatoire"); return; }
    if (formData.message.trim().length < 10) { toast.error("Le message doit contenir au moins 10 caractères"); return; }
    sendContactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactLinks = [
    {
      icon: <Mail size={22} className="text-primary" />,
      label: "Email",
      value: "falou.badiane@example.com",
      href: "mailto:falou.badiane@example.com",
    },
    {
      icon: <Linkedin size={22} className="text-primary" />,
      label: "LinkedIn",
      value: "linkedin.com/in/falou-badiane",
      href: "https://linkedin.com/in/falou-badiane",
    },
    {
      icon: <Github size={22} className="text-primary" />,
      label: "GitHub",
      value: "github.com/Badiane95",
      href: "https://github.com/Badiane95",
    },
    {
      icon: <MapPin size={22} className="text-primary" />,
      label: "Localisation",
      value: "Marseille, France",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 text-center space-y-4" data-aos="fade-up">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Contact</span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Travaillons <span className="text-primary">ensemble</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Vous avez un projet, une question ou une opportunité ? N'hésitez pas à me contacter.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="py-20 md:py-24">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Infos de contact */}
            <div className="space-y-6" data-aos="fade-right">
              <h2 className="text-2xl font-bold">Me retrouver</h2>
              <p className="text-muted-foreground">
                Disponible pour des missions freelance, des collaborations ou simplement pour échanger sur un projet.
              </p>
              <div className="space-y-4">
                {contactLinks.map((link, idx) => (
                  <Card key={idx} className="p-4 border-0 shadow-sm bg-secondary/20 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      {link.icon}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">{link.label}</p>
                      {link.href ? (
                        <a
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-sm font-medium hover:text-primary transition-colors"
                        >
                          {link.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{link.value}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Formulaire */}
            <div data-aos="fade-left">
              <Card className="p-8 border-0 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Envoyer un message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Nom *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Sujet *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre projet ou votre demande..."
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendContactMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sendContactMutation.isPending ? (
                      <><Loader2 size={18} className="animate-spin" /> Envoi en cours…</>
                    ) : (
                      <><Send size={18} /> Envoyer le message</>
                    )}
                  </button>
                </form>
              </Card>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
