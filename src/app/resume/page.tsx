import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import DownloadLink from "@/components/DownloadLink";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { cvHref, documents, resumeSummary, skillGroups } from "@/lib/resume";

export const metadata: Metadata = { title: "Resume" };

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title={site.name}
        description={`${site.role} · ${site.taglines[0]}`}
      />

      <section className="section">
        <div className="container-content max-w-3xl space-y-14">
          {/* Profile + Download */}
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm text-black/60">{site.location}</p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 block text-sm text-black link-underline"
                >
                  {site.email}
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
            <h2 className="text-xl font-bold text-black">Summary</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-black/80">
              {resumeSummary.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          </Reveal>

          {/* Technical Skills */}
          <Reveal delay={120}>
            <h2 className="text-xl font-bold text-black">Technical Skills</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {skillGroups.map((group) => (
                <div key={group.title} className="card">
                  <h3 className="font-semibold text-black">{group.title}</h3>
                  <p className="mt-2 text-sm text-black/65">{group.description}</p>
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

          {/* Documents */}
          <Reveal delay={160}>
            <h2 className="text-xl font-bold text-black">Documents</h2>
            <p className="mt-2 text-sm text-black/65">
              Detailed experience and project reports are in the PDF downloads.
              For a full CV, use Download PDF above.
            </p>
            <ul className="mt-6 space-y-3">
              {documents.map((file) => (
                <li key={file.href}>
                  <DownloadLink
                    href={file.href}
                    className="group card flex items-center gap-4"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-black text-white">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
                        <path d="M14 2v6h6" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-black group-hover:text-black/70">
                        {file.name}
                      </p>
                      <p className="mt-0.5 text-sm text-black/60">{file.desc}</p>
                    </div>
                  </DownloadLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-sm text-black/55">
              Prefer to talk first?{" "}
              <Link href="/#contact" className="link-underline text-black">
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
