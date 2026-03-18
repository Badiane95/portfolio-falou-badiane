import { Github, Linkedin, Mail } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";

export function Footer() {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-primary/10 to-primary/5 border-t border-border py-12 md:py-16 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo et description */}
          <div className="space-y-4" data-aos="fade-right" data-aos-duration="800" data-aos-once="true">
            <h3 className="text-2xl font-bold text-primary">Falou Badiane</h3>
            <p className="text-muted-foreground">
              Développeur Web & Automation passionné par la création de solutions innovantes.
            </p>
          </div>

          {/* Liens du site */}
          <div className="space-y-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100" data-aos-once="true">
            <h4 className="font-bold text-foreground">Navigation</h4>
            <ul className="space-y-2">
              <li data-aos="fade-up" data-aos-delay="150" data-aos-once="true"><a href="/#competences" className="text-muted-foreground hover:text-primary transition-colors">Compétences</a></li>
              <li data-aos="fade-up" data-aos-delay="200" data-aos-once="true"><a href="/projects" className="text-muted-foreground hover:text-primary transition-colors">Projets</a></li>
              <li data-aos="fade-up" data-aos-delay="250" data-aos-once="true"><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">À propos</a></li>
              <li data-aos="fade-up" data-aos-delay="300" data-aos-once="true"><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200" data-aos-once="true">
            <h4 className="font-bold text-foreground">Réseaux sociaux</h4>
            <div className="flex gap-4">
              <a href="https://github.com/Badiane95" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all hover:scale-110 duration-200" title="GitHub" data-aos="zoom-in" data-aos-delay="300" data-aos-once="true">
                <Github size={20} className="text-primary" />
              </a>
              <a href="https://linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all hover:scale-110 duration-200" title="LinkedIn" data-aos="zoom-in" data-aos-delay="400" data-aos-once="true">
                <Linkedin size={20} className="text-primary" />
              </a>
              <a href="mailto:badiane.falou95@gmail.com" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center transition-all hover:scale-110 duration-200" title="Email" data-aos="zoom-in" data-aos-delay="500" data-aos-once="true">
                <Mail size={20} className="text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" data-aos="fade-up" data-aos-duration="600" data-aos-once="true"></div>

        {/* Copyright */}
        <div className="text-center text-muted-foreground" data-aos="fade-up" data-aos-duration="600" data-aos-delay="100" data-aos-once="true">
          <p>&copy; 2026 Falou Badiane. Tous les droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
