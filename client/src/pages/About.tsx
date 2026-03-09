import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Linkedin, Github, Globe } from "lucide-react";
import { useLocation } from "wouter";

export default function About() {
  const [, setLocation] = useLocation();

  const skills = [
    {
      category: "Développement Web",
      items: ["React", "TypeScript", "Node.js", "PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap", "Tailwind CSS"]
    },
    {
      category: "Jeux Vidéo & 3D",
      items: ["Unity", "C#", "Game Design", "Physics Engine", "Game States", "Architecture de Jeu"]
    },
    {
      category: "Data & Automatisation",
      items: ["Python", "Web Scraping", "IA/ML", "Data Visualization", "APIs", "Automation", "Google Maps API", "D3.js"]
    },
    {
      category: "Design & Multimedia",
      items: ["Figma", "Adobe Suite", "DaVinci Resolve", "Adobe Premiere", "Klynt", "UI/UX Design"]
    }
  ];

  const experience = [
    {
      title: "Développeur Web & Automation",
      company: "Unitee",
      period: "09/2025 - Présent",
      description: "Conception et déploiement de 5 workflows automatisés via IA, réduisant de 20% le temps opérationnel. Développement d'applications interactives et architecture de solutions full-stack."
    },
    {
      title: "Étudiant Développeur",
      company: "IUT Cergy-Pontoise",
      period: "09/2023 - 06/2026",
      description: "Formation en BUT Métiers du Multimédia et de l'Internet (MMI). Réalisation de projets variés en développement web, jeux vidéo, data visualization et automatisation."
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
      title: "Automatisation & Intelligence Artificielle",
      description: "Transformation efficace des données via web scraping et optimisation des processus par IA pour créer des solutions intelligentes et scalables."
    },
    {
      title: "Polyvalence Technique",
      description: "Compétences variées en gestion de bases de données, géolocalisation, création de back-offices, jeux vidéo et data visualization."
    },
    {
      title: "Gestion de Projet & Vision Produit",
      description: "Pilotage autonome du cycle de vie des projets, de la conception UI/UX sur Figma au déploiement d'architectures Full-Stack."
    },
    {
      title: "Développement Full-Stack",
      description: "Maîtrise complète du développement frontend et backend avec une expertise particulière en création d'interfaces modernes et performantes."
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
              <li><a href="/#contact" className="hover:text-primary transition-colors">Contact</a></li>
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
        <div className="container space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">À propos de moi</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Développeur Web Full-Stack passionné par l'automatisation et l'intelligence artificielle, spécialisé dans la transformation des données en solutions innovantes.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="mailto:badiane.falou95@gmail.com" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors">
              <Mail size={18} /> Me contacter
            </a>
            <a href="https://linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-white text-white rounded-lg hover:bg-white/10 transition-colors">
              <Linkedin size={18} /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Résumé */}
      <section className="py-20 md:py-32">
        <div className="container max-w-3xl space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Qui suis-je ?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Je suis Falou Badiane, étudiant en BUT MMI et développeur Full-Stack passionné par la création de solutions web innovantes. Ma spécialité réside dans l'optimisation des processus métiers par la donnée et l'automatisation via l'IA.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Expert en création d'interfaces modernes, je maîtrise l'automatisation via l'IA et le Web Scraping pour transformer les données brutes en leviers de croissance stratégiques. Mon approche combine expertise technique, vision produit et gestion de projet autonome.
            </p>
          </div>

          {/* Informations de contact */}
          <Card className="p-8 bg-secondary/30 border-l-4 border-l-primary">
            <h3 className="text-2xl font-bold mb-6">Informations de contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href="mailto:badiane.falou95@gmail.com" className="text-primary hover:underline font-semibold">
                    badiane.falou95@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">LinkedIn</p>
                  <a href="https://linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    Falou Badiane
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Github className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">GitHub</p>
                  <a href="https://github.com/badiane95" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
                    github.com/badiane95
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Points Forts */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Mes Points Forts</h2>
            <p className="text-lg text-muted-foreground">
              Une combinaison unique de compétences techniques et de vision stratégique pour transformer vos idées en réalité.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {strengths.map((strength, idx) => (
              <Card key={idx} className="p-8 border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-bold mb-3">{strength.title}</h3>
                <p className="text-muted-foreground">{strength.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compétences */}
      <section className="py-20 md:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Compétences Techniques</h2>
            <p className="text-lg text-muted-foreground">
              Une palette complète de technologies et de frameworks pour créer des solutions robustes et innovantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillGroup, idx) => (
              <Card key={idx} className="p-8 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-bold mb-6 text-primary">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-3">
                  {skillGroup.items.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expérience */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Expérience</h2>
            <p className="text-lg text-muted-foreground">
              Mon parcours professionnel et académique qui m'a permis de développer une expertise diversifiée.
            </p>
          </div>

          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <Card key={idx} className="p-8 border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
                <div className="space-y-2 mb-4">
                  <h3 className="text-2xl font-bold">{exp.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-muted-foreground">
                    <span className="font-semibold text-primary">{exp.company}</span>
                    <span className="text-sm">{exp.period}</span>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Éducation */}
      <section className="py-20 md:py-32">
        <div className="container space-y-12">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Éducation</h2>
            <p className="text-lg text-muted-foreground">
              Une formation solide en multimédia et informatique, complétée par des projets pratiques variés.
            </p>
          </div>

          <div className="space-y-6">
            {education.map((edu, idx) => (
              <Card key={idx} className="p-8 border-l-4 border-l-accent hover:shadow-lg transition-all duration-300">
                <div className="space-y-2 mb-4">
                  <h3 className="text-2xl font-bold">{edu.degree}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-muted-foreground">
                    <span className="font-semibold text-accent">{edu.school}</span>
                    <span className="text-sm">{edu.period}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{edu.location}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Langues */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container space-y-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-bold">Langues</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold mb-2">Français</h3>
              <p className="text-muted-foreground">Langue maternelle</p>
            </Card>
            <Card className="p-8 border-l-4 border-l-primary">
              <h3 className="text-xl font-bold mb-2">Anglais</h3>
              <p className="text-muted-foreground">Avancé</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Parlons de votre projet</h2>
            <p className="text-lg text-white/80">
              Vous cherchez un développeur passionné pour votre équipe ? Contactez-moi pour discuter de vos besoins.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-white/90 gap-2"
              onClick={() => setLocation('/#contact')}
            >
              <Mail size={18} /> Me contacter
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
