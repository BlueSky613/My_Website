# GIS Portfolio Website

Personal portfolio for a GIS Analyst / Geological Mapping Specialist, built with
**Next.js (App Router) + TypeScript + TailwindCSS**.

Site structure mirrors a simple GIS portfolio IA (Home / Projects / Resume).

## Pages

- `/` — Home (hero, featured project, skills, featured projects, contact)
- `/projects` — Project list with category filters
- `/projects/[slug]` — Project detail
- `/resume` — Resume summary, skills, PDF downloads

Legacy routes redirect: `/about` & `/skills` → `/`, `/downloads` → `/resume`, `/contact` → `/#contact`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm start        # serve the production build
```

## Editing content

- **Name, role, email, social links:** `src/lib/site.ts`
- **Projects (list + detail):** `src/lib/projects.ts`
- **Resume / skills / documents:** `src/lib/resume.ts`
- **Theme colours:** `tailwind.config.ts` / `src/app/globals.css`
- **Downloadable PDFs:** drop files into `public/downloads/`

## Roadmap

1. Portfolio website (this phase) ✅
2. Interactive GIS maps (Leaflet / MapLibre)
3. Python GIS automation showcase
4. PostGIS spatial database platform
5. Mineral exploration GIS consultancy site

## Deploy

Optimised for **Vercel** — push to a Git repo and import the project.
Production URL: https://chunyang-lou-geospatial-software-engineer.vercel.app
(also: https://bluesky613-gis.vercel.app)
