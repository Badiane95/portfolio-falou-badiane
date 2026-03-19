import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "@/components/Footer";

const projects = [
  {
    id: 0,
    title: "AI-Powered Web Scraper & Data Analyzer",
    description: "Plateforme complète de web scraping avec interface intuitive, moteur robuste utilisant Puppeteer, stockage MongoDB, visualisation de données et planification de tâches récurrentes.",
    longDescription: "Une plateforme moderne et puissante pour automatiser l'extraction de données web. Ce projet démontre une expertise complète en développement fullstack avec React, Node.js, tRPC et Drizzle ORM. Les utilisateurs peuvent créer des tâches de scraping avec sélecteurs CSS/XPath, tester les sélecteurs en temps réel, planifier l'exécution automatique et visualiser les résultats dans un dashboard intuitif. Le système gère les sites dynamiques (JavaScript-rendered), inclut un historique d'exécution détaillé et offre une API tRPC type-safe pour toutes les opérations. L'application est sécurisée avec authentification utilisateur et autorisation basée sur les rôles. Tests Vitest complets et design responsive avec Tailwind CSS.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663420683623/mifdGIkLVxoACgHe.jpg",
    tags: ["Fullstack", "Web Scraping", "Automation", "Data Analysis"],
    technologies: ["React", "Node.js", "tRPC", "Puppeteer", "Drizzle ORM", "Tailwind CSS", "TypeScript", "Vitest"],
    date: "2026",
    link: "https://aiwebscrap-994wzucz.manus.space",
    codeLink: "https://github.com/Badiane95/ai-web-scraper-falou"
  },
  {
    id: 1,
    title: "SAE 501 - Site Web Institutionnel",
    description: "Développement d'un site web institutionnel moderne pour le BUT MMI, intégrant des technologies front-end (Vite, Nunjucks) et back-end (Node.js, Express, MongoDB) pour une gestion de contenu dynamique et une expérience utilisateur optimale.",
    longDescription: "Ce projet, réalisé dans le cadre de la SAÉ 501, a consisté à moderniser le site dédié au BUT Métiers du Multimédia et de l'Internet (MMI). J'ai travaillé sur une architecture basée sur Nunjucks pour les templates, Vite pour le développement front-end rapide, et un serveur robuste avec Node.js et Express. La gestion des données a été effectuée via MongoDB (NoSQL), offrant une flexibilité accrue. Le projet a mis l'accent sur le développement back-end avancé (R5.DWeb-DI.06) et front-end avancé (R5.DWeb-DI.05), l'intégration d'interactions riches (AC34.03), et la maîtrise de la qualité web (AC35.02). J'ai également utilisé Tailwind CSS pour un design responsive et moderne, et implémenté des fonctionnalités telles que la gestion des erreurs 404, l'accessibilité web, et la validation client des formulaires. Ce projet démontre ma capacité à utiliser des outils modernes pour construire des applications web performantes et maintenables.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/institutional-website-9DwxxMR5NQEZsez2UQYHor.webp",
    tags: ["Web", "Backend", "NoSQL", "Fullstack"],
    technologies: ["Node.js", "Express.js", "MongoDB", "Nunjucks", "Vite", "Tailwind CSS", "JavaScript"],
    date: "2023",
    link: "#",
    codeLink: "https://github.com/lucasl0/SAE501.git"
  },
  {
    id: 2,
    title: "Jeu Vidéo Unity",
    description: "Développement complet d'un jeu vidéo avec Unity et C#. Le projet inclut la programmation de la logique de jeu, des mécaniques de mouvement avancées et des systèmes de collision optimisés.",
    longDescription: "Ce projet de jeu vidéo, développé avec Unity et C#, met en lumière mes compétences en conception et programmation de jeux. J'ai pris en charge l'intégralité du développement, de la conceptualisation à l'implémentation des mécaniques de jeu. Le jeu intègre un système de gestion des états de jeu (Game States) robuste, permettant une transition fluide entre les différents écrans (menu, jeu, pause, fin de partie). Les mécaniques de mouvement du personnage ont été affinées pour offrir une expérience de jeu intuitive et réactive, tandis que les systèmes de collision ont été optimisés pour une détection précise et performante. Une attention particulière a été portée à l'optimisation du code et des assets pour garantir une performance fluide sur diverses plateformes. Ce projet illustre ma capacité à transformer une idée en un produit interactif et fonctionnel, en gérant les défis techniques liés au développement de jeux vidéo.",
    image: "/assets/projects/unity-game.png",
    tags: ["Jeu Vidéo", "Programmation", "Architecture", "Performance"],
    technologies: ["Unity", "C#", "Game Design", "Physics Engine"],
    date: "2025",
    link: "https://badiane95.github.io/Game/",
    codeLink: "https://github.com/Badiane95/Game.git"
  },
  {
    id: 3,
    title: "Data Visualization & Géolocalisation",
    description: "Développement d'une application interactive de géolocalisation utilisant des APIs de cartographie pour l'exploration de données cinématographiques. Un projet qui combine data visualization et géographie.",
    longDescription: "Cette application interactive démontre ma capacité à intégrer des APIs de cartographie avancées pour créer des visualisations de données engageantes. J'ai implémenté des fonctionnalités de filtrage dynamique, de clustering de données et de visualisation interactive pour permettre une exploration intuitive des données cinématographiques à travers le monde.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/Carte_b42b0aad.PNG",
    tags: ["Data Visualization", "Géolocalisation", "API", "Données"],
    technologies: ["JavaScript", "Google Maps API", "D3.js", "React", "Node.js"],
    date: "2025",
    link: "https://baptistectldwbr.github.io/SAE303/",
    codeLink: "https://github.com/BaptisteCtldWbr/SAE303.git"
  },
  {
    id: 4,
    title: "Back-Office de Gestion de Contenu",
    description: "Réalisation d'un Back-Office sur mesure pour la gestion dynamique des flux d'informations universitaires. Un système complet de gestion de contenu pour l'IUT.",
    longDescription: "Ce Back-Office a été développé pour répondre aux besoins spécifiques de gestion de contenu universitaire. Le système offre une interface intuitive pour la gestion des utilisateurs, des contenus et des flux d'informations. J'ai implémenté une architecture sécurisée avec contrôle d'accès basé sur les rôles et une base de données SQL optimisée pour supporter 100+ utilisateurs mensuels.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/site_cb4eaf72.jpg",
    tags: ["Back-Office", "Gestion de Contenu", "Base de Données", "Sécurité"],
    technologies: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap"],
    date: "2024",
    link: "#",
    codeLink: "https://github.com/BaptisteCtldWbr/SAE203.git"
  },
  {
    id: 5,
    title: "Webdocumentaire Interactif",
    description: "Création d'une expérience immersive combinant les technologies Klynt et DaVinci Resolve. Le projet présente un court-métrage avec une navigation interactive innovante.",
    longDescription: "Ce webdocumentaire représente une fusion créative entre la vidéo et l'interactivité web. Utilisant Klynt pour la structure interactive et DaVinci Resolve pour la post-production vidéo, j'ai créé une expérience unique qui engage les spectateurs de manière nouvelle.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/webdoc_d24d8df9.png",
    tags: ["Interactif", "Vidéo", "Design", "Web"],
    technologies: ["Klynt", "DaVinci Resolve", "HTML/CSS", "JavaScript"],
    date: "2024",
    link: "https://badiane95.github.io/Webdocummentaire/",
    codeLink: "https://github.com/Badiane95/Webdocummentaire.git"
  },
  {
    id: 6,
    title: "Pastilles de communication - Festival",
    description: "Création de pastilles vidéo promotionnelles pour le festival 'Les talents de l'IUT' organisé par l'I.U.T de Cergy-Pontoise. Un projet axé sur la communication digitale et la production vidéo.",
    longDescription: "Dans le cadre de la promotion du festival 'Les talents de l'IUT' organisé par l'I.U.T de Cergy-Pontoise (site de Sarcelles), j'ai réalisé une série de pastilles vidéo de communication. Ce projet comprenait des phases de pré-festival avec des thématiques comme 'Tout le monde a un talent' et 'Prise de risque', ainsi qu'une phase post-festival intitulée 'Bon moment'. J'ai utilisé DaVinci Resolve pour le montage et la post-production, en travaillant avec une BlackMagic Cinema Camera pour garantir une qualité cinématographique. Ce travail démontre ma capacité à créer du contenu engageant pour les réseaux sociaux tout en respectant une identité visuelle forte liée à un événement culturel.",
    image: "/assets/projects/festival-talents-pastilles.webp",
    tags: ["Vidéo", "Communication", "Festival", "Montage"],
    technologies: ["DaVinci Resolve", "BlackMagic Cinema Camera", "Cinematography"],
    date: "2024",
    link: "https://www.behance.net/gallery/200219493/Pastilles-de-communication",
    codeLink: "#",
    videos: [
      { id: "TauE60Y4VX8", title: "Pastille 1" },
      { id: "I5p-20UYyGU", title: "Pastille 2" },
      { id: "ZuY8DOnWmGA", title: "Pastille 3" }
    ]
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
          <a href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">Falou Badiane</a>
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

              {/* Videos Section */}
              {project.videos && project.videos.length > 0 && (
                <div className="space-y-6" data-aos="fade-up">
                  <h3 className="text-2xl font-bold">Videos du projet</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    {project.videos.map((video, vidIdx) => (
                      <div key={vidIdx} className="relative w-full bg-black rounded-2xl overflow-hidden" data-aos="fade-up" data-aos-delay={String(100 + vidIdx * 100)}>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={`https://www.youtube.com/embed/${video.id}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
      <Footer />
    </div>
  );
}
