"use client";

import { useEffect, useRef } from "react";

// Futuristic wireframe globe with falling data streams and network links.
// The sphere subtly follows the pointer (parallax + tilt). Decorative,
// pointer-events-none, reduced-motion safe.

const LAT_LINES = 10;
const LON_LINES = 18;

type Stream = {
  x: number;
  y: number;
  speed: number;
  gap: number;
  phase: number;
  chars: string[];
};

type NetNode = { lat: number; lon: number };

function spherePoint(lat: number, lon: number, rotY: number, rotX: number) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  let x = Math.cos(la) * Math.cos(lo);
  let y = Math.sin(la);
  let z = Math.cos(la) * Math.sin(lo);

  const cy = Math.cos(rotY);
  const sy = Math.sin(rotY);
  const x1 = x * cy - z * sy;
  const z1 = x * sy + z * cy;

  const cx = Math.cos(rotX);
  const sx = Math.sin(rotX);
  const y1 = y * cx - z1 * sx;
  const z2 = y * sx + z1 * cx;

  return { x: x1, y: y1, z: z2 };
}

function project(
  p: { x: number; y: number; z: number },
  cx: number,
  cy: number,
  radius: number
) {
  const fov = 2.8;
  const s = fov / (fov + p.z);
  return {
    x: cx + p.x * radius * s,
    y: cy + p.y * radius * s,
    z: p.z,
    s,
  };
}

export default function DigitalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const streams: Stream[] = [];
    const netNodes: NetNode[] = [];
    for (let i = 0; i < 28; i++) {
      streams.push({
        x: 0,
        y: 0,
        speed: 0.6 + Math.random() * 1.4,
        gap: 14 + Math.random() * 10,
        phase: Math.random() * 40,
        chars: Array.from({ length: 18 }, () =>
          Math.random() < 0.55 ? "0" : "1"
        ),
      });
    }
    for (let i = 0; i < 22; i++) {
      netNodes.push({
        lat: (Math.random() - 0.5) * 140,
        lon: Math.random() * 360,
      });
    }

    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (const s of streams) {
        s.x = Math.random() * W;
        s.y = Math.random() * H * 0.55;
      }
    };
    resize();

    let mx = W * 0.5;
    let my = H * 0.45;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let globeX = W * 0.68;
    let globeY = H * 0.5;
    let rotY = 0.4;
    let rotX = 0.22;
    let t = 0;
    let raf = 0;

    const drawGlobe = (cx: number, cy: number, radius: number, ry: number, rx: number) => {
      const drawMeridian = (lon: number) => {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(spherePoint(lat, lon, ry, rx), cx, cy, radius);
          if (p.z < -0.35) {
            started = false;
            continue;
          }
          const a = 0.08 + (p.z + 1) * 0.22;
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(56,189,248,${0.35})`;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      };

      const drawParallel = (lat: number) => {
        ctx.beginPath();
        let started = false;
        for (let lon = 0; lon <= 360; lon += 4) {
          const p = project(spherePoint(lat, lon, ry, rx), cx, cy, radius);
          if (p.z < -0.35) {
            started = false;
            continue;
          }
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(34,211,238,${0.12 + Math.abs(lat) / 180})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      };

      for (let i = 0; i < LON_LINES; i++) drawMeridian((i / LON_LINES) * 360);
      for (let i = 1; i < LAT_LINES; i++) {
        const lat = -80 + (i / LAT_LINES) * 160;
        drawParallel(lat);
      }

      // Atmosphere glow
      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.35);
      glow.addColorStop(0, "rgba(34,211,238,0.18)");
      glow.addColorStop(0.55, "rgba(14,116,144,0.08)");
      glow.addColorStop(1, "rgba(14,116,144,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Core highlight
      ctx.strokeStyle = "rgba(103,232,249,0.55)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.98, 0, Math.PI * 2);
      ctx.stroke();
    };

    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, W, H);

      // Dark blue cinematic backdrop
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#040a14");
      bg.addColorStop(0.45, "#061828");
      bg.addColorStop(1, "#030810");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const homeX = W * 0.68;
      const homeY = H * 0.52;
      const radius = Math.min(W, H) * 0.28;

      if (!reduce) {
        const tx = homeX + (mx - homeX) * 0.42;
        const ty = homeY + (my - homeY) * 0.32;
        globeX += (tx - globeX) * 0.06;
        globeY += (ty - globeY) * 0.06;
        rotY = 0.35 + (mx / W - 0.5) * 0.55 + t * 0.35;
        rotX = 0.2 + (my / H - 0.45) * 0.28;
      } else {
        globeX = homeX;
        globeY = homeY;
      }

      // Falling data streams (full width, top half)
      ctx.font = "10px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      for (const s of streams) {
        if (!reduce) s.y += s.speed;
        if (s.y > H * 0.72) {
          s.y = -s.gap * s.chars.length;
          s.x = Math.random() * W;
        }
        for (let i = 0; i < s.chars.length; i++) {
          const yy = s.y - i * s.gap;
          if (yy < -12 || yy > H * 0.75) continue;
          const head = i === 0;
          const fade = Math.max(0, 1 - yy / (H * 0.7));
          ctx.fillStyle = head
            ? `rgba(186,230,253,${0.75 * fade})`
            : `rgba(34,211,238,${(0.08 + i * 0.02) * fade})`;
          ctx.fillText(s.chars[i], s.x, yy + s.phase);
        }
      }

      drawGlobe(globeX, globeY, radius, rotY, rotX);

      // Network nodes + links on the globe
      const projected = netNodes.map((n) =>
        project(spherePoint(n.lat, n.lon, rotY, rotX), globeX, globeY, radius)
      );

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          if (a.z < 0 || b.z < 0) continue;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist > radius * 0.85) continue;
          const pulse = 0.35 + 0.25 * Math.sin(t * 3 + i + j);
          ctx.strokeStyle = `rgba(34,211,238,${pulse * (1 - dist / (radius * 0.85)) * 0.35})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const p of projected) {
        if (p.z < 0) continue;
        ctx.fillStyle = `rgba(103,232,249,${0.35 + p.z * 0.45})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 + p.s * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Depth-of-field vignette
      const vignette = ctx.createRadialGradient(
        W * 0.5,
        H * 0.45,
        Math.min(W, H) * 0.15,
        W * 0.5,
        H * 0.5,
        Math.max(W, H) * 0.85
      );
      vignette.addColorStop(0, "rgba(3,8,16,0)");
      vignette.addColorStop(0.55, "rgba(3,8,16,0.15)");
      vignette.addColorStop(1, "rgba(3,8,16,0.72)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      // Holographic scan lines
      if (!reduce) {
        ctx.fillStyle = "rgba(34,211,238,0.03)";
        for (let y = (t * 40) % 6; y < H; y += 6) {
          ctx.fillRect(0, y, W, 1);
        }
      }

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
