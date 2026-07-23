import Link from "next/link";
import type { Project } from "@/lib/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const isExternal = Boolean(project.externalUrl);
  const href = project.externalUrl ?? `/projects/${project.slug}`;
  const cta = isExternal ? "Open live viewer" : "View project";

  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ink-muted">
          Project {project.number}
        </span>
        <span className="tag">{project.category}</span>
      </div>

      <h3 className="mt-4 text-lg font-semibold text-ink transition group-hover:text-ink-soft">
        {project.title}
      </h3>
      <p className="mt-1 text-sm text-ink-muted">{project.location}</p>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
        {project.summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>

      <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-ink">
        {cta}
        {isExternal ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          >
            <path
              d="M7 17L17 7M8 7h9v9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="transition group-hover:translate-x-1"
            aria-hidden
          >
            <path
              d="M5 12h14M13 6l6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group card flex h-full flex-col"
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} className="group card flex h-full flex-col">
      {body}
    </Link>
  );
}
