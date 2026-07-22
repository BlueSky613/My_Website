"use client";

import { useEffect, useRef } from "react";

// Canvas-based cursor effects (global — mounted from root layout):
//  - a trail of soft cyan/gold smoke following the pointer
//  - an expanding ripple + spark burst on click
// Uses source-over (not additive "lighter") so colors stay vivid on the
// light silver theme without blooming into white bands.
// Disabled on touch devices and when the user prefers reduced motion.

type Smoke = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};

type Ripple = { x: number; y: number; r: number; life: number; hue: number };

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

    // Cyan ↔ gold — readable on silver without additive blowout.
    const pickHue = () => (Math.random() < 0.5 ? 188 : 42);

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      if (moved) {
        const dx = x - lastX;
        const dy = y - lastY;
        const dist = Math.hypot(dx, dy);
        const count = Math.min(3, 1 + Math.floor(dist / 14));
        for (let i = 0; i < count; i++) {
          smoke.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: dx * 0.02 + (Math.random() - 0.5) * 0.35,
            vy: dy * 0.02 + (Math.random() - 0.5) * 0.35 - 0.25,
            life: 1,
            size: 7 + Math.random() * 12,
            hue: pickHue(),
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
      const hue = pickHue();
      ripples.push({ x, y, r: 0, life: 1, hue });
      const n = 18;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.3;
        const sp = 2.2 + Math.random() * 3;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          hue: Math.random() < 0.5 ? hue : pickHue(),
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      for (let i = smoke.length - 1; i >= 0; i--) {
        const p = smoke[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.01;
        p.life -= 0.02;
        p.size += 0.35;
        if (p.life <= 0) {
          smoke.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        // Mid lightness (~48%) so cyan/gold read on #e4e6ea without washing white.
        const a = p.life * 0.45;
        g.addColorStop(0, `hsla(${p.hue}, 85%, 42%, ${a})`);
        g.addColorStop(0.55, `hsla(${p.hue}, 80%, 48%, ${a * 0.35})`);
        g.addColorStop(1, `hsla(${p.hue}, 80%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += 5.5;
        r.life -= 0.04;
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `hsla(${r.hue}, 90%, 40%, ${r.life * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.055;
        s.vx *= 0.98;
        s.vy *= 0.98;
        s.life -= 0.022;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `hsla(${s.hue}, 92%, 40%, ${s.life * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2 * s.life + 0.5, 0, Math.PI * 2);
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
