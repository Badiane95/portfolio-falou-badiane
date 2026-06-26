import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import Folder from "@/components/Folder";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import PillNav from "@/components/PillNav";
import { Footer } from "@/components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

/**
 * DESIGN PHILOSOPHY: Minimalisme Moderne Technologique
 * - Espace blanc généreux avec hiérarchie claire
 * - Asymétrie intentionnelle pour dynamique visuelle
 * - Transitions fluides et microinteractions subtiles
 * - Palette : Bleu #0052CC, Blanc, Cyan #06B6D4
 * - Police : Rubik (Bold pour titres, Regular pour corps)
 */

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: false
    });
  }, []);

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
    <div className="min-h-screen text-foreground pt-16">
      <PillNav />

      {/* Hero Section - Fullscreen */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-20 text-center relative z-10">
          <div data-aos="fade-up">
            <div className="mb-4 inline-block px-4 py-1 border border-zinc-600 text-zinc-300 text-sm rounded-full">
              Développeur Fullstack
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <DiaTextReveal text="Falou Badiane" textColor="white" />
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto mb-4">
              Développeur Web & Automation
            </p>
            <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-8">
              Étudiant en BUT MMI passionné par la création de solutions web modernes et l'automatisation de processus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/projects" className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center text-lg">
                Découvrir mon travail <ArrowRight size={20} />
              </a>
              <a href="/CV-Falou-Badiane.pdf" download className="border border-zinc-500 text-zinc-200 hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 text-lg">
                <Download size={20} /> Télécharger CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Compétences */}
      <section id="competences" className="py-20 md:py-32 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold"><DiaTextReveal text="Mes Compétences" /></h2>
            <p className="text-base md:text-lg text-zinc-400">
              La boîte à outils d'un développeur, alliant maîtrise technique et créativité pour donner vie à vos projets web.
            </p>
          </div>

          {/* Grille de compétences avec dossiers interactifs */}
          <div className="flex flex-wrap justify-center gap-12 md:gap-16 py-8">
            {[
              {
                color: "#0052CC",
                title: "Développement Web",
                items: ["HTML/CSS", "JavaScript", "React", "TypeScript", "PHP", "MySQL", "Bootstrap"]
              },
              {
                color: "#5227FF",
                title: "Automation & DevOps",
                items: ["Scripts", "Gestion Projets", "CI/CD", "Outils Collaboratifs"]
              },
              {
                color: "#06B6D4",
                title: "Design & UX",
                items: ["Figma", "Adobe Suite", "SEO", "Web Marketing", "Responsive Design"]
              }
            ].map((skill, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3" data-aos="fade-up" data-aos-delay={idx * 100}>
                <Folder
                  color={skill.color}
                  size={2.2}
                  items={skill.items.map((tech, i) => (
                    <span key={i} className="text-[7px] font-medium text-zinc-800 block text-center leading-tight px-0.5">{tech}</span>
                  ))}
                />
                <span className="text-sm font-medium text-zinc-300">{skill.title}</span>
              </div>
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
              <div key={idx} className="space-y-2" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <p className="text-zinc-400">{stat.label}</p>
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="pt-8" data-aos="fade-up">
            <a href="/skills" className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 transition-colors">
              Voir toutes les compétences <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* Section Aperçu Projets */}
      <section className="py-20 md:py-32 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" data-aos="fade-up">
              <div className="space-y-4 max-w-2xl">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Mes Projets</span>
                <h2 className="text-3xl md:text-5xl font-bold"><DiaTextReveal text="Quelques Réalisations" /></h2>
                <p className="text-base md:text-lg text-zinc-400">
                  Des projets concrets alliant créativité, technique et innovation.
                </p>
              </div>
              <a href="/projects" className="shrink-0 inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors">
                Voir tous les projets <ArrowRight size={18} />
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Webdocumentaire Interactif",
                  description: "Webdocumentaire immersif avec navigation non-linéaire, animations CSS avancées et intégration multimédia.",
                  tags: ["HTML/CSS", "JavaScript", "UX Design"],
                  href: "/projects"
                },
                {
                  title: "Jeu Vidéo Unity",
                  description: "Jeu de plateforme 2D développé avec Unity et C#, avec physique, animations et système de score.",
                  tags: ["Unity", "C#", "Game Design"],
                  href: "/projects"
                },
                {
                  title: "Data Visualization",
                  description: "Tableau de bord interactif avec géolocalisation et visualisation de données en temps réel.",
                  tags: ["JavaScript", "Charts.js", "API"],
                  href: "/projects"
                }
              ].map((project, idx) => (
                <a
                  key={idx}
                  href={project.href}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group block"
                >
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-primary cursor-pointer">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section À Propos CTA */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" data-aos="fade-right">
              <span className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">À Propos</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                <DiaTextReveal text="Qui suis-je ?" textColor="white" />
                <br />
                <span className="text-cyan-300">Falou Badiane</span>
              </h2>
              <p className="text-white/80 text-base md:text-lg leading-relaxed">
                Étudiant en BUT MMI, passionné par le développement web et l'automatisation. Je combine créativité et expertise technique pour créer des expériences numériques mémorables.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                En savoir plus <ArrowRight size={18} />
              </a>
            </div>
            <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
              {[
                { label: "Projets Réalisés", value: "6+", icon: "🚀" },
                { label: "Technologies", value: "15+", icon: "⚡" },
                { label: "Années d'études", value: "3", icon: "🎓" },
                { label: "Langues", value: "2", icon: "🌍" }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                  className="bg-white/10 rounded-2xl p-6 text-center border border-white/20"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/70 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="py-20 md:py-32 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="space-y-8">
            <div className="space-y-4 max-w-2xl" data-aos="fade-up">
              <h2 className="text-3xl md:text-5xl font-bold"><DiaTextReveal text="Vous avez un projet ?" /></h2>
                <p className="text-base md:text-lg text-zinc-400">
                  N'hésitez pas à me contacter pour discuter de vos besoins en développement web ou automatisation.
              </p>
            </div>

            <Card className="p-8 md:p-12" data-aos="fade-up">
              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Nom (min. 2 caractères)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Sujet (min. 5 caractères)</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  minLength={5}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Message (min. 10 caractères) - {formData.message.length}/10
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  minLength={10}
                  rows={5}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                disabled={sendContactMutation.isPending}
                className="w-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
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
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
