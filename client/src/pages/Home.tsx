import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Zap, Globe, Github, Linkedin, Mail, Loader2, Download, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import AOS from "aos";
import "aos/dist/aos.css";
import FloatingLines from "@/components/FloatingLines";

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

  const navLinks = [
    { label: "Compétences", href: "/skills" },
    { label: "Projets", href: "/projects" },
    { label: "À propos", href: "/about" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <a href="/" className="text-xl md:text-2xl font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">Falou Badiane</a>
          
          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-primary transition-colors text-sm md:text-base">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <ul className="flex flex-col gap-0">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="block px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20">

        {/* FloatingLines — couche animée en fond, blend screen pour traverser le gradient */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <FloatingLines
            linesGradient={['#0052CC', '#0077FF', '#06B6D4', '#22D3EE', '#0052CC']}
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={[8, 12, 6]}
            lineDistance={[4, 3, 6]}
            animationSpeed={0.6}
            interactive={true}
            bendRadius={4.0}
            bendStrength={-0.4}
            mouseDamping={0.04}
            parallax={true}
            parallaxStrength={0.15}
            mixBlendMode="screen"
            middleWavePosition={{ x: 5.0, y: 0.0, rotate: 0.3 }}
            topWavePosition={{ x: 10.0, y: 0.3, rotate: -0.5 }}
            bottomWavePosition={{ x: 2.0, y: -0.5, rotate: 0.8 }}
          />
        </div>

        {/* Aurora subtle blobs — derrière le contenu mais au-dessus des lignes */}
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Contenu hero — au-dessus de tout */}
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-32 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
          {/* Texte Hero */}
          <div className="space-y-6" data-aos="fade-up">
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
              <a href="/CV-Falou-Badiane.pdf" download className="border border-primary text-primary hover:bg-primary/5 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm">
                <Download size={18} /> Télécharger CV
              </a>
            </div>
          </div>

          {/* Image Hero */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"></div>
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/hero-background-gSWqmtSn8WsMuBYEqWRRCY.webp"
              alt="Hero Background"
              className="w-full h-96 object-cover rounded-2xl relative z-10 transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Ligne diagonale de séparation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent z-10"></div>
      </section>
      {/* ──────────────────────────────────────────────────────────────────────── */}

      {/* Section Compétences */}
      <section id="competences" className="py-20 md:py-32 bg-secondary/30">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold">Mes Compétences</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              La boîte à outils d'un développeur, alliant maîtrise technique et créativité pour donner vie à vos projets web.
            </p>
          </div>

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
                data-aos="fade-up"
                data-aos-delay={idx * 100} 
                key={idx}
                className="p-6 border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <skill.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm">{skill.description}</p>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {[
              { label: "Projets Réalisés", value: "8+" },
              { label: "Années d'Expérience", value: "2+" },
              { label: "Technologies", value: "15+" },
              { label: "Satisfaction Client", value: "100%" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2" data-aos="zoom-in" data-aos-delay={idx * 100}>
                <p className="text-muted-foreground">{stat.label}</p>
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
      <section className="py-20 md:py-32 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" data-aos="fade-up">
              <div className="space-y-4 max-w-2xl">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Mes Projets</span>
                <h2 className="text-3xl md:text-5xl font-bold">Quelques Réalisations</h2>
                <p className="text-base md:text-lg text-muted-foreground">
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
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{project.description}</p>
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
                Qui suis-je ?<br />
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
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
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
      <section id="contact" className="py-20 md:py-32 bg-secondary/30">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="space-y-8">
            <div className="space-y-4 max-w-2xl" data-aos="fade-up">
              <h2 className="text-3xl md:text-5xl font-bold">Vous avez un projet ?</h2>
              <p className="text-base md:text-lg text-muted-foreground">
                N'hésitez pas à me contacter pour discuter de vos besoins en développement web ou automatisation.
              </p>
            </div>

            <Card className="p-8 md:p-12" data-aos="fade-up">
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

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary/10 to-primary/5 border-t border-border py-12 md:py-16 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4" data-aos="fade-right" data-aos-duration="800" data-aos-once="true">
              <h3 className="text-2xl font-bold text-primary">Falou Badiane</h3>
              <p className="text-muted-foreground">
                Développeur Web & Automation passionné par la création de solutions innovantes.
              </p>
            </div>

            <div className="space-y-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100" data-aos-once="true">
              <h4 className="font-bold text-foreground">Navigation</h4>
              <ul className="space-y-2">
                <li data-aos="fade-up" data-aos-delay="150" data-aos-once="true"><a href="/#competences" className="text-muted-foreground hover:text-primary transition-colors">Compétences</a></li>
                <li data-aos="fade-up" data-aos-delay="200" data-aos-once="true"><a href="/projects" className="text-muted-foreground hover:text-primary transition-colors">Projets</a></li>
                <li data-aos="fade-up" data-aos-delay="250" data-aos-once="true"><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">À propos</a></li>
                <li data-aos="fade-up" data-aos-delay="300" data-aos-once="true"><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200" data-aos-once="true">
              <h4 className="font-bold text-foreground">Réseaux sociaux</h4>
              <div className="flex gap-4">
                <a href="https://github.com/Badiane95" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all hover:scale-110 duration-200" title="GitHub" data-aos="zoom-in" data-aos-delay="300" data-aos-once="true">
                  <Github size={20} className="text-primary" />
                </a>
                <a href="https://linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all hover:scale-110 duration-200" title="LinkedIn" data-aos="zoom-in" data-aos-delay="400" data-aos-once="true">
                  <Linkedin size={20} className="text-primary" />
                </a>
                <a href="mailto:badiane.falou95@gmail.com" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all hover:scale-110 duration-200" title="Email" data-aos="zoom-in" data-aos-delay="500" data-aos-once="true">
                  <Mail size={20} className="text-primary" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border my-8" data-aos="fade-up" data-aos-duration="600" data-aos-once="true"></div>

          <div className="text-center text-muted-foreground" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100" data-aos-once="true">
            <p>&copy; 2026 Falou Badiane. Tous les droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
