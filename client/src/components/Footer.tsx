import { Github, Linkedin, Mail } from "lucide-react";
import { useEffect } from "react";
import AOS from "aos";

export function Footer() {
  useEffect(() => {
    AOS.refresh();
  }, []);

  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-12 md:py-16 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4" data-aos="fade-right" data-aos-duration="800" data-aos-once="true">
            <h3 className="text-2xl font-bold text-white">Falou Badiane</h3>
            <p className="text-zinc-400">
              Développeur Web & Automation passionné par la création de solutions innovantes.
            </p>
          </div>

          <div className="space-y-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100" data-aos-once="true">
            <h4 className="font-bold text-white">Navigation</h4>
            <ul className="space-y-2">
              <li data-aos="fade-up" data-aos-delay="150" data-aos-once="true"><a href="/#competences" className="text-zinc-400 hover:text-white transition-colors">Compétences</a></li>
              <li data-aos="fade-up" data-aos-delay="200" data-aos-once="true"><a href="#/projects" className="text-zinc-400 hover:text-white transition-colors">Projets</a></li>
              <li data-aos="fade-up" data-aos-delay="250" data-aos-once="true"><a href="#/about" className="text-zinc-400 hover:text-white transition-colors">À propos</a></li>
              <li data-aos="fade-up" data-aos-delay="300" data-aos-once="true"><a href="#/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200" data-aos-once="true">
            <h4 className="font-bold text-white">Réseaux sociaux</h4>
            <div className="flex gap-4">
              <a href="https://github.com/Badiane95" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all hover:scale-110 duration-200" title="GitHub">
                <Github size={20} className="text-zinc-300" />
              </a>
              <a href="https://linkedin.com/in/falou-badiane" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all hover:scale-110 duration-200" title="LinkedIn">
                <Linkedin size={20} className="text-zinc-300" />
              </a>
              <a href="mailto:badiane.falou95@gmail.com" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all hover:scale-110 duration-200" title="Email">
                <Mail size={20} className="text-zinc-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 my-8"></div>

        <div className="text-center text-zinc-500">
          <p>&copy; 2026 Falou Badiane. Tous les droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
