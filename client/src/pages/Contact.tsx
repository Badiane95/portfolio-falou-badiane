import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Linkedin, Github, Phone, MapPin, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const sendContactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast.success("Message envoyé avec succès ! Je vous répondrai bientôt.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erreur lors de l'envoi du message");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation côté client
    if (!formData.name.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    if (formData.name.trim().length < 2) {
      toast.error("Le nom doit contenir au moins 2 caractères");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("L'email est obligatoire");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Veuillez entrer un email valide");
      return;
    }
    if (!formData.subject.trim()) {
      toast.error("Le sujet est obligatoire");
      return;
    }
    if (formData.subject.trim().length < 5) {
      toast.error("Le sujet doit contenir au moins 5 caractères");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Le message est obligatoire");
      return;
    }
    if (formData.message.trim().length < 10) {
      toast.error("Le message doit contenir au moins 10 caractères");
      return;
    }
    
    sendContactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Réponse rapide à vos messages",
      value: "badiane.falou95@gmail.com",
      link: "mailto:badiane.falou95@gmail.com"
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      description: "Connectez-vous avec moi",
      value: "Falou Badiane",
      link: "https://linkedin.com/in/falou-badiane"
    },
    {
      icon: Github,
      title: "GitHub",
      description: "Découvrez mes projets",
      value: "badiane95",
      link: "https://github.com/badiane95"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">Falou Badiane</div>
          <div className="flex items-center gap-4">
            <ul className="hidden md:flex gap-8">
              <li><a href="/#competences" className="hover:text-primary transition-colors">Compétences</a></li>
              <li><a href="/projects" className="hover:text-primary transition-colors">Projets</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">À propos</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
            <Button 
              onClick={() => setLocation('/')}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5 gap-2"
            >
              <ArrowLeft size={18} /> Retour
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <div className="container space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Contactez-moi</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Vous avez un projet intéressant ou des questions ? N'hésitez pas à me contacter. Je serais ravi de discuter avec vous.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 md:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Moyens de contact</h2>
            <p className="text-lg text-muted-foreground">
              Plusieurs façons de me joindre pour discuter de vos projets ou collaborations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, idx) => (
              <a 
                key={idx}
                href={method.link}
                target={method.link.startsWith('http') ? "_blank" : undefined}
                rel={method.link.startsWith('http') ? "noopener noreferrer" : undefined}
                className="no-underline"
              >
                <Card className="p-8 h-full border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <method.icon className="w-12 h-12 text-primary mb-6" />
                  <h3 className="text-2xl font-bold mb-2">{method.title}</h3>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <p className="text-primary font-semibold">{method.value}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Envoyez-moi un message</h2>
            <p className="text-lg text-muted-foreground">
              Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.
            </p>
          </div>

          <Card className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide">
                  Nom <span className="text-accent">(min. 2 caractères)</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom complet"
                  minLength={2}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre.email@example.com"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Sujet */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide">
                  Sujet <span className="text-accent">(min. 5 caractères)</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Objet de votre message"
                  minLength={5}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide">
                  Message <span className="text-accent">(min. 10 caractères)</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message détaillé..."
                    minLength={10}
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  />
                  <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {formData.message.length}/500
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={sendContactMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 font-semibold"
              >
                {sendContactMutation.isPending ? "Envoi en cours..." : "Envoyer le message"}
              </Button>
            </form>
          </Card>

          {/* Info Box */}
          <Card className="p-8 bg-primary/5 border-l-4 border-l-primary">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Informations utiles</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Temps de réponse</p>
                    <p className="text-muted-foreground">Je réponds généralement dans les 24-48 heures</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="text-primary mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Préférence de contact</p>
                    <p className="text-muted-foreground">Email pour les demandes détaillées, LinkedIn pour les connexions professionnelles</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8">
        <div className="container text-center text-muted-foreground text-sm">
          <p>&copy; 2025 Falou Badiane. Tous droits réservés.</p>
          <p className="mt-2">Développeur Web & Automation | Portfolio Minimaliste Moderne</p>
        </div>
      </footer>
    </div>
  );
}
