import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectFilters from "@/components/ProjectFilters";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Projects"
        description="Browse through my collection of GIS and geology projects, including structural analysis, remote sensing and interactive 3D viewers."
      />

      <section className="section">
        <div className="container-content">
          <ProjectFilters projects={projects} />
        </div>
      </section>
    </>
  );
}
