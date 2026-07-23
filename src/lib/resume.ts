// Resume content summarized from chunyang.pdf (ChunYang Lou CV).

export const resumeName = "ChunYang Lou";

export const resumeHeadline =
  "Geospatial Software Engineer | GIS, Remote Sensing & 3D Geological Modeling";

export const resumeSummary = [
  "Geospatial Software Engineer with five years of applied experience across 3D geological modeling, GIS, remote sensing, AI-assisted geospatial analysis, and WebGIS platform development.",
  "Works with authoritative geoscience workflows—GOCAD/SKUA-style objects, drillhole and subsurface data, lithological domains, terrain models, imagery, PostGIS databases, and interactive 2D/3D web visualization—translating geological concepts into reproducible software with strong provenance, QA/QC, and coordinate integrity.",
];

export const skillGroups = [
  {
    title: "3D Geological Modeling",
    description:
      "Implicit surfaces, lithological domains, fault and stratigraphy surfaces, sections, and block-model concepts.",
    items: [
      "SKUA-GOCAD",
      "Leapfrog Geo",
      "Petrel",
      "Move",
      "Cross-sections",
      "Fence diagrams",
    ],
  },
  {
    title: "GIS & Spatial Analysis",
    description:
      "Cartography, georeferencing, coordinate systems, overlays, catchment analysis, and topology QA/QC.",
    items: [
      "ArcGIS Pro",
      "ArcMap",
      "QGIS",
      "ArcGIS Online",
      "Spatial joins",
      "Topology QA/QC",
    ],
  },
  {
    title: "Remote Sensing & Terrain",
    description:
      "Satellite and aerial imagery, LiDAR, DEM products, and multitemporal change detection.",
    items: [
      "ENVI",
      "ERDAS Imagine",
      "LiDAR",
      "DEM/DSM",
      "DEM-of-Difference",
      "Change detection",
    ],
  },
  {
    title: "Full Stack / WebGIS",
    description:
      "Interactive maps, dashboards, and browser 3D viewers for geoscience products.",
    items: [
      "React",
      "TypeScript",
      "Python",
      "vtk.js / WebGL",
      "Mapbox / Leaflet",
      "Vite / Vercel",
    ],
  },
  {
    title: "Databases & Cloud",
    description:
      "Spatial databases, ETL, metadata, indexing, and reproducible data packages.",
    items: [
      "PostgreSQL / PostGIS",
      "SQL Server",
      "ETL",
      "Spatial indexing",
      "Metadata",
    ],
  },
  {
    title: "AI & Data Science",
    description:
      "Geospatial QA, feature extraction concepts, and geostatistical interpolation.",
    items: [
      "NumPy / Pandas",
      "GeoPandas",
      "rasterio",
      "Kriging",
      "Variography",
      "ML fundamentals",
    ],
  },
];

export type ExperienceRole = {
  company: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
};

export const experience: ExperienceRole[] = [
  {
    company: "NV5 Geospatial",
    location: "Lakewood, CO",
    title: "Full Stack Software Engineer & WebGIS Developer",
    period: "Aug 2025 – Mar 2026",
    bullets: [
      "Built WebGIS and geospatial analysis workflows for LiDAR terrain, river-corridor mapping, remote sensing, and natural-resource projects.",
      "Developed reproducible Python and TypeScript pipelines for DEM processing, imagery prep, spatial QA/QC, and product delivery.",
      "Designed interactive maps and dashboards with ArcGIS Online, Mapbox/Leaflet patterns, and PostGIS-backed datasets.",
      "Integrated LiDAR, DEMs, aerial/satellite imagery, GPS, and survey data under controlled coordinate reference systems.",
      "Automated batch processing, validation, map production, and metadata generation across multitemporal datasets.",
    ],
  },
  {
    company: "Mira Geoscience",
    location: "Montreal, QC",
    title: "Geologist & 3D Geological Modeler",
    period: "Apr 2023 – Jun 2025",
    bullets: [
      "Built 3D geological models in Leapfrog Geo, SKUA-GOCAD, and Move—implicit surfaces, lithological domains, and sediment-body interpretations.",
      "Integrated drillhole, core, geochemical, geophysical, survey, and remote-sensing data into unified spatial databases.",
      "Delivered cross-sections, fence diagrams, and surface/solid models for structure, stratigraphy, and mining materials.",
      "Applied variography and kriging to interpolate properties and define spatial domains.",
      "Enforced rigorous QA/QC on collars, surveys, lithology, assays, geometry, CRS, and provenance before delivery.",
    ],
  },
  {
    company: "SRK Consulting",
    location: "Vancouver, BC",
    title: "Geologist / GIS Analyst",
    period: "Feb 2022 – Jan 2023",
    bullets: [
      "Supported mining, environmental, and water projects with geological interpretation, GIS analysis, and spatial data management.",
      "Mapped lithology, sediment, tailings, disturbance, catchments, and floodplains for environmental assessment.",
      "Digitized and georeferenced historical maps and aerial photos to reconstruct channel and land-use change.",
      "Prepared thematic maps, figures, and technical deliverables; automated repetitive geoprocessing with Python.",
    ],
  },
];

export const selectedProjects = [
  {
    title: "3D Geological Web Viewer & Section-Ready Data Package",
    body: "Workflow separating backend geological computation from browser display—lithology policy, fault/stratigraphy overlays, section metadata, and fail-closed visualization contracts.",
  },
  {
    title: "Remote-Sensing Change Detection",
    body: "Multitemporal imagery, DEMs, and LiDAR to identify terrain change, disturbance, channel migration, and environmental impacts.",
  },
  {
    title: "Subsurface Data Integration",
    body: "Drillhole, core, geological, geochemical, geophysical, and survey data into coherent 3D models with explicit provenance and QA/QC.",
  },
  {
    title: "WebGIS Decision Support",
    body: "Interactive maps, dashboards, and geospatial packages for technical and non-technical stakeholders—clarity, performance, reproducibility.",
  },
];

export const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    school: "Columbia University, Columbia Engineering — New York, NY",
    period: "2018 – 2021",
  },
  {
    degree: "Bachelor of Science in Geosciences, Geology Emphasis",
    school: "University of Arizona — Tucson, AZ",
    period: "2014 – 2018",
  },
];

/** Compact expertise cards for the home page (from chunyang.pdf Technical Skills). */
export const expertiseAreas = [
  {
    title: "3D Geological Modeling",
    description:
      "SKUA-GOCAD, Leapfrog Geo, Petrel and Move — implicit surfaces, lithological domains, fault/stratigraphy surfaces, cross-sections and fence diagrams.",
  },
  {
    title: "GIS & Spatial Analysis",
    description:
      "ArcGIS Pro, ArcMap, QGIS and ArcGIS Online — cartography, georeferencing, coordinate systems, spatial joins, overlay analysis and topology QA/QC.",
  },
  {
    title: "Remote Sensing & Terrain",
    description:
      "ENVI, ERDAS Imagine, satellite and aerial imagery, LiDAR, DEM/DSM, hillshade, slope, DEM-of-Difference and change detection.",
  },
];

export const documents = [
  {
    name: "ChunYang_Lou_CV.pdf",
    desc: "Full curriculum vitae — experience, skills, projects, and education.",
    href: "/downloads/ChunYang_Lou_CV.pdf",
    primary: true,
  },
];

export const cvHref = "/downloads/ChunYang_Lou_CV.pdf";
