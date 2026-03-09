import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Code, Zap, Globe, Palette, Brain, Database } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

const skillCategories = [
  {
    id: "web",
    title: "Développement Web",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    description: "Création d'applications web modernes et performantes",
    skills: [
      { name: "React", level: 95, description: "Framework frontend moderne avec Hooks et Context" },
      { name: "TypeScript", level: 90, description: "Typage statique pour une meilleure qualité de code" },
      { name: "Node.js", level: 85, description: "Runtime JavaScript côté serveur" },
      { name: "Express.js", level: 85, description: "Framework web léger et flexible" },
      { name: "PHP", level: 80, description: "Langage backend traditionnel" },
      { name: "MySQL", level: 85, description: "Gestion de bases de données relationnelles" },
      { name: "HTML/CSS", level: 95, description: "Fondamentaux du web" },
      { name: "JavaScript", level: 95, description: "Langage de programmation principal" },
      { name: "Bootstrap", level: 85, description: "Framework CSS populaire" },
      { name: "Tailwind CSS", level: 90, description: "Framework CSS utilitaire moderne" }
    ]
  },
  {
    id: "gamedev",
    title: "Développement Jeux Vidéo",
    icon: Zap,
    color: "from-purple-500 to-pink-500",
    description: "Création de jeux avec Unity et C#",
    skills: [
      { name: "Unity", level: 85, description: "Moteur de jeu 2D/3D professionnel" },
      { name: "C#", level: 85, description: "Langage principal pour Unity" },
      { name: "Game Design", level: 80, description: "Conception de mécaniques de jeu" },
      { name: "Physics Engine", level: 80, description: "Systèmes de physique et collisions" },
      { name: "Game States", level: 85, description: "Gestion des états de jeu" },
      { name: "Performance Optimization", level: 80, description: "Optimisation pour différentes plateformes" }
    ]
  },
  {
    id: "data",
    title: "Data & Automatisation",
    icon: Brain,
    color: "from-orange-500 to-red-500",
    description: "Transformation de données et automatisation IA",
    skills: [
      { name: "Python", level: 85, description: "Langage polyvalent pour l'IA et l'automatisation" },
      { name: "Web Scraping", level: 85, description: "Extraction de données depuis le web" },
      { name: "IA/ML", level: 80, description: "Machine Learning et Intelligence Artificielle" },
      { name: "Data Visualization", level: 85, description: "Visualisation de données complexes" },
      { name: "Google Maps API", level: 85, description: "Intégration de cartographie avancée" },
      { name: "D3.js", level: 80, description: "Visualisation de données interactive" },
      { name: "APIs", level: 90, description: "Intégration et création d'APIs" },
      { name: "Automation", level: 85, description: "Automatisation de processus métiers" }
    ]
  },
  {
    id: "design",
    title: "Design & Multimedia",
    icon: Palette,
    color: "from-green-500 to-teal-500",
    description: "Design créatif et production multimedia",
    skills: [
      { name: "Figma", level: 90, description: "Design UI/UX collaboratif" },
      { name: "Adobe Suite", level: 85, description: "Photoshop, Illustrator, XD" },
      { name: "DaVinci Resolve", level: 85, description: "Montage et post-production vidéo" },
      { name: "Adobe Premiere", level: 80, description: "Édition vidéo professionnelle" },
      { name: "Klynt", level: 80, description: "Création de webdocumentaires interactifs" },
      { name: "UI/UX Design", level: 90, description: "Conception d'interfaces utilisateur" },
      { name: "Responsive Design", level: 95, description: "Design adaptatif multi-appareils" }
    ]
  },
  {
    id: "tools",
    title: "Outils & Méthodologies",
    icon: Database,
    color: "from-indigo-500 to-blue-500",
    description: "Outils de développement et bonnes pratiques",
    skills: [
      { name: "Git", level: 90, description: "Contrôle de version" },
      { name: "GitHub", level: 90, description: "Plateforme de collaboration" },
      { name: "Docker", level: 75, description: "Conteneurisation d'applications" },
      { name: "CI/CD", level: 80, description: "Intégration et déploiement continu" },
      { name: "Agile", level: 85, description: "Méthodologie de développement" },
      { name: "Scrum", level: 85, description: "Framework Agile" },
      { name: "REST APIs", level: 90, description: "Architecture d'APIs RESTful" },
      { name: "tRPC", level: 85, description: "Framework RPC type-safe" }
    ]
  }
];

export default function Skills() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("web");

  const currentCategory = skillCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">Falou Badiane</div>
          <div className="flex items-center gap-4">
            <ul className="hidden md:flex gap-8">
              <li><a href="/skills" className="hover:text-primary transition-colors">Compétences</a></li>
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
          <h1 className="text-5xl md:text-6xl font-bold">Mes Compétences</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Une palette complète de technologies et de compétences pour créer des solutions innovantes et performantes.
          </p>
        </div>
      </section>

      {/* Skills Content */}
      <section className="py-20 md:py-32">
        <div className="container space-y-12">
          {/* Category Tabs */}
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {skillCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-secondary/50 text-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-center">{category.title.split(" ")[0]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Details */}
          {currentCategory && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${currentCategory.color} flex items-center justify-center`}>
                    <currentCategory.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold">{currentCategory.title}</h2>
                    <p className="text-lg text-muted-foreground">{currentCategory.description}</p>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {currentCategory.skills.map((skill, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{skill.name}</h3>
                        <span className="text-sm font-semibold text-primary">{skill.level}%</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{skill.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Résumé des compétences</h2>
            <p className="text-lg text-muted-foreground">
              Une expertise diversifiée couvrant tous les aspects du développement web, des jeux vidéo et de l'automatisation IA.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-l-4 border-l-primary">
              <h3 className="text-2xl font-bold mb-4">50+</h3>
              <p className="text-muted-foreground">Technologies et outils maîtrisés</p>
            </Card>
            <Card className="p-8 border-l-4 border-l-accent">
              <h3 className="text-2xl font-bold mb-4">7</h3>
              <p className="text-muted-foreground">Projets majeurs complétés</p>
            </Card>
            <Card className="p-8 border-l-4 border-l-primary">
              <h3 className="text-2xl font-bold mb-4">2+</h3>
              <p className="text-muted-foreground">Années d'expérience professionnelle</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Prêt à collaborer ?</h2>
            <p className="text-lg text-white/80">
              Utilisez mes compétences pour transformer votre projet en réalité.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => setLocation('/contact')}
            >
              Me contacter
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
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
