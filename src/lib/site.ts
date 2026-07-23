// Central site configuration & content.
// Edit values here to update your name, links, and contact details everywhere.

export const site = {
  name: "ChunYang Lou",
  role: "Geospatial Software Engineer",
  taglines: [
    "Geospatial Software Engineer | GIS, Remote Sensing & 3D Geological Modeling",
  ],
  intro:
    "3D geological modeling, GIS, remote sensing, and WebGIS — clear geoscience software teams can ship.",
  location: "New York, NY",
  // Public site URL (Open Graph, metadataBase). Override with NEXT_PUBLIC_SITE_URL if needed.
  url: "https://bluesky613-gis.vercel.app",
  // Email is used for the contact button and form.
  email: "chunyanglou4@gmail.com",
  phone: "+1 (406) 380-3324",
  links: {
    github: "https://github.com/BlueSky613",
    linkedin: "https://www.linkedin.com/in/chunyang-lou-03923741a/",
  },
};

// Two-letter monogram from the name, e.g. "ChunYang Lou" -> "CL".
export const initials = site.name
  .split(/\s+/)
  .map((w) => w[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();

export const nav = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
];
