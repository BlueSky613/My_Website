"use client";

import { useEffect, useState } from "react";
import {
  getViewportFlags,
  VIEWPORT_MEDIA,
  type ViewportCase,
} from "@/lib/viewport";

export type ViewportState = {
  width: number;
  height: number;
  case: ViewportCase;
  isNarrow: boolean;
  isShort: boolean;
  isCompact: boolean;
};

const DEFAULT_STATE: ViewportState = {
  width: 0,
  height: 0,
  case: "default",
  isNarrow: false,
  isShort: false,
  isCompact: false,
};

function readViewport(): ViewportState {
  return getViewportFlags(window.innerWidth, window.innerHeight);
}

/** Live viewport dimensions and case flags (narrow / short / compact). */
export function useViewport(): ViewportState {
  const [state, setState] = useState<ViewportState>(DEFAULT_STATE);

  useEffect(() => {
    const sync = () => setState(readViewport());
    sync();

    const queries = Object.values(VIEWPORT_MEDIA).map((query) =>
      window.matchMedia(query)
    );

    const onChange = () => sync();
    for (const mq of queries) mq.addEventListener("change", onChange);
    window.addEventListener("resize", onChange, { passive: true });

    return () => {
      for (const mq of queries) mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return state;
}
