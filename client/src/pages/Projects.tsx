import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const projects = [
  {
    id: 1,
    title: "Festival Les Talents de l'IUT",
    description: "Réalisation complète de vidéos promotionnelles pour le festival annuel de l'IUT de Cergy-Pontoise. Ce projet a impliqué la production vidéo professionnelle, le montage avancé et la promotion digitale sur les réseaux sociaux.",
    longDescription: "J'ai pris en charge l'ensemble du processus de création vidéo, de la pré-production à la post-production. Cela incluait la planification du tournage, la direction de la production, le montage vidéo sophisticé et la création de contenu promotionnel pour maximiser la visibilité de l'événement.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/festival-talents-jNUrAHmaijyw5gcdJzc3yS.webp",
    tags: ["Vidéo", "Production", "Promotion", "Montage"],
    technologies: ["DaVinci Resolve", "Adobe Premiere", "Social Media Marketing"],
    date: "2024",
    link: "#",
    codeLink: "#"
  },
  {
    id: 2,
    title: "Site Web Institutionnel",
    description: "Développement d'un site web moderne pour présenter la formation MMI de l'IUT. Le projet inclut une intégration complète de bases de données et un système de gestion de contenu dynamique.",
    longDescription: "Ce site institutionnel a été conçu pour offrir une expérience utilisateur optimale tout en permettant une gestion facile du contenu. J'ai implémenté une architecture backend robuste avec PHP et MySQL, assurant la sécurité et la performance du site.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/institutional-website-9DwxxMR5NQEZsez2UQYHor.webp",
    tags: ["Web", "Backend", "Base de données"],
    technologies: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap"],
    date: "2023",
    link: "#",
    codeLink: "https://github.com/Badiane95/sae501"
  },
  {
    id: 3,
    title: "Webdocumentaire Interactif",
    description: "Création d'une expérience immersive combinant les technologies Klynt et DaVinci Resolve. Le projet présente un court-métrage avec une navigation interactive innovante.",
    longDescription: "Ce webdocumentaire représente une fusion créative entre la vidéo et l'interactivité web. Utilisant Klynt pour la structure interactive et DaVinci Resolve pour la post-production vidéo, j'ai créé une expérience unique qui engage les spectateurs de manière nouvelle.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/webdocumentary-EUAMAyCL9M4oa49jPWPcHd.webp",
    tags: ["Interactif", "Vidéo", "Design", "Web"],
    technologies: ["Klynt", "DaVinci Resolve", "HTML/CSS", "JavaScript"],
    date: "2024",
    link: "https://badiane95.github.io/Webdocummentaire/",
    codeLink: "https://github.com/Badiane95/Webdocummentaire.git"
  },
  {
    id: 4,
    title: "Création d'un Jeu Vidéo",
    description: "Développement complet d'un jeu vidéo avec Unity et C#. Le projet inclut la programmation de la logique de jeu, des mécaniques de mouvement avancées et des systèmes de collision optimisés.",
    longDescription: "Ce projet de jeu vidéo démontre ma maîtrise de l'architecture de jeu et de l'optimisation des performances. J'ai implémenté un système complet de gestion des états de jeu (Game States), des mécaniques de mouvement fluides et des systèmes de collision précis. Le code a été optimisé pour assurer une performance optimale sur différentes plateformes.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/video-game-XJ2ZT6LLYAGKzDKrnhMMqn.webp",
    tags: ["Jeu Vidéo", "Programmation", "Architecture", "Performance"],
    technologies: ["Unity", "C#", "Game Design", "Physics Engine"],
    date: "2025",
    link: "#",
    codeLink: "https://github.com/tjrardaa/SAE402.git"
  },
  {
    id: 5,
    title: "Data Visualization & Géolocalisation",
    description: "Développement d'une application interactive de géolocalisation utilisant des APIs de cartographie pour l'exploration de données cinématographiques. Un projet qui combine data visualization et géographie.",
    longDescription: "Cette application interactive démontre ma capacité à intégrer des APIs de cartographie avancées pour créer des visualisations de données engageantes. J'ai implémenté des fonctionnalités de filtrage dynamique, de clustering de données et de visualisation interactive pour permettre une exploration intuitive des données cinématographiques à travers le monde.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/data-visualization-SevNmY4RbiPZCzNvNvGmVa.webp",
    tags: ["Data Visualization", "Géolocalisation", "API", "Données"],
    technologies: ["JavaScript", "Google Maps API", "D3.js", "React", "Node.js"],
    date: "2025",
    link: "https://baptistectldwbr.github.io/SAE303/",
    codeLink: "https://github.com/BaptisteCtldWbr/SAE303.git"
  },
  {
    id: 6,
    title: "Back-Office de Gestion de Contenu",
    description: "Réalisation d'un Back-Office sur mesure pour la gestion dynamique des flux d'informations universitaires. Un système complet de gestion de contenu pour l'IUT.",
    longDescription: "Ce Back-Office a été développé pour répondre aux besoins spécifiques de gestion de contenu universitaire. Le système offre une interface intuitive pour la gestion des utilisateurs, des contenus et des flux d'informations. J'ai implémenté une architecture sécurisée avec contrôle d'accès basé sur les rôles et une base de données SQL optimisée pour supporter 100+ utilisateurs mensuels.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/back-office-HQzgEAvE8J4s8vEnhVqmY4.webp",
    tags: ["Back-Office", "Gestion de Contenu", "Base de Données", "Sécurité"],
    technologies: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap"],
    date: "2024",
    link: "#",
    codeLink: "https://github.com/BaptisteCtldWbr/SAE203.git"
  }
];

export default function Projects() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out-quart',
      once: false,
      offset: 100,
    });
  }, []);

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="text-2xl font-bold text-primary">Falou Badiane</div>
          <div className="flex items-center gap-4">
            <ul className="hidden md:flex gap-8">
              <li><a href="/#competences" className="hover:text-primary transition-colors">Compétences</a></li>
              <li><a href="/#projets" className="hover:text-primary transition-colors">Projets</a></li>
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

      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <div className="container space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold">Mes Projets</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Découvrez en détail les 6 projets qui démontrent mes compétences en développement web, jeux vidéo, data visualization et automatisation.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-32">
        <div className="container space-y-16">
          {projects.map((project, idx) => (
            <div key={project.id} className="space-y-8" data-aos="fade-up">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image - Alternance gauche/droite */}
                <div className={`relative ${idx % 2 === 1 ? 'md:order-2' : ''}`} data-aos={idx % 2 === 0 ? 'fade-right' : 'fade-left'} data-aos-delay="100">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"></div>
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-96 object-cover rounded-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Contenu */}
                <div className={`space-y-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`} data-aos={idx % 2 === 1 ? 'fade-right' : 'fade-left'} data-aos-delay="150">
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-primary uppercase tracking-wide">
                      Projet {project.id} • {project.date}
                    </div>
                    <h2 className="text-4xl font-bold">{project.title}</h2>
                  </div>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {project.longDescription}
                  </p>

                  {/* Technologies */}
                  <div className="space-y-3" data-aos="fade-up" data-aos-delay="200">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Technologies utilisées</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full transition-all duration-300 hover:bg-primary/20 hover:scale-110" data-aos="zoom-in" data-aos-delay={String(250 + i * 50)}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2" data-aos="fade-up" data-aos-delay="250">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full border border-accent/30 transition-all duration-300 hover:bg-accent/30 hover:scale-110" data-aos="zoom-in" data-aos-delay={String(300 + i * 50)}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-4 pt-4" data-aos="fade-up" data-aos-delay="300">
                    {project.link !== "#" && (
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        onClick={() => window.open(project.link, '_blank')}
                      >
                        <ExternalLink size={18} /> Voir le projet
                      </Button>
                    )}
                    {project.codeLink !== "#" && (
                      <Button 
                        variant="outline" 
                        className="border-primary text-primary hover:bg-primary/5 gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                        onClick={() => window.open(project.codeLink, '_blank')}
                      >
                        <Github size={18} /> Code source
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {idx < projects.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Intéressé par mon travail ?</h2>
            <p className="text-lg text-white/80">
              N'hésitez pas à me contacter pour discuter de vos projets ou d'une collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-white/90 gap-2"
              onClick={() => setLocation('/#contact')}
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
