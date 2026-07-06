"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Fixed tilt on the right with slow auto-rotation; scales with viewport.
// Hover speeds rotation; click navigates to contact. Reduced-motion safe.

const LAT_LINES = 10;
const LON_LINES = 18;
const STREAM_COUNT = 84;
const GLOBE_ROT_Y = 0.55;
const GLOBE_ROT_X = 0.32;
const GLOBE_SPIN_SPEED = 0.07;
const GLOBE_HOVER_SPIN_MUL = 3;
const GLOBE_HOVER_ZOOM = 1.22;
const GLOBE_RADIUS_FACTOR = 0.28 * 1.3;

export const DIGITAL_GLOBE_HOVER_EVENT = "digital-globe-hover";

type Stream = {
  x: number;
  y: number;
  speed: number;
  gap: number;
  phase: number;
  chars: string[];
};

type NetNode = { lat: number; lon: number };
type Connection = { from: number; to: number };

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

function buildConnectionChain(count: number): Connection[] {
  const chain: Connection[] = [];
  const used = new Set<number>();
  let current = 0;
  used.add(0);

  while (used.size < count) {
    let best = -1;
    let bestDist = Infinity;
    const a = current;
    for (let b = 0; b < count; b++) {
      if (used.has(b)) continue;
      const d = Math.abs(a - b) + Math.random() * 2.5;
      if (d < bestDist) {
        bestDist = d;
        best = b;
      }
    }
    if (best < 0) {
      for (let b = 0; b < count; b++) {
        if (!used.has(b)) {
          best = b;
          break;
        }
      }
    }
    if (best < 0) break;
    chain.push({ from: current, to: best });
    used.add(best);
    current = best;
  }

  if (count > 2) chain.push({ from: current, to: 0 });
  return chain;
}

function getGlobeMetrics(w: number, h: number) {
  const dim = Math.min(w, h);
  const radius = dim * GLOBE_RADIUS_FACTOR;
  return {
    radius,
    globeX: w * 0.74,
    globeY: h * 0.52,
  };
}

function hitGlobe(
  px: number,
  py: number,
  w: number,
  h: number,
  pad = 1.05
) {
  const { radius, globeX, globeY } = getGlobeMetrics(w, h);
  return Math.hypot(px - globeX, py - globeY) <= radius * pad;
}

export default function DigitalGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

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
    for (let i = 0; i < STREAM_COUNT; i++) {
      streams.push({
        x: 0,
        y: 0,
        speed: 0.6 + Math.random() * 1.4,
        gap: 28 + Math.random() * 20,
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

    const connections = buildConnectionChain(netNodes.length);
    let connIndex = 0;
    let connPhase = 0;

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

    let t = 0;
    let raf = 0;
    let overGlobe = false;
    let pointerX = 0;
    let pointerY = 0;
    let globeZoom = 1;

    const pointerInGlobe = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = clientX - rect.left;
      pointerY = clientY - rect.top;
      return hitGlobe(pointerX, pointerY, W, H);
    };

    const onMove = (e: MouseEvent) => {
      const wasOver = overGlobe;
      overGlobe = pointerInGlobe(e.clientX, e.clientY);
      if (overGlobe !== wasOver) {
        window.dispatchEvent(
          new CustomEvent(DIGITAL_GLOBE_HOVER_EVENT, { detail: { active: overGlobe } })
        );
      }
    };

    const onClick = (e: MouseEvent) => {
      if (pointerInGlobe(e.clientX, e.clientY)) {
        router.push("/contact");
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick);

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

      const glow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.35);
      glow.addColorStop(0, "rgba(34,211,238,0.18)");
      glow.addColorStop(0.55, "rgba(14,116,144,0.08)");
      glow.addColorStop(1, "rgba(14,116,144,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(103,232,249,0.55)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.98, 0, Math.PI * 2);
      ctx.stroke();
    };

    const draw = () => {
      const spinMul = overGlobe ? GLOBE_HOVER_SPIN_MUL : 1;
      t += 0.008 * spinMul;

      const targetZoom = overGlobe ? GLOBE_HOVER_ZOOM : 1;
      globeZoom += (targetZoom - globeZoom) * 0.09;
      ctx.clearRect(0, 0, W, H);

      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, "#040a14");
      bg.addColorStop(0.45, "#061828");
      bg.addColorStop(1, "#030810");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const { radius, globeX, globeY } = getGlobeMetrics(W, H);
      const zoomedRadius = radius * globeZoom;
      const focalPull = overGlobe ? Math.min(0.14, (globeZoom - 1) * 0.65) : 0;
      const drawGlobeX = globeX + (pointerX - globeX) * focalPull;
      const drawGlobeY = globeY + (pointerY - globeY) * focalPull;
      const rotY = GLOBE_ROT_Y + (reduce ? 0 : t * GLOBE_SPIN_SPEED);
      const rotX = GLOBE_ROT_X;

      ctx.font = "20px var(--font-mono, monospace)";
      ctx.textAlign = "center";
      for (const s of streams) {
        if (!reduce) s.y += s.speed;
        if (s.y > H * 0.72) {
          s.y = -s.gap * s.chars.length;
          s.x = Math.random() * W;
        }
        for (let i = 0; i < s.chars.length; i++) {
          const yy = s.y - i * s.gap;
          if (yy < -24 || yy > H * 0.75) continue;
          const head = i === 0;
          const fade = Math.max(0, 1 - yy / (H * 0.7));
          ctx.fillStyle = head
            ? `rgba(186,230,253,${0.75 * fade})`
            : `rgba(34,211,238,${(0.08 + i * 0.02) * fade})`;
          ctx.fillText(s.chars[i], s.x, yy + s.phase);
        }
      }

      drawGlobe(drawGlobeX, drawGlobeY, zoomedRadius, rotY, rotX);

      const projected = netNodes.map((n) =>
        project(spherePoint(n.lat, n.lon, rotY, rotX), drawGlobeX, drawGlobeY, zoomedRadius)
      );

      if (!reduce && connections.length > 0) {
        connPhase += 0.012;
        if (connPhase >= 1) {
          connPhase = 0;
          connIndex = (connIndex + 1) % connections.length;
        }
      }

      const pulse = Math.sin(connPhase * Math.PI);
      const active = connections[connIndex];
      const nodePulse = new Float32Array(projected.length);

      if (active && !reduce) {
        const a = projected[active.from];
        const b = projected[active.to];
        if (a.z >= 0 && b.z >= 0) {
          const drawT = Math.min(1, connPhase * 2);
          const lx = a.x + (b.x - a.x) * drawT;
          const ly = a.y + (b.y - a.y) * drawT;

          ctx.strokeStyle = `rgba(103,232,249,${0.25 + pulse * 0.65})`;
          ctx.lineWidth = 0.8 + pulse * 1.4;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(lx, ly);
          ctx.stroke();

          nodePulse[active.from] = pulse;
          nodePulse[active.to] = pulse;
        }
      }

      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        if (p.z < 0) continue;
        const boost = nodePulse[i] || 0;
        const baseR = 1.2 + p.s * 1.5;
        const r = baseR * (1 + boost * 1.8);
        const alpha = 0.35 + p.z * 0.45 + boost * 0.55;
        ctx.fillStyle = `rgba(${103 + boost * 80},${232 + boost * 20},${249},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (boost > 0.15) {
          const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2);
          halo.addColorStop(0, `rgba(186,230,253,${boost * 0.45})`);
          halo.addColorStop(1, "rgba(186,230,253,0)");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

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
      window.removeEventListener("click", onClick);
      window.dispatchEvent(
        new CustomEvent(DIGITAL_GLOBE_HOVER_EVENT, { detail: { active: false } })
      );
      cancelAnimationFrame(raf);
    };
  }, [router]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Rotating globe. Click to open the contact page."
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
