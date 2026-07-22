"use client";

import { useEffect, useRef } from "react";

// Canvas-based cursor effects (global — mounted from root layout):
//  - a soft smoke trail following the pointer
//  - a ripple + spark burst on click
// Tuned for the light silver theme: no additive ("lighter") blending, which
// bloomed into bright white/cyan ㄱ-shaped bands on pale backgrounds.
// Disabled on touch devices and when the user prefers reduced motion.

type Smoke = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

type Ripple = { x: number; y: number; r: number; life: number };

export default function CursorEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const smoke: Smoke[] = [];
    const sparks: Spark[] = [];
    const ripples: Ripple[] = [];

    let lastX = 0;
    let lastY = 0;
    let moved = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (moved) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        const count = Math.min(2, 1 + Math.floor(dist / 18));
        for (let i = 0; i < count; i++) {
          smoke.push({
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            vx: dx * 0.015 + (Math.random() - 0.5) * 0.25,
            vy: dy * 0.015 + (Math.random() - 0.5) * 0.25 - 0.2,
            life: 1,
            size: 5 + Math.random() * 8,
          });
        }
      }
      lastX = x;
      lastY = y;
      moved = true;
    };

    const onClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      ripples.push({ x, y, r: 0, life: 1 });
      const n = 14;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.25;
        const sp = 1.8 + Math.random() * 2.4;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Normal blending — additive "lighter" blew out to white on silver bg.
      ctx.globalCompositeOperation = "source-over";

      for (let i = smoke.length - 1; i >= 0; i--) {
        const p = smoke[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.008;
        p.life -= 0.03;
        p.size += 0.25;
        if (p.life <= 0) {
          smoke.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        const a = p.life * 0.14;
        g.addColorStop(0, `rgba(40, 44, 52, ${a})`);
        g.addColorStop(1, `rgba(40, 44, 52, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 5;
        r.life -= 0.05;
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(20, 20, 20, ${r.life * 0.35})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.vx *= 0.98;
        s.vy *= 0.98;
        s.life -= 0.03;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(20, 20, 20, ${s.life * 0.55})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.6 * s.life + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] h-full w-full max-w-none"
    />
  );
}
