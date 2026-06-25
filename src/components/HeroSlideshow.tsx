"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Slide = { src: string; alt: string };

const SLIDES: Slide[] = [
  {
    src: "/images/hero-gis-resources.png",
    alt: "Satellite imagery, GIS data management and resource exploration workflow",
  },
  {
    src: "/images/hero-2-australia-geology.png",
    alt: "Geological map of the Australian continent over an open-pit mine",
  },
  {
    src: "/images/hero-3-america-geology.png",
    alt: "Geological map of the American continent with major hydrocarbon basins",
  },
  {
    src: "/images/hero-4-satellite-exploration.png",
    alt: "Satellite-based geological exploration from space over Earth",
  },
];

// Time each slide stays fully visible before fading to the next (ms).
const INTERVAL = 5000;

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {SLIDES.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          // Only the first image needs to load eagerly for the initial paint.
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
