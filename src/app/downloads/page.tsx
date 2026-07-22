import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import DownloadLink from "@/components/DownloadLink";
import Reveal from "@/components/Reveal";
export const metadata: Metadata = { title: "Downloads" };

const files = [
  {
    name: "GIS Capability Summary.pdf",
    desc: "One-page summary of GIS & geological mapping capabilities.",
    href: "/downloads/GIS%20Capability%20Summary.pdf",
  },
  {
    name: "CV.pdf",
    desc: "Full curriculum vitae with detailed experience.",
    href: "/downloads/CV.pdf",
  },
  {
    name: "Kalgoorlie_Report.pdf",
    desc: "Structural control of gold deposits — full project report.",
    href: "/downloads/Kalgoorlie_Report.pdf",
  },
  {
    name: "GIS_Portfolio.pdf",
    desc: "Selected GIS map outputs and project summaries.",
    href: "/downloads/GIS_Portfolio.pdf",
  },
];

export default function DownloadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        title="Resume & Portfolio Files"
        description="Downloadable documents for recruiters and collaborators. (Add the PDF files to /public/downloads/.)"
      />

      <section className="section">
        <div className="container-content grid gap-4 sm:grid-cols-2">
          {files.map((file, i) => (
            <Reveal key={file.href} delay={i * 90} zoom>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/40 transition group-hover:text-black">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </DownloadLink>
            </Reveal>
          ))}
        </div>

        <div className="container-content mt-8">
          <p className="text-sm text-black/55">
            Note: Place the actual PDF files in{" "}
            <code className="font-mono text-black">public/downloads/</code> so
            these links resolve.
          </p>
        </div>
      </section>
    </>
  );
}
