import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SatelliteCursor from "@/components/SatelliteCursor";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <>
      <SatelliteCursor />

      <PageHeader
        eyebrow="Projects"
        title="GIS & Geology Projects"
        description="Spatial analysis projects spanning structural geology, remote sensing, DEM analysis and Python automation."
      />

      <section className="section">
        <div className="container-content grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 100} zoom>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
