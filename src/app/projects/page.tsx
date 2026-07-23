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
        description="Structural analysis, remote sensing, and interactive 3D geological viewers from applied geospatial software work."
      />

      <section className="section">
        <div className="container-content">
          <ProjectFilters projects={projects} />
        </div>
      </section>
    </>
  );
}
