import Image from "next/image";
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
      <div aria-hidden className="absolute inset-0 bg-black" />
      <Image
        src="/images/featured-hero-block.png"
        alt=""
        fill
        unoptimized
        priority
        className="object-contain p-6 sm:p-8"
        sizes="(max-width: 1024px) 100vw, 40vw"
      />

      {/* Bottom label */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-6 pb-6 pt-16">
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
