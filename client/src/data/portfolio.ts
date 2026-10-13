// Contenu du portfolio : une seule source de vérité pour toutes les pages.
// Les compétences référencent les projets par leur `stack`, ce qui permet
// à l'explorateur de compétences de relier une techno aux projets concernés.

export const profile = {
  name: "Falou Badiane",
  role: "Développeur web & automatisation",
  location: "Cergy-Pontoise, France",
  email: "badiane.falou95@gmail.com",
  cv: "/CV-Falou-Badiane.pdf",
  github: "https://github.com/Badiane95",
  linkedin: "https://linkedin.com/in/falou-badiane",
  pitch:
    "Étudiant en BUT MMI et développeur full-stack. Je conçois des interfaces soignées et j'automatise les processus métiers par la donnée : workflows IA, web scraping, back-offices.",
};

export type ProjectVideo = { id: string; title: string };

export type Project = {
  slug: string;
  title: string;
  year: string;
  context: string;
  status?: string;
  summary: string;
  details: string;
  stack: string[];
  image: string;
  live?: string;
  code?: string;
  videos?: ProjectVideo[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ai-web-scraper",
    title: "AI Web Scraper & Data Analyzer",
    year: "2026",
    context: "Projet personnel",
    status: "En cours",
    summary:
      "Plateforme d'extraction de données web : tâches de scraping, test des sélecteurs en temps réel, planification et tableau de bord.",
    details:
      "Les utilisateurs créent des tâches de scraping avec sélecteurs CSS/XPath, les testent en direct, planifient leur exécution et consultent les résultats dans un tableau de bord. Le moteur gère les sites rendus en JavaScript, conserve un historique d'exécution et expose une API tRPC typée de bout en bout. Authentification, rôles et tests Vitest.",
    stack: ["React", "TypeScript", "Node.js", "tRPC", "Puppeteer", "Drizzle ORM", "Tailwind CSS", "Vitest", "Web Scraping"],
    image:
      "https://files.manuscdn.com/user_upload_by_module/session_file/310519663420683623/mifdGIkLVxoACgHe.jpg",
    code: "https://github.com/Badiane95/ai-web-scraper-falou",
    featured: true,
  },
  {
    slug: "sae-501",
    title: "SAÉ 501 — Site institutionnel MMI",
    year: "2023",
    context: "IUT de Cergy-Pontoise",
    summary:
      "Refonte du site du BUT MMI : templates Nunjucks, front Vite, serveur Node.js/Express et contenu dynamique sous MongoDB.",
    details:
      "Architecture Nunjucks pour les templates, Vite pour le front, Node.js et Express côté serveur, MongoDB pour un contenu flexible. Accent mis sur le back-end et le front-end avancés, les interactions riches et la qualité web : gestion des 404, accessibilité, validation des formulaires côté client et design responsive en Tailwind CSS.",
    stack: ["Node.js", "Express.js", "MongoDB", "Nunjucks", "Vite", "Tailwind CSS", "JavaScript"],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/institutional-website-9DwxxMR5NQEZsez2UQYHor.webp",
    code: "https://github.com/lucasl0/SAE501",
    featured: true,
  },
  {
    slug: "jeu-unity",
    title: "Jeu vidéo Unity",
    year: "2025",
    context: "IUT de Cergy-Pontoise",
    summary:
      "Jeu complet en C# : logique de jeu, mouvements du personnage, collisions et machine à états de jeu.",
    details:
      "Développement de bout en bout, de la conception à l'implémentation. Gestion des états de jeu (menu, partie, pause, fin) pour des transitions fluides, mouvements du personnage réglés pour être réactifs, collisions optimisées et scripts profilés pour garder de bonnes performances.",
    stack: ["Unity", "C#", "Game Design", "Physics Engine"],
    image: "/assets/projects/unity-game.png",
    live: "https://badiane95.github.io/Game/",
    code: "https://github.com/Badiane95/Game",
    featured: true,
  },
  {
    slug: "data-visualization",
    title: "Data visualization & géolocalisation",
    year: "2025",
    context: "IUT de Cergy-Pontoise",
    summary:
      "Application cartographique pour explorer les données du cinéma : filtres dynamiques, clustering et visualisations interactives.",
    details:
      "Intégration d'API de cartographie pour localiser les salles et explorer les données cinématographiques. Filtrage dynamique, regroupement des points (clustering) et visualisations interactives pour rendre un jeu de données volumineux lisible.",
    stack: ["JavaScript", "Google Maps API", "D3.js", "Data Visualization"],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/Carte_b42b0aad.PNG",
    live: "https://baptistectldwbr.github.io/SAE303/",
    code: "https://github.com/BaptisteCtldWbr/SAE303",
    featured: true,
  },
  {
    slug: "back-office",
    title: "Back-office de gestion de contenu",
    year: "2024",
    context: "IUT de Cergy-Pontoise",
    summary:
      "Back-office sur mesure pour gérer les flux d'informations de l'IUT, avec contrôle d'accès par rôles.",
    details:
      "Interface de gestion des utilisateurs, des contenus et des flux d'informations. Architecture sécurisée avec contrôle d'accès basé sur les rôles et base de données SQL dimensionnée pour une centaine d'utilisateurs par mois.",
    stack: ["PHP", "MySQL", "JavaScript", "Bootstrap", "HTML/CSS"],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/site_cb4eaf72.jpg",
    code: "https://github.com/BaptisteCtldWbr/SAE203",
  },
  {
    slug: "webdocumentaire",
    title: "Webdocumentaire interactif",
    year: "2024",
    context: "IUT de Cergy-Pontoise",
    summary:
      "Court-métrage à navigation non linéaire : structure interactive sous Klynt, post-production sous DaVinci Resolve.",
    details:
      "Une expérience qui mêle vidéo et interactivité web : Klynt pour la structure et la navigation, DaVinci Resolve pour le montage et l'étalonnage.",
    stack: ["Klynt", "DaVinci Resolve", "HTML/CSS", "JavaScript"],
    image:
      "https://d2xsxph8kpxj0f.cloudfront.net/310519663323740600/eyEgUk4eTR46b2byXPoV73/webdoc_d24d8df9.png",
    live: "https://badiane95.github.io/Webdocummentaire/",
    code: "https://github.com/Badiane95/Webdocummentaire",
  },
  {
    slug: "pastilles-festival",
    title: "Pastilles vidéo — Les talents de l'IUT",
    year: "2024",
    context: "IUT de Cergy-Pontoise, site de Sarcelles",
    summary:
      "Série de pastilles promotionnelles pour le festival, avant et après l'événement.",
    details:
      "Phase pré-festival (« Tout le monde a un talent », « Prise de risque ») et post-festival (« Bon moment »). Tournage à la Blackmagic Cinema Camera, montage et post-production sous DaVinci Resolve, dans le respect de l'identité visuelle de l'événement.",
    stack: ["DaVinci Resolve", "Tournage vidéo"],
    image: "/assets/projects/festival-talents-pastilles.webp",
    live: "https://www.behance.net/gallery/200219493/Pastilles-de-communication",
    videos: [
      { id: "TauE60Y4VX8", title: "Pastille 1" },
      { id: "I5p-20UYyGU", title: "Pastille 2" },
      { id: "ZuY8DOnWmGA", title: "Pastille 3" },
    ],
  },
];

export type SkillGroup = { id: string; title: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "front",
    title: "Front-end",
    skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Tailwind CSS", "Bootstrap", "Vite", "Nunjucks"],
  },
  {
    id: "back",
    title: "Back-end & données",
    skills: ["Node.js", "Express.js", "tRPC", "PHP", "MySQL", "MongoDB", "Drizzle ORM", "Vitest"],
  },
  {
    id: "automation",
    title: "Automatisation & data",
    skills: ["Python", "Web Scraping", "Puppeteer", "Workflows IA", "Data Visualization", "D3.js", "Google Maps API"],
  },
  {
    id: "game",
    title: "Jeu vidéo",
    skills: ["Unity", "C#", "Game Design", "Physics Engine"],
  },
  {
    id: "design",
    title: "Design & vidéo",
    skills: ["Figma", "UI/UX Design", "Responsive Design", "Adobe Suite", "DaVinci Resolve", "Klynt", "Tournage vidéo"],
  },
  {
    id: "tools",
    title: "Outils & méthodes",
    skills: ["Git", "GitHub", "CI/CD", "Agile / Scrum", "REST APIs"],
  },
];

export function projectsUsing(skill: string): Project[] {
  return projects.filter(p => p.stack.includes(skill));
}

// Compétences mises en œuvre en entreprise (voir `experience`).
export const skillsUsedAtWork = ["Workflows IA", "Web Scraping", "Figma", "MySQL", "Responsive Design", "UI/UX Design"];

export const experience = [
  {
    period: "09/2025 — aujourd'hui",
    title: "Développeur web & automatisation",
    place: "Unitee — Station Numixs",
    points: [
      "Conception et déploiement de 5 workflows automatisés par IA, réduisant de 20 % le temps opérationnel.",
      "Architecture complète d'un site full-stack avec base SQL, pour environ 100 utilisateurs par mois.",
      "7 maquettes interactives sur Figma et intégration responsive.",
      "Développement et maintenance de 10 scripts de web scraping pour l'analyse concurrentielle sur 3 marchés.",
    ],
  },
];

export const education = [
  {
    period: "09/2023 — 06/2026",
    title: "BUT Métiers du Multimédia et de l'Internet (MMI)",
    place: "IUT de Cergy-Pontoise",
  },
  {
    period: "09/2021 — 06/2023",
    title: "Baccalauréat STMG — Systèmes d'Information de Gestion",
    place: "Lycée, France",
  },
];

export const metrics = [
  { value: 5, suffix: "", label: "workflows IA déployés en entreprise" },
  { value: 20, suffix: " %", label: "de temps opérationnel gagné" },
  { value: 10, suffix: "", label: "scripts de scraping maintenus" },
  { value: projects.length, suffix: "", label: "projets présentés ici" },
];
