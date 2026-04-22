import { Card } from "@/components/ui/card";
import { ArrowRight, Code, Zap, Globe, Github, Linkedin, Mail, Loader2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "@/components/Navbar";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 800, offset: 100, once: false });
  }, []);

  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

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

  return (
    <div className="min-h-screen bg-white text-foreground">

      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-32 flex items-center relative z-10">
          <div className="space-y-6 max-w-2xl" data-aos="fade-up">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Développeur Web & <span className="text-primary">Automation</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Étudiant en BUT MMI passionné par la création de solutions web modernes et l'automatisation de processus.
              </p>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md">
              Prêt à collaborer sur des projets innovants et à apporter mon expertise technique à votre équipe.
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
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-transparent z-10"></div>
      </section>

      {/* Compétences */}
      <section id="competences" className="py-20 md:py-32 bg-secondary/30">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-bold">Mes Compétences</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              La boîte à outils d'un développeur, alliant maîtrise technique et créativité.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Code, title: "Développement Web", description: "HTML, CSS, JavaScript, React, TypeScript, PHP, MySQL, Bootstrap" },
              { icon: Zap, title: "Automation & DevOps", description: "Scripts d'automatisation, gestion de projets, CI/CD, outils collaboratifs" },
              { icon: Globe, title: "Design & UX", description: "Figma, Adobe Suite, SEO, Web Marketing, Responsive Design" }
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

      {/* Aperçu Projets */}
      <section className="py-20 md:py-32 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4" data-aos="fade-up">
              <div className="space-y-4 max-w-2xl">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Mes Projets</span>
                <h2 className="text-3xl md:text-5xl font-bold">Quelques Réalisations</h2>
                <p className="text-base md:text-lg text-muted-foreground">Des projets concrets alliant créativité, technique et innovation.</p>
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
                  tags: ["Unity", "C#", "Game Dev"],
                  href: "/projects"
                },
                {
                  title: "Portfolio React",
                  description: "Portfolio moderne développé avec React, TypeScript et Tailwind CSS, avec animations et design responsive.",
                  tags: ["React", "TypeScript", "Tailwind"],
                  href: "/projects"
                }
              ].map((project, idx) => (
                <Card
                  key={idx}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md bg-white"
                >
                  <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                    <a href={project.href} className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:gap-2 transition-all">
                      Voir le projet <ArrowRight size={14} />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 md:py-32 bg-secondary/20">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8" data-aos="fade-right">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Contact</span>
                <h2 className="text-3xl md:text-5xl font-bold">Travaillons Ensemble</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Vous avez un projet en tête ? Je serais ravi d'en discuter et de vous accompagner dans sa réalisation.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: "falou.badiane@example.com", href: "mailto:falou.badiane@example.com" },
                  { icon: Github, label: "GitHub", value: "github.com/Badiane95", href: "https://github.com/Badiane95" },
                  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/falou-badiane", href: "https://linkedin.com/in/falou-badiane" }
                ].map((contact, idx) => (
                  <a
                    key={idx}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <contact.icon size={20} className="text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{contact.label}</p>
                      <p className="font-medium">{contact.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div data-aos="fade-left">
              <Card className="p-8 shadow-xl border-0 bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sujet</label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre projet..."
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendContactMutation.isPending}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {sendContactMutation.isPending ? (
                      <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
                    ) : (
                      <><Mail size={18} /> Envoyer le message</>
                    )}
                  </button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
