import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Linkedin, Github, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function About() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      offset: 100
    });
  }, []);

  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Express", "tRPC", "REST APIs", "GraphQL"] },
    { category: "Base de données", items: ["MySQL", "PostgreSQL", "MongoDB", "Drizzle ORM"] },
    { category: "Outils & DevOps", items: ["Git", "Docker", "CI/CD", "Vite", "Webpack"] },
    { category: "Design", items: ["Figma", "Adobe Suite", "UX/UI Design", "Responsive Design"] },
    { category: "Data & IA", items: ["Python", "Web Scraping", "IA/ML", "Data Visualization", "APIs", "Automation", "Google Maps API", "D3.js"] },
  ];

  const experiences = [
    {
      period: "2023 - Présent",
      title: "Développeur Web Freelance",
      company: "Auto-entrepreneur",
      description: "Développement de sites web et applications pour des clients locaux. Spécialisation en React et Node.js."
    },
    {
      period: "2022 - 2023",
      title: "Stage Développeur Web",
      company: "Agence Web Locale",
      description: "Création de sites vitrine et e-commerce. Travail en équipe avec des designers et chefs de projet."
    }
  ];

  const education = [
    {
      period: "2022 - 2025",
      title: "BUT MMI - Multimédia et Internet",
      school: "IUT de Marseille",
      description: "Spécialisation Développement Web. Formation complète en développement web, design et communication numérique."
    },
    {
      period: "2019 - 2022",
      title: "Baccalauréat STMG",
      school: "Lycée de Marseille",
      description: "Spécialité Systèmes d'Information de Gestion. Mention Bien."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-foreground">

      <Navbar />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/20">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6" data-aos="fade-right">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">À propos</span>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Bonjour, je suis <span className="text-primary">Falou Badiane</span>
                </h1>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Étudiant en BUT MMI passionné par le développement web et l'automatisation. Je crée des solutions modernes qui allient technique et créativité.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Basé à Marseille, je travaille sur des projets web innovants et cherche continuellement à apprendre de nouvelles technologies.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="mailto:falou.badiane@example.com"
                  className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  <Mail size={16} /> Me contacter
                </a>
                <a href="https://github.com/Badiane95" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-primary text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary/5 transition-colors">
                  <Github size={16} /> GitHub
                </a>
                <a href="https://linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  <Linkedin size={16} /> LinkedIn
                </a>
              </div>
            </div>
            <div className="flex justify-center" data-aos="fade-left">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-8xl">👨‍💻</span>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                  <p className="text-sm font-medium text-primary">BUT MMI</p>
                  <p className="text-xs text-muted-foreground">Dév. Web</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="py-20 md:py-24 bg-secondary/20">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div data-aos="fade-up">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">Compétences</span>
            <h2 className="text-3xl md:text-4xl font-bold">Mes technologies</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {skills.map((group, idx) => (
              <Card key={idx} className="p-6 bg-white border-0 shadow-sm" data-aos="fade-up" data-aos-delay={idx * 80}>
                <h3 className="font-bold text-primary mb-3">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map(item => (
                    <span key={item} className="px-2 py-1 bg-primary/8 text-primary text-xs rounded-full font-medium">{item}</span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expérience */}
      <section className="py-20 md:py-24 bg-white">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 space-y-12">
          <div data-aos="fade-up">
            <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">Parcours</span>
            <h2 className="text-3xl md:text-4xl font-bold">Expérience & Formation</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Globe size={20} className="text-primary" /> Expérience</h3>
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-primary/20" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary"></div>
                  <p className="text-xs text-muted-foreground mb-1">{exp.period}</p>
                  <h4 className="font-bold">{exp.title}</h4>
                  <p className="text-sm text-primary mb-2">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Globe size={20} className="text-primary" /> Formation</h3>
              {education.map((edu, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-accent/40" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-accent"></div>
                  <p className="text-xs text-muted-foreground mb-1">{edu.period}</p>
                  <h4 className="font-bold">{edu.title}</h4>
                  <p className="text-sm text-primary mb-2">{edu.school}</p>
                  <p className="text-sm text-muted-foreground">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="w-full max-w-6xl mx-auto px-4 md:px-8 text-center space-y-6" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold">Travaillons ensemble !</h2>
          <p className="text-white/80 text-lg max-w-xl mx-auto">Vous avez un projet ? Je suis disponible pour collaborer.</p>
          <Button
            onClick={() => setLocation('/#contact')}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-xl"
          >
            Me contacter
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
