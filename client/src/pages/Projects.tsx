import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { useLocation } from "wouter";

const projects = [
  {
    id: 1,
    title: "Festival Les Talents de l'IUT",
    description: "Réalisation complète de vidéos promotionnelles pour le festival annuel de l'IUT de Cergy-Pontoise. Ce projet a impliqué la production vidéo professionnelle, le montage avancé et la promotion digitale sur les réseaux sociaux.",
    longDescription: "J'ai pris en charge l'ensemble du processus de création vidéo, de la pré-production à la post-production. Cela incluait la planification du tournage, la direction de la production, le montage vidéo sophisticé et la création de contenu promotionnel pour maximiser la visibilité de l'événement.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/MYkQxOVZbFZWAKHM.jpg?Expires=1804596980&Signature=KyyzLFhdTkXjRaYaqRRJyxcQ~cBQHdRtzKGlYkuvg3F6q2MrGT9hXCrm3ToGsICF0DTyUGVMPf-uZBYOKX7S0j3aJWPaW-p87CqB1l3CSMrFhYwSMf33zpPO-tl6-YXw~4FwYMjf9e49oVccanct2aFXwxn-JhZmR6joVFlKGljL8qCuwR20cfKUBO5vswNrnZgrg8cAv6v3uKVyQI4PNkYr3Vbk7Pls7oBz8bRMBhY3wMBW7NsSJeP5uNuewLNV0ICpMMPgO1KgEGMfeWY7wqxMehaHvRAxLV~TXl8QXuiuIDAHxna-qbUyX3UZR8UHa6rX6wOPLE~6UmKY2AMONg__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Vidéo", "Production", "Promotion", "Montage"],
    technologies: ["DaVinci Resolve", "Adobe Premiere", "Social Media Marketing"],
    date: "2024",
    link: "#"
  },
  {
    id: 2,
    title: "Site Web Institutionnel",
    description: "Développement d'un site web moderne pour présenter la formation MMI de l'IUT. Le projet inclut une intégration complète de bases de données et un système de gestion de contenu dynamique.",
    longDescription: "Ce site institutionnel a été conçu pour offrir une expérience utilisateur optimale tout en permettant une gestion facile du contenu. J'ai implémenté une architecture backend robuste avec PHP et MySQL, assurant la sécurité et la performance du site.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/hRKlnvebaDKFroSR.jpg?Expires=1804596980&Signature=ech1GU1ZOrRAm8bWN2xs82fNgX7fvxduT4SLJms3q8v1Go-byHBg3AN8rZ0U3iwAmWsI47fq27h2O1ZmCLcwQ8TWKbPrTWBwjFXZsLv09oddT3ejd~zfZyTZJZWxRFyBL6B4-Ya4Db8JzrXsMZVP0ZJ1CYS~pa5s1t8nefSEk0vU2gGuCqNNq~2SrlGLago5m84OyH6ITm82Vp-5dLDkii6N0sHFXNhiPxCDNGGgZdxq-03sdcO~ojuFt3v5XuYj3eW1jLCiCRT2zhxlKjwTLAPsiFuH6F65JtKPQhlecm0Hz-zxFQs~KIAOOTIH2vkfvieIzhlIUKRT5J1-ZjK2UA__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Web", "Backend", "Base de données"],
    technologies: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap"],
    date: "2023",
    link: "#"
  },
  {
    id: 3,
    title: "Webdocumentaire Interactif",
    description: "Création d'une expérience immersive combinant les technologies Klynt et DaVinci Resolve. Le projet présente un court-métrage avec une navigation interactive innovante.",
    longDescription: "Ce webdocumentaire représente une fusion créative entre la vidéo et l'interactivité web. Utilisant Klynt pour la structure interactive et DaVinci Resolve pour la post-production vidéo, j'ai créé une expérience unique qui engage les spectateurs de manière nouvelle.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/QayrtGQXoaNzXuHc.jpg?Expires=1804596980&Signature=XdeYqJcdWFSs9JA3aln~~bobKXKtn4YhdlQRNbYbp0oQfVIq84m1VxLK9ZVHxqWpBFgvpK45ACTFGZxP8hsiRO4badbASZY2LPQePY8lZhzyePX2Y66pvyo3702l1ljoKmfNV5ZRbu7UT9DjQodsUJyIX3aB8-Gr31R3PHHONXXgrIAN-OywJI3cmSM8pA9RIpyHVsK4k91ge3j8VkgfWAZ~dHqNK1SmLzTXxDOqqGRQyf9odRPJz-pNa97x0N1FtpqoOXftyf8yqvBf7xWODqh-2loAd1k~JfFPGAEC48UoaiHbTal26v~Uqgge1QY1lH13wGCTmTlvgDrQxGaTRQ__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Interactif", "Vidéo", "Design", "Web"],
    technologies: ["Klynt", "DaVinci Resolve", "HTML/CSS", "JavaScript"],
    date: "2024",
    link: "#"
  },
  {
    id: 4,
    title: "Création d'un Jeu Vidéo",
    description: "Développement complet d'un jeu vidéo avec Unity et C#. Le projet inclut la programmation de la logique de jeu, des mécaniques de mouvement avancées et des systèmes de collision optimisés.",
    longDescription: "Ce projet de jeu vidéo démontre ma maîtrise de l'architecture de jeu et de l'optimisation des performances. J'ai implémenté un système complet de gestion des états de jeu (Game States), des mécaniques de mouvement fluides et des systèmes de collision précis. Le code a été optimisé pour assurer une performance optimale sur différentes plateformes.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/OMNXgLuWFfkwAcCl.jpg?Expires=1804596980&Signature=B1ukbKDlYIpN6Y5UwxWouAvJw0Y8Xjx9EZljsrH1dQbmnymcKwvBwqR-NmbnXi0wior7uErwknXSxhy77C44vZfpjyKslKkt4j0mWTS4FjbqJJYNZo3KUQoKCBy2sam-VhpMt2IvU6vwJTmJvoRogMujjooUaxYyQHwYT0~kyhsW2DZDVfYtC2DvnFnSEZ2NF8LLlenxyDFgXWT7CllvQq2X2DZqfsNAvdR7JgaQwXucIbbkmeZToGh1To9mfTYWgj3GxeWMWsfzR3Z~L0J6bShaI0fb~oscWtKqJ95rr0Yn16iQJxUfUp~xy3rFzpkWt-Ve0W1Z5EuEp6NW7q51qg__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Jeu Vidéo", "Programmation", "Architecture", "Performance"],
    technologies: ["Unity", "C#", "Game Design", "Physics Engine"],
    date: "2025",
    link: "#"
  },
  {
    id: 5,
    title: "Data Visualization & Géolocalisation",
    description: "Développement d'une application interactive de géolocalisation utilisant des APIs de cartographie pour l'exploration de données cinématographiques. Un projet qui combine data visualization et géographie.",
    longDescription: "Cette application interactive démontre ma capacité à intégrer des APIs de cartographie avancées pour créer des visualisations de données engageantes. J'ai implémenté des fonctionnalités de filtrage dynamique, de clustering de données et de visualisation interactive pour permettre une exploration intuitive des données cinématographiques à travers le monde.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/pHcjuzNBWZJMPjhC.jpg?Expires=1804596980&Signature=lL9o7oq7KkhhwV0YTpDmD7Bq9VO-gEpdNMlx8aQGpOj7qeSmit8~x9DYsTJRXaANDSulBo7fJjVdmnMNu~FfiAZ52XinrsQOpi-7Dmwtdk~d6qgpDROuBV6y~3FAjU4F6XNCiLJxBEbju40JJo8BdN9sIE4QPFfnnWnCa~X8xoUEUMhNJK4ZHMcMY-G-uSRLR-yQ2IlMZFvm-WDLtaJQLL4b94btKIES4kvwHfVl2xEE0rqIoL6JDGT1OnnhwUcclD0zzkSaPy0nPlGWBCg3L5e2nmn~H1IjgIyanwxkkAJPXlZUPoFnSkP0lNaCwBk2r30E-Ifj1-wQ5Q4eu5A__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Data Visualization", "Géolocalisation", "API", "Données"],
    technologies: ["JavaScript", "Google Maps API", "D3.js", "React", "Node.js"],
    date: "2025",
    link: "#"
  },
  {
    id: 6,
    title: "Back-Office de Gestion de Contenu",
    description: "Réalisation d'un Back-Office sur mesure pour la gestion dynamique des flux d'informations universitaires. Un système complet de gestion de contenu pour l'IUT.",
    longDescription: "Ce Back-Office a été développé pour répondre aux besoins spécifiques de gestion de contenu universitaire. Le système offre une interface intuitive pour la gestion des utilisateurs, des contenus et des flux d'informations. J'ai implémenté une architecture sécurisée avec contrôle d'accès basé sur les rôles et une base de données SQL optimisée pour supporter 100+ utilisateurs mensuels.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/XUSxgKXotclZTHDD.jpg?Expires=1804596980&Signature=F5Yr0zz38qj5b7AB~SNS6C9i~s0gT-c8VuMP~DA746IV9Ua8vPfI0T3PvaYN~L53vTmV4D867zNSmRyM0SZh9qntreV4OsCwqRHwUP5xJn70QgoX-g67-q19xRl6h9PhQTS7FDho~8dXi~Aozn983XepWOW96-5mNiJFz5B-xVJw-hz-NC1RXMQjrmvpsIHCB6RU8ow4hRHOGuY5NZz3pcPrdWBbuB52rsexgKkfeah6gVXn3vR7c0T4wiVHrk2Mhu~SbUdeGeiftgqKlXU0e05zH9MFWooeNXZfD2sQXNj0rdrtR07dQNI9gCj3ARU-KciD2XoxU-bq2mFFRZhbpA__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Back-Office", "Gestion de Contenu", "Base de Données", "Sécurité"],
    technologies: ["PHP", "MySQL", "HTML/CSS", "JavaScript", "Bootstrap"],
    date: "2024",
    link: "#"
  },
  {
    id: 7,
    title: "Station Numixs - Workflows Automatisation IA",
    description: "Conception et déploiement de 5 workflows automatisés via IA chez Unitee, réduisant de 20% le temps opérationnel. Un projet d'automatisation d'entreprise à grande échelle.",
    longDescription: "Ce projet représente mon expertise en automatisation et intelligence artificielle appliquée aux processus métiers. J'ai conçu et déployé 5 workflows automatisés qui ont réduit significativement le temps opérationnel de 20%. Ces workflows intègrent des technologies IA avancées pour l'optimisation des processus, l'analyse de données et la prise de décision automatisée. Le projet démontre ma capacité à transformer des processus manuels en solutions intelligentes et scalables.",
    image: "https://private-us-east-1.manuscdn.com/user_upload_by_module/session_file/310519663323740600/xmdVJFOLenEkZXVs.jpg?Expires=1804596980&Signature=tbnGS~IMDwaPYpAzTpuUgshR9k8CRxopQf8ii4eHTr9J1hudfcGlzI-La6pr0YY~5A4J2TQI21qTHCA33bZPfh~vY1pdze9aNIpD6Ta6UrqzWUZLa~avuH1yys0-HrDQ3Wj0TSaMjdnsF7WMuttfHB1Z2uw7k1MBUYGObaXPWP5M3ylaWn-yKJmf-LUW5L66liKORsBa8-fCnbE9HaX4R6lodumULyCMaz~ErHzseDLsWGh1JwP9oX2Re93kTZF-l5MCFR1GmVJbzbIt3R72A7eXeNtK-XN0ylSjbiNjbI8btA6QttENm-S7BW3z0QFUtRLr79XjbaJRS5C7TMWSlw__&Key-Pair-Id=K2HSFNDJXOU9YS",
    tags: ["Automatisation", "IA", "Workflows", "Optimisation"],
    technologies: ["Python", "IA/ML", "Web Scraping", "APIs", "Automation"],
    date: "2025",
    link: "#"
  }
];

export default function Projects() {
  const [, setLocation] = useLocation();

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
            Découvrez en détail les 7 projets qui démontrent mes compétences en développement web, jeux vidéo, data visualization et automatisation IA.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 md:py-32">
        <div className="container space-y-16">
          {projects.map((project, idx) => (
            <div key={project.id} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Image - Alternance gauche/droite */}
                <div className={`relative ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"></div>
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-96 object-cover rounded-2xl relative z-10"
                  />
                </div>

                {/* Contenu */}
                <div className={`space-y-6 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
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
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">Technologies utilisées</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full border border-accent/30">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-4 pt-4">
                    {project.link !== "#" && (
                      <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                        <ExternalLink size={18} /> Voir le projet
                      </Button>
                    )}
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 gap-2">
                      <Github size={18} /> Code source
                    </Button>
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
