import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Zap, Globe, Github, Linkedin, Mail, Loader2, Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import BubbleMenu from "@/components/BubbleMenu";

/**
 * DESIGN PHILOSOPHY: Minimalisme Moderne Technologique
 * - Espace blanc généreux avec hiérarchie claire
 * - Asymétrie intentionnelle pour dynamique visuelle
 * - Transitions fluides et microinteractions subtiles
 * - Palette : Bleu #0052CC, Blanc, Cyan #06B6D4
 * - Police : Rubik (Bold pour titres, Regular pour corps)
 */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { label: "Compétences", href: "/skills" },
    { label: "Projets", href: "/projects" },
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Bubble Menu Navigation */}
      <BubbleMenu
        logo="Falou Badiane"
        menuBg="#fff"
        menuContentColor="#111"
        useFixedPosition={true}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20">
        {/* Aurora-like Background Effect */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-32 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          {/* Texte Hero - Asymétrie à gauche */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Développeur Web & <span className="text-primary">Automation</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Étudiant en BUT MMI passionné par la création de solutions web modernes et l'automatisation de processus.
              </p>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Passionné par la création de solutions web modernes et l'automatisation de processus. Prêt à collaborer sur des projets innovants et à apporter mon expertise technique à votre équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="/projects" className="bg-primary hover:bg-primary/90 text-white gap-2 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center">
                Découvrir mon travail <ArrowRight size={18} />
              </a>
              <a href="/CV-Falou-Badiane.pdf" download className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2">
                <Download size={18} /> Télécharger CV
              </a>
            </div>
          </div>

          {/* Image Hero - Asymétrie à droite */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"></div>
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/hero-background-gSWqmtSn8WsMuBYEqWRRCY.webp"
              alt="Hero Background"
              className="w-full h-96 object-cover rounded-2xl"
            />
          </div>
        </div>

        {/* Ligne diagonale de séparation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent"></div>
      </section>

      {/* Section Compétences */}
      <section id="competences" className="py-20 md:py-32 bg-secondary/30">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold">Mes Compétences</h2>
            <p className="text-lg text-muted-foreground">
              La boîte à outils d'un développeur, alliant maîtrise technique et créativité pour donner vie à vos projets web.
            </p>
          </div>

          {/* Grille de compétences avec cartes flottantes */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code,
                title: "Développement Web",
                description: "HTML, CSS, JavaScript, React, TypeScript, PHP, MySQL, Bootstrap"
              },
              {
                icon: Zap,
                title: "Automation & DevOps",
                description: "Scripts d'automatisation, gestion de projets, CI/CD, outils collaboratifs"
              },
              {
                icon: Globe,
                title: "Design & UX",
                description: "Figma, Adobe Suite, SEO, Web Marketing, Responsive Design"
              }
            ].map((skill, idx) => (
              <Card 
                key={idx}
                className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <skill.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm">{skill.description}</p>
              </Card>
            ))}
          </div>

          {/* Indicateurs de progression */}
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {[
              { label: "Projets Réalisés", value: "6+" },
              { label: "Années d'Expérience", value: "2+" },
              { label: "Technologies", value: "15+" },
              { label: "Satisfaction Client", value: "100%" }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 md:py-32 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="space-y-12">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold">Contactez-moi</h2>
              <p className="text-lg text-muted-foreground">
                Vous avez un projet en tête ? N'hésitez pas à me contacter. Je serais ravi de discuter de vos idées.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Moyens de contact */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Moyens de contact</h3>
                <div className="space-y-3">
                  <a href="mailto:badiane.falou95@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Mail size={20} />
                    badiane.falou95@gmail.com
                  </a>
                  <a href="https://github.com/Badiane95" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Github size={20} />
                    GitHub
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin size={20} />
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Formulaire de contact */}
              <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    value={formData.email}
                    onChange={handleChange}
                    className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  placeholder="Sujet"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  name="message"
                  placeholder="Votre message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={sendContactMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendContactMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le message"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
