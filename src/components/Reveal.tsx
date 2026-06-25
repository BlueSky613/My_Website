"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Extra classes on the wrapper. */
  className?: string;
  /** Stagger delay in ms before the reveal animation starts. */
  delay?: number;
  /** Direction the element slides in from. */
  from?: "up" | "down" | "left" | "right";
  /** Transition duration in ms. */
  duration?: number;
  /** Add a subtle zoom-in for a more cinematic, storytelling reveal. */
  zoom?: boolean;
  /** Render as a different element (e.g. "section", "li"). Defaults to div. */
  as?: keyof JSX.IntrinsicElements;
};

const OFFSET = 32; // px slide distance

function hiddenTransform(
  from: NonNullable<RevealProps["from"]>,
  zoom: boolean
): string {
  const scale = zoom ? " scale(0.96)" : "";
  switch (from) {
    case "up":
      return `translate3d(0, ${OFFSET}px, 0)${scale}`;
    case "down":
      return `translate3d(0, -${OFFSET}px, 0)${scale}`;
    case "left":
      return `translate3d(${OFFSET}px, 0, 0)${scale}`;
    case "right":
      return `translate3d(-${OFFSET}px, 0, 0)${scale}`;
  }
}

// Fades + slides (and optionally zooms) its children in the first time they
// scroll into view. Honors prefers-reduced-motion (shows content immediately).
export default function Reveal({
  children,
  className = "",
  delay = 0,
  from = "up",
  duration = 700,
  zoom = false,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setReduced(true);
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect(); // reveal once, then stop observing
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  const style: React.CSSProperties = reduced
    ? {}
    : {
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : hiddenTransform(from, zoom),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      };

  return (
    <Tag ref={ref} style={style} className={className}>
      {children}
    </Tag>
  );
}
