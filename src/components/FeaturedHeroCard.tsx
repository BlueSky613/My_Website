import Link from "next/link";
import type { Project } from "@/lib/projects";

type Props = {
  project: Project;
};

export default function FeaturedHeroCard({ project }: Props) {
  const href = project.externalUrl ?? `/projects/${project.slug}`;
  const external = Boolean(project.externalUrl);

  const inner = (
    <>
      {/* Soft media plane */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-400 dark:from-slate-600 dark:via-slate-700 dark:to-slate-900"
      />

      {/* Compass / globe motif */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center opacity-40"
      >
        <svg
          width="168"
          height="168"
          viewBox="0 0 168 168"
          fill="none"
          className="text-ink/50 dark:text-white/50"
        >
          <circle cx="84" cy="84" r="52" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="84" cy="84" r="34" stroke="currentColor" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = 84 + Math.cos(a) * 38;
            const y1 = 84 + Math.sin(a) * 38;
            const x2 = 84 + Math.cos(a) * 58;
            const y2 = 84 + Math.sin(a) * 58;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
              />
            );
          })}
          {/* Image placeholder icon */}
          <rect
            x="66"
            y="70"
            width="36"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="76" cy="80" r="2.5" fill="currentColor" />
          <path
            d="M70 92l8-8 6 5 8-10 10 13H70z"
            fill="currentColor"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Bottom label */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-6 pb-6 pt-16">
        <p className="flex items-center gap-1.5 text-sm text-white/90">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path
              d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Featured Project
        </p>
        <h2 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl">
          {project.title}
        </h2>
      </div>
    </>
  );

  const className =
    "group relative block aspect-[5/4] w-full overflow-hidden rounded-2xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={`Featured project: ${project.title}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      aria-label={`Featured project: ${project.title}`}
    >
      {inner}
    </Link>
  );
}
