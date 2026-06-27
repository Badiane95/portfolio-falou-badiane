import { Github, Linkedin } from "lucide-react";
import { useEffect } from "react";
import { Link } from "wouter";
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
              <li data-aos="fade-up" data-aos-delay="150" data-aos-once="true"><Link to="/skills" className="text-zinc-400 hover:text-white transition-colors">Compétences</Link></li>
              <li data-aos="fade-up" data-aos-delay="200" data-aos-once="true"><Link to="/projects" className="text-zinc-400 hover:text-white transition-colors">Projets</Link></li>
              <li data-aos="fade-up" data-aos-delay="250" data-aos-once="true"><Link to="/about" className="text-zinc-400 hover:text-white transition-colors">À propos</Link></li>
              <li data-aos="fade-up" data-aos-delay="300" data-aos-once="true"><Link to="/contact" className="text-zinc-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4" data-aos="fade-left" data-aos-duration="800" data-aos-delay="200" data-aos-once="true">
            <h4 className="font-bold text-white">Réseaux sociaux</h4>
            <div className="flex gap-4">
              <a href="https://github.com/Badiane95" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all hover:scale-110 duration-200" title="GitHub">
                <Github size={20} className="text-zinc-300" />
              </a>
              <a href="https://www.linkedin.com/in/falou-badiane-b555422a9/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all hover:scale-110 duration-200" title="LinkedIn">
                <Linkedin size={20} className="text-zinc-300" />
              </a>
              <a href="https://www.behance.net/faloubadiane" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all hover:scale-110 duration-200" title="Behance">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-zinc-300">
                  <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
                </svg>
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
