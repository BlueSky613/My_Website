// Shared resume / skills / document content used by Home and Resume pages.

export const resumeSummary = [
  "I am an aspiring GIS and Geological Mapping Specialist with a strong interest in mineral exploration across Western Australia. My work centers on turning raw geoscience data — geological linework, satellite imagery and terrain models — into clear, decision-ready spatial analysis.",
  "My technical background spans the full GIS stack: desktop tools such as QGIS and ArcGIS, spatial databases with PostGIS, and automation with Python (GeoPandas, GDAL). I pair this with remote sensing techniques using Sentinel-2 and Landsat imagery, and DEM-based terrain modeling.",
  "My goal is to contribute to mineral exploration teams by building reproducible spatial workflows that link geology, structure and prospectivity — starting with my study of structural control on gold deposits in the Kalgoorlie region.",
];

export const skillGroups = [
  {
    title: "GIS",
    description:
      "Desktop GIS, spatial databases and cartography for geological mapping and exploration workflows.",
    items: ["QGIS", "ArcGIS", "PostGIS", "GDAL", "GeoPandas"],
  },
  {
    title: "Programming",
    description:
      "Reproducible geospatial automation and data pipelines for repeatable analysis.",
    items: ["Python", "SQL", "PostgreSQL"],
  },
  {
    title: "Remote Sensing",
    description:
      "Multispectral imagery and terrain analysis for surface mapping and alteration detection.",
    items: ["Sentinel-2", "Landsat", "DEM Analysis", "Terrain Modeling"],
  },
  {
    title: "Geology",
    description:
      "Structural and lithological mapping applied to mineral exploration problems.",
    items: [
      "Geological Mapping",
      "Structural Geology",
      "Mineral Exploration",
      "Lithological Analysis",
    ],
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
    name: "CV.pdf",
    desc: "Full curriculum vitae with detailed experience.",
    href: "/downloads/CV.pdf",
    primary: true,
  },
  {
    name: "GIS Capability Summary.pdf",
    desc: "One-page summary of GIS & geological mapping capabilities.",
    href: "/downloads/GIS%20Capability%20Summary.pdf",
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

export const cvHref = "/downloads/CV.pdf";
