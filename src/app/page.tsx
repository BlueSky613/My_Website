import Link from "next/link";
import { site } from "@/lib/site";
import { featuredProjects, projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import CursorEffects from "@/components/CursorEffects";
import { recordHomeVisitIfNeeded } from "@/lib/record-home-visit";

export default async function HomePage() {
  await recordHomeVisitIfNeeded();

  return (
    <>
      {/* Cursor smoke trail + click ripple/fireworks — Home page only */}
      <CursorEffects />

      <section className="relative isolate overflow-hidden">
        <div className="container-content relative py-28 sm:py-36 lg:py-44">
          <div className="max-w-3xl">
            <div
              data-tilt
              className="animate-float rounded-2xl border border-black/10 bg-white/50 px-7 py-8 shadow-sm backdrop-blur-md motion-reduce:animate-none sm:px-9 sm:py-10"
            >
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-black sm:text-5xl lg:text-6xl">
                <TextReveal as="span" className="block" text={site.taglines[0]} />
                <TextReveal
                  as="span"
                  className="mt-1 block text-black"
                  text={site.taglines[1]}
                  delay={site.taglines[0].split(" ").length * 90}
                />
              </h1>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-lg text-black/80">
                  {site.intro}
                </p>
              </Reveal>
            </div>

            <Reveal delay={240}>
              <div
                data-tilt
                className="animate-float mt-8 inline-flex flex-wrap gap-3 rounded-2xl border border-black/10 bg-white/50 p-3 shadow-sm backdrop-blur-md motion-reduce:animate-none"
                style={{ animationDelay: "-2.6s" }}
              >
                <Link href="/projects" className="btn-primary">
                  View Projects
                </Link>
                <Link href="/contact" className="btn-ghost">
                  Get in Touch
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-black/10">
        <div className="container-content section">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Selected Work</p>
                <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden text-sm font-medium text-black/70 transition hover:text-black sm:inline"
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

      <section className="relative isolate overflow-hidden border-t border-black/10">
        <div className="container-content section">
          <Reveal>
            <p className="eyebrow mb-3">What I Do</p>
            <h2 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
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
                <div className="card group h-full">
                  <h3 className="text-lg font-semibold text-black transition group-hover:text-black/70">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-black/75">
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
