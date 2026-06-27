import { CoolMode } from "@/components/ui/cool-mode";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect } from "react";
import GooeyNav from "@/components/GooeyNav";
import ThreeDCarousel, { ThreeDCarouselItem } from "@/components/lightswind/3d-carousel";
import { Footer } from "@/components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const projects = [
  {
    id: 8,
    title: "ParkViz — Stationnement Intelligent",
    description: "Plateforme innovante de gestion de stationnement urbain utilisant l'intelligence artificielle et la réalité augmentée pour transformer l'expérience des conducteurs et des exploitants de parkings.",
    longDescription: "ParkViz est une plateforme innovante de gestion de stationnement urbain qui utilise l'intelligence artificielle et la réalité augmentée pour transformer l'expérience des conducteurs et des exploitants de parkings. L'application offre une visualisation en temps réel des places disponibles, un guidage AR vers le stationnement, et des analytics prédictifs basés sur l'IA pour optimiser la gestion du trafic et du stationnement en milieu urbain.",
    image: "/image.png",
    tags: ["IA", "Réalité Augmentée", "Smart City", "Fullstack"],
    technologies: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "TypeScript"],
    date: "2026",
    link: "https://vizp-ozizrf57q-badianefalou95-8616s-projects.vercel.app/",
    codeLink: "https://github.com/Badiane95/vizp"
  },
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
    codeLink: "#"
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
  },
  {
    id: 9,
    title: "OpenSport — Gestion d'Équipements Sportifs",
    description: "Plateforme intelligente de gestion et de réservation d'équipements sportifs municipaux. Réduisez le gaspillage énergétique, améliorez l'accès au sport et suivez votre impact environnemental.",
    longDescription: "OpenSport est une plateforme intelligente de gestion et de réservation d'équipements sportifs municipaux développée dans le cadre d'un projet universitaire à l'IUT de Cergy-Pontoise. Elle permet la réservation annuelle pour les établissements scolaires et ponctuelle pour les particuliers et entreprises, avec un suivi environnemental complet (consommation électrique, impact CO2, gestion de l'eau). La plateforme intègre un tableau de bord pour les gestionnaires municipaux avec des rapports détaillés et des alertes de surconsommation.",
    image: "/assets/projects/open.png",
    tags: ["Smart City", "Sport", "Écologie", "Fullstack", "Projet Universitaire"],
    technologies: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Express"],
    date: "2026",
    link: "https://opensport-axudfwtq.manus.space/",
    codeLink: "https://github.com/Badiane95/Opensport"
  }
];

const carouselItems: ThreeDCarouselItem[] = projects.map(p => ({
  id: p.id,
  title: p.title,
  brand: p.tags[0] || "",
  description: p.description,
  longDescription: p.longDescription,
  tags: p.tags,
  technologies: p.technologies,
  imageUrl: p.image,
  link: p.link,
  codeLink: p.codeLink,
  date: p.date
}));

export default function Projects() {
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
      offset: 100,
      once: false
    });
  }, []);

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

      {/* Header */}
      <section className="relative py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white" data-aos="fade-up"><DiaTextReveal text="Mes Projets" textColor="white" /></h1>
        <p className="text-lg text-white/60 max-w-xl mx-auto mt-4" data-aos="fade-up" data-aos-delay="100">
          Explorez mes réalisations en développement web, jeux vidéo, data et automatisation
        </p>
      </section>

      {/* Carrousel 3D */}
      <section className="py-8">
        <ThreeDCarousel items={carouselItems} autoRotate={true} rotateInterval={5000} cardHeight={620} />
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-white">
        <div className="container max-w-2xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold"><DiaTextReveal text="Intéressé par mon travail ?" textColor="white" /></h2>
            <p className="text-lg text-white/80">
              N'hésitez pas à me contacter pour discuter de vos projets ou d'une collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CoolMode>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
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
