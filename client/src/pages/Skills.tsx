import { CoolMode } from "@/components/ui/cool-mode";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { Button } from "@/components/ui/button";
import { Code, Zap, Globe, Palette, Brain, Database } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import GooeyNav from "@/components/GooeyNav";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "@/components/Footer";
import BorderGlow from "@/components/BorderGlow";

const skillCategories = [
  {
    id: "web",
    title: "Développement Web",
    shortTitle: "Web",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    description: "Création d'applications web modernes et performantes",
    skills: [
      { name: "React (JSX)", level: 85, description: "Framework frontend moderne" },
      { name: "Node.js", level: 85, description: "Runtime JavaScript côté serveur" },
      { name: "HTML/CSS", level: 95, description: "Fondamentaux du web" },
      { name: "PHP", level: 75, description: "Langage backend" },
      { name: "JavaScript", level: 85, description: "Langage de programmation principal" },
      { name: "TypeScript", level: 80, description: "Typage statique pour une meilleure qualité de code" },
      { name: "MySQL / SQL", level: 85, description: "Gestion de bases de données relationnelles" },
      { name: "Kotlin", level: 60, description: "Langage de programmation moderne" }
    ]
  },
  {
    id: "data",
    title: "Données & Automatisation",
    shortTitle: "Data",
    icon: Brain,
    color: "from-orange-500 to-red-500",
    description: "Transformation de données et automatisation IA",
    skills: [
      { name: "Python", level: 85, description: "Langage polyvalent pour l'IA et l'automatisation" },
      { name: "Web Scraping", level: 85, description: "Extraction de données depuis le web" },
      { name: "Automatisation IA", level: 80, description: "Automatisation de processus par intelligence artificielle" },
      { name: "API REST & JWT", level: 80, description: "APIs sécurisées avec JSON Web Tokens" },
      { name: "Git", level: 85, description: "Contrôle de version" }
    ]
  },
  {
    id: "languages",
    title: "Langages & Frameworks",
    shortTitle: "Langages",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    description: "Langages de programmation maîtrisés",
    skills: [
      { name: "React (JSX)", level: 85, description: "Framework frontend avec écosystème riche" },
      { name: "Node.js", level: 85, description: "Développement backend JavaScript" },
      { name: "Python", level: 85, description: "Langage polyvalent IA/automatisation" },
      { name: "C#", level: 75, description: "Programmation orientée objet" },
      { name: "PHP", level: 75, description: "Développement web backend" },
      { name: "Kotlin", level: 60, description: "Langage moderne pour applications" },
      { name: "JavaScript", level: 85, description: "Langage de script universel" }
    ]
  },
  {
    id: "tools",
    title: "Outils & Architecture",
    shortTitle: "Outils",
    icon: Database,
    color: "from-indigo-500 to-blue-500",
    description: "Outils de développement et bonnes pratiques",
    skills: [
      { name: "Git", level: 85, description: "Contrôle de version" },
      { name: "Figma", level: 80, description: "Design UI/UX collaboratif" },
      { name: "API REST & JWT", level: 80, description: "Architecture d'APIs sécurisées" },
      { name: "MySQL / SQL", level: 85, description: "Bases de données relationnelles" },
      { name: "Automatisation IA", level: 80, description: "Workflows et optimisation par IA" }
    ]
  }
];

export default function Skills() {
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

  const [selectedCategory, setSelectedCategory] = useState("web");

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({
      duration: 800,
      once: false,
      offset: 100
    });
  }, []);

  const currentCategory = skillCategories.find(cat => cat.id === selectedCategory);

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
        <h1 className="text-5xl md:text-6xl font-bold text-white" data-aos="fade-up"><DiaTextReveal text="Mes Compétences" textColor="white" /></h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto mt-4" data-aos="fade-up" data-aos-delay="100">
          Une palette complète de technologies pour créer des solutions innovantes et performantes.
        </p>
      </section>

      {/* Skills Content */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="container space-y-12">
          {/* Category Tabs */}
          <div className="space-y-8" data-aos="fade-up">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {skillCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    data-aos="zoom-in"
                    data-aos-delay={idx * 80}
                    className={`p-4 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-secondary/50 text-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-center">{category.shortTitle}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Details */}
          {currentCategory && (
            <div className="space-y-8">
              <div className="space-y-4" data-aos="fade-right">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${currentCategory.color} flex items-center justify-center`} data-aos="zoom-in">
                    <currentCategory.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold">{currentCategory.title}</h2>
                    <p className="text-lg text-zinc-300">{currentCategory.description}</p>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {currentCategory.skills.map((skill, idx) => (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 80} className="relative">
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
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{skill.name}</h3>
                        <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                      </div>
                      <p className="text-zinc-300 text-sm">{skill.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </BorderGlow>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-20 md:py-32 bg-transparent relative z-10">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl" data-aos="fade-up">
            <h2 className="text-4xl font-bold"><DiaTextReveal text="Résumé des compétences" /></h2>
            <p className="text-lg text-zinc-300">
              Une expertise diversifiée couvrant tous les aspects du développement web, des jeux vidéo et de l'automatisation IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div data-aos="fade-up" data-aos-delay="100" className="relative">
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
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">50+</h3>
                  <p className="text-zinc-300">Technologies et outils maîtrisés</p>
                </div>
              </BorderGlow>
            </div>
            <div data-aos="fade-up" data-aos-delay="200" className="relative">
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
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-white">6</h3>
                  <p className="text-zinc-300">Projets majeurs complétés</p>
                </div>
              </BorderGlow>
            </div>
            <div data-aos="fade-up" data-aos-delay="300" className="relative">
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
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl font-bold mb-4 text-primary">2+</h3>
                  <p className="text-zinc-300">Années d'expérience professionnelle</p>
                </div>
              </BorderGlow>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4" data-aos="zoom-in">
            <h2 className="text-4xl md:text-5xl font-bold"><DiaTextReveal text="Prêt à collaborer ?" textColor="white" /></h2>
            <p className="text-lg text-white/80">
              Utilisez mes compétences pour transformer votre projet en réalité.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
            <CoolMode>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setLocation('/contact')}
              >
                Me contacter
              </Button>
            </CoolMode>
            <CoolMode>
              <Button 
                variant="outline" 
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/CV_Badiane.pdf';
                  link.download = 'CV_Badiane.pdf';
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
