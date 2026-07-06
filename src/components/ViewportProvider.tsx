"use client";

import { useEffect } from "react";
import { getViewportCase } from "@/lib/viewport";

const CASE_CLASSES = [
  "viewport-default",
  "viewport-narrow",
  "viewport-short",
  "viewport-compact",
] as const;

/**
 * Syncs viewport case onto <html> as data-viewport + utility classes so CSS
 * and DevTools can target narrow (≤1000px), short (≤600px), and compact cases.
 */
export default function ViewportProvider() {
  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const viewportCase = getViewportCase(
        window.innerWidth,
        window.innerHeight
      );

      root.dataset.viewport = viewportCase;
      for (const cls of CASE_CLASSES) root.classList.remove(cls);
      root.classList.add(`viewport-${viewportCase}`);
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  return null;
}
