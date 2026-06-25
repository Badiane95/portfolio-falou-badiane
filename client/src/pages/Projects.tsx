import { Button } from "@/components/ui/button";
import { Github, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import PillNav from "@/components/PillNav";
import InfiniteMenu from "@/components/InfiniteMenu";
import { Footer } from "@/components/Footer";

const projects = [
  {
    id: 0,
    title: "AI-Powered Web Scraper & Data Analyzer (En cours)",
    description: "Plateforme complète de web scraping avec interface intuitive, moteur robuste utilisant Puppeteer, stockage MongoDB, visualisation de données et planification de tâches récurrentes. 🚀 Projet en développement actif.",
    longDescription: "Une plateforme moderne et puissante pour automatiser l'extraction de données web. Ce projet démontre une expertise complète en développement fullstack avec React, Node.js, tRPC et Drizzle ORM. Les utilisateurs peuvent créer des tâches de scraping avec sélecteurs CSS/XPath, tester les sélecteurs en temps réel, planifier l'exécution automatique et visualiser les résultats dans un dashboard intuitif. Le système gère les sites dynamiques (JavaScript-rendered), inclut un historique d'exécution détaillé et offre une API tRPC type-safe pour toutes les opérations. L'application est sécurisée avec authentification utilisateur et autorisation basée sur les rôles. Tests Vitest complets et design responsive avec Tailwind CSS.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663420683623/mifdGIkLVxoACgHe.jpg",
    tags: ["Fullstack", "Web Scraping", "Automation", "Data Analysis", "En cours"],
    technologies: ["React", "Node.js", "tRPC", "Puppeteer", "Drizzle ORM", "Tailwind CSS", "TypeScript", "Vitest"],
    date: "2026",
    link: "#",
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

const infiniteMenuItems = projects.map(p => ({
  image: p.image,
  link: p.link,
  title: p.title,
  description: p.description
}));

export default function Projects() {
  const [, setLocation] = useLocation();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const handleItemSelect = (item: { title: string; description: string; image: string; link: string } | null) => {
    if (!item) { setSelectedProject(null); return; }
    const project = projects.find(p => p.title === item.title);
    setSelectedProject(project || null);
  };

  return (
    <div className="min-h-screen text-foreground pt-16">
      <PillNav />

      {/* Header */}
      <section className="relative py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white" data-aos="fade-up">Mes Projets</h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto mt-4" data-aos="fade-up" data-aos-delay="100">
          Explorez mes réalisations en développement web, jeux vidéo, data et automatisation
        </p>
      </section>

      {/* Infinite Menu */}
      <section style={{ height: '400px', position: 'relative' }} className="mb-4 group">
        <p className="text-center text-zinc-500 text-sm mb-2">
          <span className="inline-flex items-center gap-1">🖱 Glissez pour tourner · Molette pour zoomer · Cliquez sur un disque pour voir les détails</span>
        </p>
        <InfiniteMenu items={infiniteMenuItems} scale={0.5} onItemSelect={handleItemSelect} />
      </section>

      {/* Détail du projet sélectionné */}
      {selectedProject && (
        <section className="py-8 md:py-12" data-aos="fade-up">
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative min-h-[250px] md:min-h-[350px] bg-zinc-950">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedProject.title}</h2>
                    <p className="text-zinc-300 text-sm md:text-base leading-relaxed">{selectedProject.longDescription || selectedProject.description}</p>
                    {selectedProject.technologies && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-xs rounded">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {selectedProject.link && selectedProject.link !== "#" && (
                      <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors">
                        <Globe size={16} /> Voir le projet
                      </a>
                    )}
                    {selectedProject.codeLink && selectedProject.codeLink !== "#" && (
                      <a href={selectedProject.codeLink} target="_blank" rel="noopener noreferrer" className="border border-zinc-600 text-zinc-200 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors">
                        <Github size={16} /> Code source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Intéressé par mon travail ?</h2>
            <p className="text-lg text-white/80">
              N'hésitez pas à me contacter pour discuter de vos projets ou d'une collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              onClick={() => setLocation('/#contact')}
            >
              Me contacter
            </Button>
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
