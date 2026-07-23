import Link from "next/link";
import { site } from "@/lib/site";
import { featuredProjects, projects } from "@/lib/projects";
import { cvHref, expertiseAreas } from "@/lib/resume";
import ProjectCard from "@/components/ProjectCard";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import TextReveal from "@/components/TextReveal";
import { recordHomeVisitIfNeeded } from "@/lib/record-home-visit";

export default async function HomePage() {
  await recordHomeVisitIfNeeded();

  const highlight =
    (featuredProjects.length ? featuredProjects : projects)[0] ?? null;
  const featuredList = (featuredProjects.length ? featuredProjects : projects).slice(
    0,
    3,
  );
  const highlightHref = highlight
    ? highlight.externalUrl ?? `/projects/${highlight.slug}`
    : "/projects";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-content relative py-28 sm:py-36 lg:py-44">
          <div className="max-w-3xl">
            <div data-tilt className="animate-float motion-reduce:animate-none">
              <p className="mb-4 flex flex-wrap items-baseline font-mono text-[2.8125rem] font-black uppercase leading-none tracking-[0.12em] text-ink sm:text-[3.375rem] lg:text-[4.5rem]">
                <span className="text-[2em] font-black leading-none">G</span>
                <span className="leading-none">eospatial Solutions by ChunYang Lou</span>
              </p>
              <h1 className="text-lg font-normal leading-snug tracking-tight text-ink sm:text-2xl lg:text-3xl">
                <TextReveal as="span" className="block" text={site.taglines[0]} />
              </h1>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-lg text-ink-soft">
                  {site.intro}
                </p>
              </Reveal>
            </div>

            <Reveal delay={240}>
              <div
                data-tilt
                className="animate-float mt-8 inline-flex flex-wrap gap-3 motion-reduce:animate-none"
                style={{ animationDelay: "-2.6s" }}
              >
                <Link href="/projects" className="btn-primary">
                  View Projects
                </Link>
                <Link href="/resume" className="btn-ghost">
                  Resume
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured Project (single highlight) */}
      {highlight && (
        <section className="relative overflow-hidden">
          <div className="container-content section">
            <Reveal>
              <p className="eyebrow mb-3">Featured Project</p>
              <div className="card max-w-3xl">
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {highlight.title}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{highlight.location}</p>
                <p className="mt-4 text-ink-soft leading-relaxed">
                  {highlight.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {highlight.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={highlightHref}
                  {...(highlight.externalUrl
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="btn-primary mt-8"
                >
                  {highlight.externalUrl ? "Open live viewer" : "View project"}
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Expertise / GIS Skills */}
      <section className="relative overflow-hidden">
        <div className="container-content section">
          <Reveal>
            <p className="eyebrow mb-3">Expertise</p>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              GIS Skills &amp; Technologies
            </h2>
            <p className="mt-3 max-w-2xl text-ink-soft">
              Specialized in geological mapping, remote sensing, and reproducible
              spatial analysis for mineral exploration.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {expertiseAreas.map((item, i) => (
              <Reveal key={item.title} delay={i * 120} zoom>
                <div className="card group h-full">
                  <h3 className="text-lg font-semibold text-ink transition group-hover:text-ink-soft">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects grid */}
      <section className="relative overflow-hidden">
        <div className="container-content section">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Selected Work</p>
                <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Featured Projects
                </h2>
                <p className="mt-3 max-w-2xl text-ink-soft">
                  Explore recent GIS projects spanning structural geology, remote
                  sensing and 3D geological modelling.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredList.map((project, i) => (
              <Reveal key={project.slug} delay={i * 120} zoom>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-10">
              <Link href="/projects" className="btn-ghost">
                View All Projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Get in Touch */}
      <section
        id="contact"
        className="relative scroll-mt-24 overflow-hidden"
      >
        <div className="container-content section">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-start">
            <Reveal from="left">
              <p className="eyebrow mb-3">Get in Touch</p>
              <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Interested in working together?
              </h2>
              <p className="mt-4 max-w-xl text-ink-soft leading-relaxed">
                I&apos;m always open to discussing GIS projects, mineral exploration
                collaboration, or opportunities to contribute spatial analysis.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${site.email}`} className="btn-primary">
                  Contact Me
                </a>
                <Link href="/resume" className="btn-ghost">
                  Download Resume
                </Link>
                <a
                  href={cvHref}
                  className="btn-ghost"
                  download
                >
                  CV PDF
                </a>
              </div>
            </Reveal>

            <Reveal from="right" delay={120}>
              <div className="rounded-xl border border-line/10 bg-surface-card p-6 shadow-sm">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
