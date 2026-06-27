import {
  useEffect,
  useState,
  TouchEvent,
} from "react";
import { ChevronLeft, ChevronRight, Globe, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useMobile";

export interface ThreeDCarouselItem {
  id: number;
  title: string;
  brand: string;
  description: string;
  longDescription: string;
  tags: string[];
  technologies: string[];
  imageUrl: string;
  link: string;
  codeLink: string;
  date: string;
}

interface ThreeDCarouselProps {
  items: ThreeDCarouselItem[];
  autoRotate?: boolean;
  rotateInterval?: number;
  cardHeight?: number;
}

const ThreeDCarousel = ({
  items,
  autoRotate = true,
  rotateInterval = 5000,
  cardHeight = 620,
}: ThreeDCarouselProps) => {
  const [active, setActive] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const minSwipeDistance = 50;

  const hImage = isMobile ? "h-36" : "h-52";
  const cardPad = isMobile ? "p-4" : "p-6";
  const sideOffset = isMobile ? 25 : 35;

  useEffect(() => {
    if (autoRotate && isInView && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % items.length);
      }, rotateInterval);
      return () => clearInterval(interval);
    }
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const el = document.getElementById("ThreeDCarousel");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % items.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  const getCardStyle = (index: number) => {
    if (index === active) return { transform: "scale(1)", opacity: 1, zIndex: 20 };
    if (index === (active + 1) % items.length)
      return { transform: `translateX(${sideOffset}%) scale(0.95)`, opacity: 0.5, zIndex: 10 };
    if (index === (active - 1 + items.length) % items.length)
      return { transform: `translateX(-${sideOffset}%) scale(0.95)`, opacity: 0.5, zIndex: 10 };
    return { transform: "scale(0.9)", opacity: 0, zIndex: 0, pointerEvents: "none" as const };
  };

  return (
    <section
      id="ThreeDCarousel"
      className="bg-transparent w-full mx-auto flex items-center justify-center"
    >
      <div className="w-full px-2 sm:px-4 lg:px-8 max-w-7xl">
        {isMobile && items.length > 1 && (
          <p className="text-center text-zinc-500 text-xs mb-2">
            Glissez pour naviguer entre les projets
          </p>
        )}
        <div
          className="relative overflow-hidden"
          style={{ height: isMobile ? cardHeight + 40 : cardHeight + 80 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {items.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="absolute top-0 w-full sm:max-w-lg px-2 sm:px-0 transition-all duration-500"
                  style={getCardStyle(index)}
                >
                  <Card
                    className="overflow-hidden bg-zinc-950 border-zinc-800 shadow-xl flex flex-col"
                    style={{ height: isMobile ? cardHeight - 40 : cardHeight }}
                  >
                    <div
                      className={`relative ${hImage} flex items-center justify-center overflow-hidden`}
                      style={{
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/60" />
                      <div className="relative z-10 text-center text-white p-3 sm:p-4">
                        <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
                          {item.brand}
                        </h3>
                        <div className="w-8 sm:w-12 h-0.5 bg-primary mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2">{item.title}</p>
                      </div>
                    </div>

                    <CardContent className={`${cardPad} flex flex-col flex-grow`}>
                      <h3 className="text-base sm:text-xl font-bold mb-1 text-white line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-zinc-400 text-xs sm:text-sm mb-2">{item.date}</p>
                      <p className="text-zinc-300 text-xs sm:text-sm flex-grow leading-relaxed line-clamp-3 sm:line-clamp-none">
                        {item.description}
                      </p>

                      <div className="mt-2 sm:mt-4 space-y-2 sm:space-y-3">
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {item.tags.slice(0, isMobile ? 3 : undefined).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 sm:px-2 py-0.5 bg-primary/20 text-primary text-[10px] sm:text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {item.technologies.slice(0, isMobile ? 3 : 5).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 sm:px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] sm:text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-zinc-800">
                        {item.link && item.link !== "#" && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary hover:bg-primary/90 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium inline-flex items-center gap-1 sm:gap-1.5 transition-colors"
                          >
                            <Globe size={isMobile ? 12 : 14} /> Voir le projet
                          </a>
                        )}
                        {item.codeLink && item.codeLink !== "#" && (
                          <a
                            href={item.codeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-zinc-600 text-zinc-300 hover:bg-zinc-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-medium inline-flex items-center gap-1 sm:gap-1.5 transition-colors"
                          >
                            <Github size={isMobile ? 12 : 14} /> Code source
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {!isMobile && items.length > 1 && (
            <>
              <button
                className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-zinc-800/80 rounded-full flex items-center justify-center text-zinc-300 hover:bg-zinc-700 z-30 shadow-md transition-all hover:scale-110"
                onClick={() =>
                  setActive((prev) => (prev - 1 + items.length) % items.length)
                }
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
              <button
                className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-zinc-800/80 rounded-full flex items-center justify-center text-zinc-300 hover:bg-zinc-700 z-30 shadow-md transition-all hover:scale-110"
                onClick={() => setActive((prev) => (prev + 1) % items.length)}
                aria-label="Next"
              >
                <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </>
          )}

          {items.length > 1 && (
            <div className="absolute -bottom-2 sm:bottom-4 left-0 right-0 flex justify-center items-center space-x-2 sm:space-x-3 z-30">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  className={`rounded-full transition-all duration-300 ${
                    active === idx
                      ? "bg-primary w-3 sm:w-5 h-2 sm:h-2"
                      : "bg-zinc-600 hover:bg-zinc-500 w-1.5 sm:w-2 h-1.5 sm:h-2"
                  }`}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to item ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ThreeDCarousel;
