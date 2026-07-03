"use client";

import { useEffect } from "react";

// Animated browser-tab favicon: draws the satellite and emits radio waves that
// expand outward from the dish each frame, then writes the canvas to the tab
// icon. Throttled to ~15fps to keep it cheap. Honors prefers-reduced-motion
// (renders a single static frame instead of animating).
const SIZE = 64;
// Wave emission origin (fraction of icon) and direction (canvas radians,
// down-left) — tuned to the dish feed on /favicon-satellite.png.
const ORIGIN_X = 0.31;
const ORIGIN_Y = 0.66;
const DIR = 2.5; // ~143°, pointing down-left
const SPREAD = 0.75; // half-angle of each arc
const WAVES = 3;

export default function AnimatedFavicon() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = "/favicon-satellite.png";

    // Dedicated icon link we control; appended last so it wins.
    let link = document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][data-animated]'
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.dataset.animated = "true";
      document.head.appendChild(link);
    }

    const ox = ORIGIN_X * SIZE;
    const oy = ORIGIN_Y * SIZE;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      if (img.complete && img.naturalWidth) {
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
      }
      ctx.lineCap = "round";
      for (let i = 0; i < WAVES; i++) {
        // phase 0..1: a wave is born at the dish and flies outward, fading.
        const phase = ((frame / 22 + i / WAVES) % 1 + 1) % 1;
        const r = 3 + phase * 22;
        const alpha = (1 - phase) * 0.9;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(120,200,255,${alpha})`;
        ctx.lineWidth = 2.2;
        ctx.arc(ox, oy, r, DIR - SPREAD, DIR + SPREAD);
        ctx.stroke();
      }
      link!.href = canvas.toDataURL("image/png");
    };

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let timer: ReturnType<typeof setInterval> | undefined;
    const tick = () => {
      frame += 1;
      render();
    };

    const begin = () => {
      render();
      if (!reduce) timer = setInterval(tick, 66); // ~15fps
    };

    if (img.complete && img.naturalWidth) begin();
    else img.onload = begin;

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  return null;
}
