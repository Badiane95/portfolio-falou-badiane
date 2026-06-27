import { CoolMode } from "@/components/ui/cool-mode";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { Button } from "@/components/ui/button";
import BorderGlow from "@/components/BorderGlow";
import { Mail, Linkedin, Github, Globe, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import GooeyNav from "@/components/GooeyNav";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "@/components/Footer";

export default function About() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();

  const navItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Compétences', href: '/skills' },
    { label: 'Projets', href: '/projects' },
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const navIndexMap: Record<string, number> = {
    '/': 0,
    '/skills': 1,
    '/projects': 2,
    '/about': 3,
    '/contact': 4,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 800,
      once: false,
      offset: 100
    });
  }, []);

  const skills = [
    {
      category: "Développement Web",
      items: ["React", "Node.js", "HTML/CSS", "PHP", "JavaScript", "TypeScript", "MySQL", "Kotlin"]
    },
    {
      category: "Données & Automatisation",
      items: ["Python", "Web Scraping", "Automatisation IA", "API REST & JWT", "MySQL/SQL", "Git"]
    },
    {
      category: "Design & Prototypage",
      items: ["Figma", "UI/UX Design", "Responsive Design"]
    },
    {
      category: "Langages & Frameworks",
      items: ["React (JSX)", "Node.js", "Python", "C#", "PHP", "Kotlin", "JavaScript"]
    }
  ];

  const experience = [
    {
      title: "Développeur Full-Stack & Automatisation IA",
      company: "Unitee — Alternance",
      period: "10/2025 - 09/2026",
      description: "Conception et développement d'une application de gestion d'entreprise complète (ERP) en architecture React/Node.js/MySQL. Mise en place d'un système d'authentification JWT sécurisé. Développement de modules métiers complets (Prospects/CRM, factures, commandes, employés, RH, R&D). Implémentation d'un pipeline commercial avec vue Kanban et tableau de bord KPI. Création d'un système de relances email automatisées et d'un scanner de marchés publics (BOAMP) pour détection d'opportunités."
    },
    {
      title: "Développeur Full-Stack",
      company: "Unitee — Stage",
      period: "04/2025 - 06/2025",
      description: "Conception et déploiement de 5 workflows automatisés via IA, réduisant de 20% le temps opérationnel. Architecture complète d'un site web full-stack avec gestion de base SQL supportant 100 utilisateurs mensuels. Création de 7 maquettes interactives sur Figma et intégration responsive. Développement et maintien de 10 scripts de web scraping pour l'analyse concurrentielle sur 3 marchés clés."
    }
  ];

  const education = [
    {
      degree: "BUT Métiers du Multimédia et de l'Internet (MMI)",
      school: "IUT de Cergy-Pontoise",
      period: "09/2023 - 06/2026",
      location: "Cergy-Pontoise, France"
    },
    {
      degree: "Baccalauréat STMG - Spécialité Gestion et Systèmes d'Information",
      school: "Lycée",
      period: "09/2021 - 06/2023",
      location: "France"
    }
  ];

  const strengths = [
    {
      title: "Automatisation & IA",
      description: "Conception et déploiement de workflows automatisés via IA, développement de scripts de web scraping pour l'analyse concurrentielle et optimisation des processus métiers."
    },
    {
      title: "Architecture Full-Stack",
      description: "Maîtrise du développement frontend (React, TypeScript) et backend (Node.js, PHP, MySQL) avec une expertise en APIs REST, JWT et architecture d'applications ERP."
    },
    {
      title: "Rigueur Logicielle & Scalabilité",
      description: "Souci permanent de la qualité du code, de l'architecture logicielle et de la scalabilité des solutions. Objectif d'approfondir ces principes en Master MIAGE."
    },
    {
      title: "Vision Produit & Autonomie",
      description: "Pilotage autonome de projets complets, de la conception UI/UX sur Figma au déploiement, avec une approche orientée résultats et méthodologie Agile."
    }
  ];

  return (
    <div className="min-h-screen text-foreground pt-16">
      <GooeyNav
        items={navItems}
        activeIndex={navIndexMap[location] ?? 0}
        particleCount={15}
        particleDistances={[90, 10]}
        particleR={100}
        animationTime={600}
        timeVariance={300}
        colors={[1, 2, 3, 1, 2, 3, 1, 4]}
      />

      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white" data-aos="fade-up"><DiaTextReveal text="À propos de moi" textColor="white" /></h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto mt-4" data-aos="fade-up" data-aos-delay="100">
          Développeur Web Full-Stack passioné par l'automatisation et l'intelligence artificielle
        </p>
        <div className="flex gap-4 justify-center mt-8" data-aos="fade-up" data-aos-delay="200">
          <CoolMode>
            <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Mail size={18} /> Me contacter
            </Link>
          </CoolMode>
          <CoolMode>
            <a href="https://www.linkedin.com/in/falou-badiane-b555422a9/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-primary-foreground/50 text-primary-foreground rounded-lg hover:bg-primary-foreground/10 transition-colors">
              <Linkedin size={18} /> LinkedIn
            </a>
          </CoolMode>
        </div>
      </section>

      {/* Résumé */}
      <section className="py-20 md:py-32">
        <div className="container max-w-3xl space-y-8">
          <div className="space-y-4" data-aos="fade-up" data-aos-duration="800">
            <h2 className="text-4xl font-bold"><DiaTextReveal text="Qui suis-je ?" /></h2>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Je suis Falou Badiane, étudiant en BUT MMI (parcours développement web) et candidat à un Master Informatique, idéalement MIAGE. Je suis à l'aise sur plusieurs facettes du développement web, du traitement de données et de l'automatisation.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed">
              J'ai notamment travaillé sur du scraping et de l'automatisation IA — des sujets que je souhaite approfondir, surtout côté architecture et rigueur logicielle. Mon objectif est de concevoir des solutions robustes, scalables et intelligentes.
            </p>
          </div>

          {/* Informations de contact */}
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#0a0a0f"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
          >
            <div className="p-6 sm:p-8" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-bold mb-6">Informations de contact</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-zinc-300">Email</p>
                    <a href="mailto:badiane.falou95@gmail.com" className="text-primary hover:underline font-semibold">
                      badiane.falou95@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Linkedin className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-zinc-300">LinkedIn</p>
                    <a href="https://www.linkedin.com/in/falou-badiane-b555422a9/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                      Falou Badiane
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="text-primary" size={24} />
                  <div>
                    <p className="text-sm text-zinc-300">GitHub</p>
                    <a href="https://github.com/badiane95" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                      github.com/badiane95
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* Points Forts */}
      <section className="py-20 md:py-32 bg-transparent">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-4xl font-bold"><DiaTextReveal text="Mes Points Forts" /></h2>
            <p className="text-lg text-zinc-300">
              Une combinaison unique de compétences techniques et de vision stratégique pour transformer vos idées en réalité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {strengths.map((strength, idx) => (
              <BorderGlow
                key={idx}
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0a0a0f"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
                <div className="p-6 sm:p-8" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <h3 className="text-xl font-bold mb-3 text-primary">{strength.title}</h3>
                  <p className="text-zinc-300">{strength.description}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="py-20 md:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-4xl font-bold"><DiaTextReveal text="Compétences Techniques" /></h2>
            <p className="text-lg text-zinc-300">
              Une palette complète de technologies et de frameworks pour créer des solutions robustes et innovantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillGroup, idx) => (
              <BorderGlow
                key={idx}
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0a0a0f"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
                <div className="p-6 sm:p-8" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <h3 className="text-xl font-bold mb-6 text-primary">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {skillGroup.items.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* Expérience */}
      <section className="py-20 md:py-32 bg-transparent">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-right">
            <h2 className="text-4xl font-bold"><DiaTextReveal text="Expérience" /></h2>
            <p className="text-lg text-zinc-300">
              Mon parcours professionnel et académique qui m'a permis de développer une expertise diversifiée.
            </p>
          </div>

          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <BorderGlow
                key={idx}
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0a0a0f"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
                <div className="p-6 sm:p-8" data-aos="fade-left" data-aos-delay={idx * 150}>
                  <div className="space-y-2 mb-4">
                    <h3 className="text-2xl font-bold">{exp.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-zinc-300">
                      <span className="font-semibold text-primary">{exp.company}</span>
                      <span className="text-sm">{exp.period}</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{exp.description}</p>
                </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* Éducation */}
      <section className="py-20 md:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-right">
           
<h2 className="text-4xl font-bold"><DiaTextReveal text="Éducation" /></h2>
            <p className="text-lg text-zinc-300">
              Une formation solide en multimédia et informatique, complétée par des projets pratiques variés.
            </p>
          </div>

          <div className="space-y-6">
            {education.map((edu, idx) => (
              <BorderGlow
                key={idx}
                edgeSensitivity={30}
                glowColor="40 80 80"
                backgroundColor="#0a0a0f"
                borderRadius={28}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                colors={['#c084fc', '#f472b6', '#38bdf8']}
              >
                  <div className="p-6 sm:p-8" data-aos="fade-left" data-aos-delay={idx * 150}>
                    <div className="space-y-2 mb-4">
                      <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        <span className="font-semibold text-primary">{edu.school}</span>
                        <span className="text-sm text-zinc-300">{edu.period}</span>
                      </div>
                    </div>
                    <p className="text-primary/80">{edu.location}</p>
                  </div>
              </BorderGlow>
            ))}
          </div>
        </div>
      </section>

      {/* Langues */}
      <section className="py-20 md:py-32 bg-transparent">
        <div className="container space-y-8">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-4xl font-bold"><DiaTextReveal text="Langues" /></h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#0a0a0f"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
            >
              <div className="p-6 sm:p-8" data-aos="zoom-in" data-aos-delay="100">
                <h3 className="text-xl font-bold mb-2 text-primary">Français</h3>
                <p className="text-zinc-300">Maternelle</p>
              </div>
            </BorderGlow>
            <BorderGlow
              edgeSensitivity={30}
              glowColor="40 80 80"
              backgroundColor="#0a0a0f"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1}
              coneSpread={25}
              colors={['#c084fc', '#f472b6', '#38bdf8']}
            >
              <div className="p-6 sm:p-8" data-aos="zoom-in" data-aos-delay="200">
                <h3 className="text-xl font-bold mb-2 text-primary">Anglais</h3>
                <p className="text-zinc-300">Niveau B1</p>
              </div>
            </BorderGlow>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4" data-aos="zoom-in">
            <h2 className="text-4xl md:text-5xl font-bold"><DiaTextReveal text="Parlons de votre projet" textColor="white" /></h2>
            <p className="text-lg text-white/80">
              Vous cherchez un développeur passionné pour votre équipe ? Contactez-moi pour discuter de vos besoins.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CoolMode>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={() => setLocation('/contact')}
              >
                <Mail size={18} /> Me contacter
              </Button>
            </CoolMode>
            <CoolMode>
              <Button 
                variant="outline" 
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Falou-Badiane-CV.pdf';
                  link.download = 'Falou-Badiane-CV.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                Télécharger mon CV
              </Button>
            </CoolMode>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
