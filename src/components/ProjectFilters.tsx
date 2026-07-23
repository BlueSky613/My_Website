"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";

export default function ProjectFilters({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(set).sort()];
  }, [projects]);

  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const selected = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                selected
                  ? "border-ink bg-ink text-surface"
                  : "border-line/20 bg-surface-card text-ink hover:border-line/40"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <Reveal key={project.slug} delay={i * 80} zoom className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-sm text-ink-muted">No projects in this category.</p>
      )}
    </div>
  );
}
