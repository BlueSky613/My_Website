import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { featuredProjects, projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import HeroSlideshow from "@/components/HeroSlideshow";
import Reveal from "@/components/Reveal";

export default function HomePage() {
  return (
    <>
      {/* Hero — full-bleed background slideshow (4 cross-fading images) */}
      <section className="relative isolate overflow-hidden">
        {/* Rotating background images */}
        <HeroSlideshow />
        {/* Light overlay — keeps the image vivid while softening it behind text */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-rock-950/75 via-rock-950/30 to-transparent"
        />

        <div className="container-content relative py-28 sm:py-36 lg:py-44">
          <div className="max-w-3xl">
            <Reveal>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-rock-50 drop-shadow sm:text-5xl lg:text-6xl">
                {site.taglines[0]}
                <span className="mt-1 block text-gradient drop-shadow-none">
                  {site.taglines[1]}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-lg text-rock-200 drop-shadow">
                {site.intro}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/projects" className="btn-primary">
                  View Projects
                </Link>
                <Link href="/contact" className="btn-ghost bg-rock-950/40 backdrop-blur">
                  Get in Touch
                </Link>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <div className="mt-8 flex items-center gap-4 text-sm text-rock-200">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyber-400 shadow-glow-cyber" />
                  {site.location}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured projects — Kalgoorlie map as background */}
      <section className="relative isolate overflow-hidden border-t border-cyber-400/10">
        {/* Background image */}
        <Image
          src="/images/featured-projects-bg.png"
          alt="Satellite, global network and terrain data visualization"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Light overlay — let the artwork show through */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-rock-950/45"
        />

        <div className="container-content section">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Selected Work</p>
                <h2 className="text-2xl font-bold tracking-tight text-rock-50 drop-shadow sm:text-3xl">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden text-sm font-medium text-cyber-300 transition hover:text-cyber-400 sm:inline"
              >
                All projects →
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredProjects.length ? featuredProjects : projects)
              .slice(0, 3)
              .map((project, i) => (
                <Reveal key={project.slug} delay={i * 120} zoom>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
          </div>
        </div>
      </section>

      {/* Focus areas — Python/GIS stack as background */}
      <section className="relative isolate overflow-hidden border-t border-cyber-400/10">
        {/* Background image */}
        <Image
          src="/images/python-gis-stack.png"
          alt="Python connecting ArcGIS and QGIS in a geospatial data processing stack"
          fill
          sizes="100vw"
          className="-z-10 object-cover"
        />
        {/* Light overlay — let the tooling artwork show through */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-rock-950/40"
        />

        <div className="container-content section">
          <Reveal>
            <p className="eyebrow mb-3">What I Do</p>
            <h2 className="text-2xl font-bold tracking-tight text-rock-50 drop-shadow sm:text-3xl">
              Spatial analysis for the resources sector
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Geological Mapping",
                desc: "Lithological and structural mapping using QGIS, ArcGIS and field-ready GIS workflows.",
              },
              {
                title: "Remote Sensing",
                desc: "Sentinel-2 and Landsat band ratios, DEM/terrain analysis and alteration mapping.",
              },
              {
                title: "Spatial Automation",
                desc: "Reproducible Python (GeoPandas, GDAL) and PostGIS pipelines for repeatable analysis.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120} zoom>
                <div className="card group h-full bg-rock-900/70 backdrop-blur">
                  <h3 className="text-lg font-semibold text-rock-50 transition group-hover:text-cyber-300">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-rock-200">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
