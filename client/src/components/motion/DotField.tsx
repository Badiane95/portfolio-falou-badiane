import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

type Dot = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };

const GAP = 26;
const RADIUS = 130;
const PUSH = 5;
const SPRING = 0.08;
const DAMPING = 0.78;

/**
 * Grille de points dessinée sur un canvas. Les points fuient le pointeur
 * puis reviennent en place avec un ressort amorti.
 * La boucle s'arrête dès que tout est immobile ou que la grille sort de l'écran.
 */
export function DotField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue("--foreground").trim() || "#111110";
    const accent = styles.getPropertyValue("--primary").trim() || "#2b3fe0";

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let frame: number | null = null;
    let visible = true;
    const pointer = { x: -1e4, y: -1e4 };

    const build = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const offsetX = (width % GAP) / 2 + GAP / 2;
      const offsetY = (height % GAP) / 2 + GAP / 2;
      for (let y = offsetY; y < height; y += GAP) {
        for (let x = offsetX; x < width; x += GAP) {
          dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        const dist = Math.hypot(d.x - pointer.x, d.y - pointer.y);
        const near = Math.max(0, 1 - dist / RADIUS);
        ctx.globalAlpha = near > 0 ? 0.3 + near * 0.7 : 0.28;
        ctx.fillStyle = near > 0.05 ? accent : ink;
        const size = 1.2 + near * 1.8;
        ctx.fillRect(d.x - size / 2, d.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      let moving = false;
      for (const d of dots) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS && dist > 0.1) {
          const force = (1 - dist / RADIUS) * PUSH;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }
        d.vx = (d.vx + (d.ox - d.x) * SPRING) * DAMPING;
        d.vy = (d.vy + (d.oy - d.y) * SPRING) * DAMPING;
        d.x += d.vx;
        d.y += d.vy;
        if (Math.abs(d.vx) > 0.01 || Math.abs(d.vy) > 0.01) moving = true;
      }
      draw();
      frame = moving && visible ? requestAnimationFrame(step) : null;
    };

    const wake = () => {
      if (frame === null && visible) frame = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      wake();
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
      wake();
    };

    build();
    const resize = new ResizeObserver(build);
    resize.observe(host);

    if (reduce) {
      return () => resize.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      resize.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`} />;
}
