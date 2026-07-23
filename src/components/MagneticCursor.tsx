"use client";

import { useEffect, useRef } from "react";

// Site-wide magnetic cursor:
//  - a red/yellow aurora ring follows the pointer
//  - when the pointer nears an interactive element (button / link / [data-magnetic]),
//    the ring is pulled toward that element's center and grows, and the element
//    itself is nudged slightly toward the cursor ("magnetic" attraction)
//  - cards (.card) don't get nudged; instead they TILT around their own center
// Disabled on touch devices and when the user prefers reduced motion.

const SELECTOR =
  "a, button, [role='button'], input[type='submit'], .btn, .btn-primary, .btn-ghost, [data-magnetic]";

const RADIUS = 90;
const MAX_TILT = 9;

export default function MagneticCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || touch) return;

    const ring = ringRef.current;
    if (!ring) return;

    document.documentElement.classList.add("has-magnetic-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    let pulled: HTMLElement | null = null;
    let tiltedCard: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const resetCard = (el: HTMLElement) => {
      el.style.transition = "transform 350ms ease-out";
      el.style.transform = "";
    };

    const tiltCard = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const px = (mouseX - r.left) / r.width;
      const py = (mouseY - r.top) / r.height;
      const rotateY = (px - 0.5) * 2 * MAX_TILT;
      const rotateX = -(py - 0.5) * 2 * MAX_TILT;
      el.style.transition = "transform 120ms ease-out";
      el.style.transformStyle = "preserve-3d";
      el.style.willChange = "transform";
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    };

    const nearestTarget = (): { el: HTMLElement; cx: number; cy: number; d: number } | null => {
      const node = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const el = node?.closest(SELECTOR) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(mouseX - cx, mouseY - cy);
      const reach = Math.max(r.width, r.height) / 2 + RADIUS;
      if (d > reach) return null;
      return { el, cx, cy, d };
    };

    const tick = () => {
      const target = nearestTarget();

      const node = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      const card =
        (node?.closest(".card, [data-tilt]") as HTMLElement | null) ?? null;

      if (tiltedCard && tiltedCard !== card) {
        resetCard(tiltedCard);
        tiltedCard = null;
      }
      if (card) {
        tiltCard(card);
        tiltedCard = card;
      }

      const nudgeTarget =
        target &&
        !target.el.classList.contains("card") &&
        !target.el.hasAttribute("data-tilt")
          ? target
          : null;
      if (pulled && (!nudgeTarget || nudgeTarget.el !== pulled)) {
        pulled.style.transform = "";
        pulled.style.transition = "transform 250ms ease-out";
        pulled = null;
      }

      let destX = mouseX;
      let destY = mouseY;
      let scale = 1;

      if (target) {
        const reach =
          Math.max(
            target.el.getBoundingClientRect().width,
            target.el.getBoundingClientRect().height,
          ) /
            2 +
          RADIUS;
        const pull = 1 - Math.min(target.d / reach, 1);
        destX = mouseX + (target.cx - mouseX) * pull * 0.6;
        destY = mouseY + (target.cy - mouseY) * pull * 0.6;
        scale = 1 + pull * 1.4;

        if (nudgeTarget) {
          const nudge = 0.22 * pull;
          nudgeTarget.el.style.transition = "transform 120ms ease-out";
          nudgeTarget.el.style.transform = `translate(${(mouseX - nudgeTarget.cx) * nudge}px, ${(mouseY - nudgeTarget.cy) * nudge}px)`;
          pulled = nudgeTarget.el;
        }
      }

      ringX += (destX - ringX) * 0.2;
      ringY += (destY - ringY) * 0.2;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) scale(${scale})`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      if (pulled) pulled.style.transform = "";
      if (tiltedCard) tiltedCard.style.transform = "";
      document.documentElement.classList.remove("has-magnetic-cursor");
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="cursor-aurora-ring pointer-events-none fixed left-0 top-0 z-[65] will-change-transform"
    >
      <span className="cursor-aurora-ring__glow" />
      <span className="cursor-aurora-ring__band" />
    </div>
  );
}
