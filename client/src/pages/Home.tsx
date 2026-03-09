import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Zap, Globe, Github, Linkedin, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * DESIGN PHILOSOPHY: Minimalisme Moderne Technologique
 * - Espace blanc généreux avec hiérarchie claire
 * - Asymétrie intentionnelle pour dynamique visuelle
 * - Transitions fluides et microinteractions subtiles
 * - Palette : Bleu #0052CC, Blanc, Cyan #06B6D4
 * - Police : Rubik (Bold pour titres, Regular pour corps)
 */

export default function Home() {
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

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">Falou Badiane</div>
          <ul className="hidden md:flex gap-8">
            <li><a href="#competences" className="hover:text-primary transition-colors">Compétences</a></li>
            <li><a href="#projets" className="hover:text-primary transition-colors">Projets</a></li>
            <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          {/* Texte Hero - Asymétrie à gauche */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Développeur Web & <span className="text-primary">Automation</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Étudiant en BUT MMI passionné par la création de solutions web modernes et l'automatisation de processus.
              </p>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              À la recherche d'une alternance pour mettre en pratique mes compétences en développement web, design et automatisation. Prêt à apporter mon enthousiasme et mon savoir-faire à votre équipe.
            </p>
            <div className="flex gap-4 pt-4">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                Découvrir mon travail <ArrowRight size={18} />
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Télécharger CV
              </Button>
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
        <div className="container space-y-12">
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
              { label: "Projets Réalisés", value: "8+" },
              { label: "Années d'Expérience", value: "2+" },
              { label: "Technologies", value: "15+" },
              { label: "Satisfaction Client", value: "100%" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Projets */}
      <section id="projets" className="py-20 md:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold">Mes Projets</h2>
            <p className="text-lg text-muted-foreground">
              Découvrez mes projets qui regroupent mes passions, où chaque ligne de code raconte mon parcours de développeur créatif et innovant.
            </p>
          </div>

          {/* Projets en grille asymétrique */}
          <div className="space-y-8">
            {[
              {
                title: "Festival Les Talents de l'IUT",
                description: "Réalisation de vidéos promotionnelles pour le festival de l'IUT de Cergy-Pontoise. Production vidéo, montage et promotion digitale.",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/projects-visual-32nb734QPQjZo6S5HmpdqR.webp",
                tags: ["Vidéo", "Production", "Promotion"]
              },
              {
                title: "Site Web Institutionnel",
                description: "Développement d'un site pour présenter la formation MMI de l'IUT. Intégration de bases de données et gestion de contenu dynamique.",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/projects-visual-32nb734QPQjZo6S5HmpdqR.webp",
                tags: ["Web", "PHP", "MySQL"]
              },
              {
                title: "Webdocumentaire Interactif",
                description: "Création d'une expérience immersive combinant Klynt et DaVinci Resolve. Présentation d'un court-métrage avec navigation interactive.",
                image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/projects-visual-32nb734QPQjZo6S5HmpdqR.webp",
                tags: ["Interactif", "Vidéo", "Design"]
              }
            ].map((project, idx) => (
              <Card 
                key={idx}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 md:h-auto object-cover"
                  />
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                    <p className="text-muted-foreground mb-4">{project.description}</p>
                    <div className="flex gap-2 flex-wrap mb-6">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button className="w-fit bg-primary hover:bg-primary/90 text-white">
                      Voir le projet <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-2xl space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Parlons de votre projet</h2>
            <p className="text-lg text-white/80">
              Vous cherchez un développeur passionné pour votre équipe ? Remplissez le formulaire ci-dessous et je vous répondrai rapidement.
            </p>
          </div>

          {/* Formulaire de contact */}
          <Card className="p-8 bg-white/95 text-foreground">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Nom complet <span className="text-xs text-muted-foreground">(min. 2 caractères)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={2}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email <span className="text-xs text-muted-foreground">(valide)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Sujet <span className="text-xs text-muted-foreground">(min. 5 caractères)</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength={5}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message <span className="text-xs text-muted-foreground">(min. 10 caractères)</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                  minLength={10}
                />
                <p className="text-xs text-muted-foreground">{formData.message.length} caractères</p>
              </div>

              <Button
                type="submit"
                disabled={sendContactMutation.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 flex items-center justify-center gap-2"
              >
                {sendContactMutation.isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer le message <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Réseaux sociaux */}
          <div className="text-center space-y-4">
            <p className="text-white/80">Ou contactez-moi directement :</p>
            <div className="flex gap-6 justify-center">
              <a href="https://github.com/badiane95" target="_blank" rel="noopener noreferrer" 
                 className="hover:opacity-80 transition-opacity">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer"
                 className="hover:opacity-80 transition-opacity">
                <Linkedin size={24} />
              </a>
              <a href="mailto:falou.badiane@example.com"
                 className="hover:opacity-80 transition-opacity">
                <Mail size={24} />
              </a>
            </div>
          </div>
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
