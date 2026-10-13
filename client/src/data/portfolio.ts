// Contenu du portfolio : une seule source de vérité pour toutes les pages.
// Les compétences référencent les projets par leur `stack`, ce qui permet
// à l'explorateur de compétences de relier une techno aux projets concernés.

export const profile = {
  name: "Falou Badiane",
  role: "Ingénieur IA & data",
  location: "Île-de-France",
  email: "badiane.falou95@gmail.com",
  cv: "/CV-Falou-Badiane.pdf",
  github: "https://github.com/Badiane95",
  linkedin: "https://www.linkedin.com/in/falou-badiane-b555422a9/",
  pitch:
    "Étudiant en Master Informatique et Ingénierie des Données, en alternance comme Forward Deployed Engineer – Ingénieur IA chez Randstad Digital. Je produis des indicateurs, j'automatise des reportings et je mets en production des cas d'usage IA.",
  interests:
    "Les agents IA appliqués au cycle de vie logiciel, la conformité de l'IA et le pilotage par la donnée.",
  current: {
    title: "Forward Deployed Engineer – Ingénieur IA",
    company: "Randstad Digital",
    since: "octobre 2026",
  },
};

export const services = [
  {
    title: "IA appliquée",
    text: "Cas d'usage IA mis en production : classification NLP, scoring, agents IA sur le cycle de vie logiciel, conformité AI Act.",
    stack: "IA générative · Agents IA · NLP · AI Act",
  },
  {
    title: "Data & automatisation",
    text: "Données fiabilisées, KPI et tableaux de bord, reportings automatisés et workflows sans tâches répétitives.",
    stack: "Python · SQL · n8n · Make · Pandas",
  },
  {
    title: "Full-stack",
    text: "Applications web et outils métier complets, de la base de données à l'interface, typés de bout en bout.",
    stack: "React · TypeScript · Node.js · MySQL",
  },
];

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
  image?: string;
  live?: string;
  code?: string;
  videos?: ProjectVideo[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "intelligence-territoriale",
    title: "Intelligence territoriale automatisée",
    year: "2025 – 2026",
    context: "Projet académique — IUT de Cergy-Pontoise",
    summary:
      "Pipeline IA complet : collecte via API, nettoyage, classification NLP et scoring d'opportunités, intégré à un ERP/CRM d'entreprise.",
    details:
      "Collecte de données via API, nettoyage et normalisation, classification NLP puis scoring des opportunités. Le résultat est exposé et intégré à l'ERP/CRM d'une entreprise pour alimenter directement les équipes.",
    stack: ["Python", "Pandas", "Classification NLP", "Scoring", "API REST"],
    image: "/assets/projects/intelligence-territoriale.svg",
    featured: true,
  },
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
    stack: ["React", "TypeScript", "Node.js", "tRPC", "Puppeteer", "Drizzle ORM", "Tailwind CSS", "Vitest", "Web Scraping", "Python"],
    image: "/assets/projects/ai-web-scraper.svg",
    code: "https://github.com/Badiane95/ai-web-scraper-falou",
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
    image: "/assets/projects/sae-501.svg",
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
    image: "/assets/projects/data-visualization.svg",
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
    stack: ["PHP", "SQL / MySQL", "JavaScript", "Bootstrap", "HTML/CSS"],
    image: "/assets/projects/back-office.svg",
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
    image: "/assets/projects/webdocumentaire.svg",
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
    id: "ia",
    title: "IA & automatisation",
    skills: ["IA générative", "Agents IA", "Classification NLP", "Scoring", "Conformité IA (AI Act)", "n8n", "Make", "Web Scraping", "Puppeteer"],
  },
  {
    id: "data",
    title: "Data & analyse",
    skills: ["Python", "Pandas", "NumPy", "SQL / MySQL", "Scikit-Learn (notions)", "Analyse de KPI"],
  },
  {
    id: "reporting",
    title: "Dataviz & reporting",
    skills: ["Tableaux de bord", "Automatisation de rapports", "Data Visualization", "D3.js", "Google Maps API", "Power BI (en cours)", "Tableau / Qlik (découverte)", "Documentation technique"],
  },
  {
    id: "web",
    title: "Développement web",
    skills: ["React", "TypeScript", "JavaScript", "Node.js", "Express.js", "tRPC", "API REST", "PHP", "MongoDB", "Drizzle ORM", "HTML/CSS", "Tailwind CSS", "Bootstrap", "Vite", "Nunjucks", "Vitest"],
  },
  {
    id: "creatif",
    title: "Jeu vidéo, design & vidéo",
    skills: ["Unity", "C#", "Game Design", "Physics Engine", "Figma", "Klynt", "DaVinci Resolve", "Tournage vidéo"],
  },
  {
    id: "tools",
    title: "Outils",
    skills: ["Git", "GitHub"],
  },
];

export function projectsUsing(skill: string): Project[] {
  return projects.filter(p => p.stack.includes(skill));
}

// Compétences mises en œuvre en entreprise (voir `experience`), avec l'employeur.
export const skillsAtWork: Record<string, string[]> = {
  "IA générative": ["Randstad Digital", "Unitee"],
  "Agents IA": ["Randstad Digital"],
  "Conformité IA (AI Act)": ["Randstad Digital"],
  "Classification NLP": ["Unitee"],
  Scoring: ["Unitee"],
  n8n: ["Unitee"],
  Make: ["Unitee"],
  Python: ["Unitee"],
  "SQL / MySQL": ["Unitee"],
  "Analyse de KPI": ["Unitee"],
  "Tableaux de bord": ["Unitee"],
  "Automatisation de rapports": ["Unitee"],
  "Documentation technique": ["Unitee"],
  React: ["Unitee"],
  "Node.js": ["Unitee"],
};

export const experience = [
  {
    period: "10/2026 — aujourd'hui",
    start: "2026-10",
    current: true,
    title: "Forward Deployed Engineer – Ingénieur IA",
    place: "Randstad Digital — alternance",
    location: "Issy-les-Moulineaux (92), sur site, équipe AI-SDLC",
    points: [
      "Équipe AI-SDLC : une offre qui associe plateforme, agents IA et expertise humaine sur tout le cycle de vie logiciel, de la rétro-documentation à l'exploitation.",
      "Participation à un outil d'automatisation de la classification des systèmes d'IA selon l'AI Act et de la tenue du registre IA, avec la direction qualité opérationnelle.",
    ],
  },
  {
    period: "10/2025 — 09/2026",
    start: "2025-10",
    title: "Développeur full-stack & data",
    place: "Unitee — alternance",
    location: "Gonesse (95), entreprise du BTP",
    points: [
      "Collecte, consolidation et fiabilisation de données issues d'un ERP/CRM (React, Node.js, MySQL) : contrôles de cohérence et traçabilité.",
      "Production et analyse de KPI : tableaux de bord de pilotage pour les équipes opérationnelles et le management.",
      "Automatisation des rapports périodiques avec des scripts Python et SQL.",
      "IA appliquée : classification NLP et scoring de pertinence sur plus de 60 sources externes, intégrés à un outil métier.",
      "Documentation technique, bonnes pratiques et accompagnement des utilisateurs.",
    ],
  },
  {
    period: "04/2025 — 06/2025",
    start: "2025-04",
    title: "Développeur full-stack",
    place: "Unitee — stage",
    location: "Gonesse (95)",
    points: [
      "Automatisation de 5 workflows par IA générative (n8n, Make), soit environ 20 % de temps gagné sur les tâches répétitives.",
      "Conception d'une base de données SQL et d'un site web utilisé par environ 100 personnes par mois.",
    ],
  },
];

export const education = [
  {
    period: "09/2026 — 06/2028",
    start: "2026-09",
    current: true,
    title: "Master Informatique et Ingénierie des Données (IID)",
    place: "Université Paris 8 — Saint-Denis",
    note: "En alternance : 3 jours à l'école, 2 jours en entreprise en M1.",
    rhythm: { ecole: 3, entreprise: 2 },
  },
  {
    period: "09/2023 — 06/2026",
    start: "2023-09",
    title: "BUT Métiers du Multimédia et de l'Internet (MMI), parcours développement web",
    place: "IUT de Cergy-Pontoise",
  },
  {
    period: "09/2021 — 06/2023",
    start: "2021-09",
    title: "Baccalauréat STMG — management et gestion",
    place: "Lycée Léonard de Vinci — Saint-Witz",
  },
];

// `cefr` : niveau sur l'échelle européenne (A1 → C2) ; `native` pour la langue maternelle.
export const languages = [
  { name: "Français", level: "langue maternelle", cefr: "C2", native: true },
  { name: "Anglais", level: "B1, en progression", cefr: "B1", native: false },
];

export const qualities = ["Analyse et synthèse", "Rigueur", "Curiosité data et IA", "Vulgarisation"];

export const metrics = [
  { value: 60, suffix: "+", label: "sources externes classées et scorées par NLP" },
  { value: 5, suffix: "", label: "workflows automatisés par IA générative" },
  { value: 20, suffix: " %", label: "de temps gagné sur les tâches répétitives" },
  { value: 100, suffix: "", label: "utilisateurs par mois sur le site livré" },
];
