"use client";

import { useEffect, useRef } from "react";

// Water-ripple custom cursor used on the About & Skills pages. As the pointer
// moves it disturbs a "water surface" — soft expanding rings trail behind it —
// and a glowing droplet follows the pointer. On click a stronger RippleWave of
// concentric rings bursts outward. Disabled on touch / reduced-motion so those
// users keep the native cursor.

type Ring = {
  x: number;
  y: number;
  r: number; // current radius
  maxR: number; // radius at which it fully fades
  life: number; // 1 -> 0
  decay: number; // life lost per frame
  width: number; // stroke width
  hue: "cyber" | "ore";
};

// Palette matched to the site (cyber cyan + ore amber).
const COLORS = {
  cyber: (a: number) => `rgba(34,211,238,${a})`,
  ore: (a: number) => `rgba(251,191,36,${a})`,
};

export default function WaterCursor() {
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
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let mx = -9999;
    let my = -9999;
    // Smoothed pointer position for the trailing droplet.
    let dropX = -9999;
    let dropY = -9999;
    const rings: Ring[] = [];
    let lastRippleX = -9999;
    let lastRippleY = -9999;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dropX < -9000) {
        dropX = mx;
        dropY = my;
        lastRippleX = mx;
        lastRippleY = my;
      }
      // Spawn a gentle trailing ripple every time the pointer travels a bit —
      // this makes waves form as the cursor passes over the surface.
      const moved = Math.hypot(mx - lastRippleX, my - lastRippleY);
      if (moved > 22) {
        rings.push({
          x: mx,
          y: my,
          r: 2,
          maxR: 26 + Math.random() * 14,
          life: 1,
          decay: 0.03,
          width: 1.3,
          hue: "cyber",
        });
        lastRippleX = mx;
        lastRippleY = my;
      }
    };

    // Click: a RippleWave — several concentric rings spread outward with force.
    const onDown = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const layers = 3;
      for (let k = 0; k < layers; k++) {
        rings.push({
          x,
          y,
          r: 2 + k * 3,
          maxR: 60 + k * 17,
          life: 1,
          decay: 0.014 + k * 0.0015,
          width: 2.2 - k * 0.3,
          hue: k % 2 === 0 ? "cyber" : "ore",
        });
      }
    };

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trailing droplet that eases toward the pointer.
      if (mx > -9000) {
        dropX += (mx - dropX) * 0.2;
        dropY += (my - dropY) * 0.2;

        const grad = ctx.createRadialGradient(dropX, dropY, 0, dropX, dropY, 12);
        grad.addColorStop(0, "rgba(103,232,249,0.55)");
        grad.addColorStop(0.5, "rgba(34,211,238,0.22)");
        grad.addColorStop(1, "rgba(34,211,238,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(dropX, dropY, 12, 0, Math.PI * 2);
        ctx.fill();

        // bright core
        ctx.fillStyle = "rgba(225,242,252,0.9)";
        ctx.beginPath();
        ctx.arc(dropX, dropY, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update + draw ripple rings (both trail and click waves).
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.life -= ring.decay;
        if (ring.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        // Ease-out expansion: fast at first, slowing as it fades.
        const t = 1 - ring.life;
        ring.r = 2 + (ring.maxR - 2) * (1 - Math.pow(1 - t, 2));

        const alpha = ring.life * 0.6;
        ctx.strokeStyle = COLORS[ring.hue](alpha);
        ctx.lineWidth = ring.width;
        ctx.beginPath();
        // Slight vertical squash so it reads like a ripple on a surface.
        ctx.ellipse(ring.x, ring.y, ring.r, ring.r * 0.82, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[66]"
    />
  );
}
