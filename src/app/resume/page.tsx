import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import DownloadLink from "@/components/DownloadLink";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import {
  cvHref,
  documents,
  education,
  experience,
  resumeHeadline,
  resumeName,
  resumeSummary,
  selectedProjects,
  skillGroups,
} from "@/lib/resume";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title={resumeName}
        description={resumeHeadline}
      />

      <section className="section">
        <div className="container-content max-w-3xl space-y-14">
          {/* Profile + Download */}
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1 text-sm text-ink-muted">
                <p>{site.location}</p>
                <a
                  href={`mailto:${site.email}`}
                  className="block text-ink link-underline"
                >
                  {site.email}
                </a>
                {site.phone && <p>{site.phone}</p>}
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-ink link-underline"
                >
                  LinkedIn
                </a>
              </div>
              <DownloadLink href={cvHref} className="btn-primary shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download PDF
              </DownloadLink>
            </div>
          </Reveal>

          {/* Summary */}
          <Reveal delay={80}>
            <h2 className="text-xl font-bold text-ink">Summary</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
              {resumeSummary.map((para) => (
                <p key={para.slice(0, 48)}>{para}</p>
              ))}
            </div>
          </Reveal>

          {/* Technical Skills */}
          <Reveal delay={100}>
            <h2 className="text-xl font-bold text-ink">Technical Skills</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.title} className="card">
                  <h3 className="font-semibold text-ink">{group.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{group.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li key={item} className="tag">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Experience */}
          <Reveal delay={120}>
            <h2 className="text-xl font-bold text-ink">Professional Experience</h2>
            <div className="mt-6 space-y-10">
              {experience.map((role) => (
                <article key={`${role.company}-${role.period}`}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-semibold text-ink">{role.company}</h3>
                    <p className="font-mono text-xs text-ink-muted">{role.period}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">
                    {role.title}
                    <span className="text-ink-muted"> · {role.location}</span>
                  </p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
                    {role.bullets.map((b) => (
                      <li key={b.slice(0, 56)}>{b}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </Reveal>

          {/* Selected projects */}
          <Reveal delay={140}>
            <h2 className="text-xl font-bold text-ink">Selected Project Experience</h2>
            <ul className="mt-6 space-y-5">
              {selectedProjects.map((p) => (
                <li key={p.title}>
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Education */}
          <Reveal delay={160}>
            <h2 className="text-xl font-bold text-ink">Education</h2>
            <ul className="mt-6 space-y-5">
              {education.map((ed) => (
                <li key={ed.degree}>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-semibold text-ink">{ed.degree}</h3>
                    <p className="font-mono text-xs text-ink-muted">{ed.period}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink-soft">{ed.school}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Documents */}
          <Reveal delay={180}>
            <h2 className="text-xl font-bold text-ink">Documents</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Download the full CV PDF for the complete record.
            </p>
            <ul className="mt-6 space-y-3">
              {documents.map((file) => (
                <li key={file.href}>
                  <DownloadLink
                    href={file.href}
                    className="group card flex items-center gap-4"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-ink text-surface">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                        <path d="M14 2v6h6" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-ink group-hover:text-ink-soft">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-muted">{file.desc}</p>
                    </div>
                  </DownloadLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-sm text-ink-muted">
              Prefer to talk first?{" "}
              <Link href="/#contact" className="link-underline text-ink">
                Get in touch
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
