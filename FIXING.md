# Fixing list

Track completed fixes and remaining compatibility work for this portfolio site.

## Viewport cases

| Case | Condition |
|------|-----------|
| `default` | width > 1000px and height > 600px |
| `narrow` | width ≤ 1000px |
| `short` | height ≤ 600px |
| `compact` | width ≤ 1000px and height ≤ 600px |

Tailwind prefixes: `narrow:`, `short:`, `compact:`  
JS hook: `useViewport()` — see `src/lib/viewport.ts`

---

## Done

- [x] **Stats counters on Vercel** — Replaced ephemeral JSON file with Upstash Redis (`@upstash/redis`). Falls back to `.data/stats.json` locally when Redis env vars are unset. Requires Upstash Redis integration in Vercel project settings.
- [x] **Viewport infrastructure** — Breakpoints, `ViewportProvider`, `useViewport` hook, CSS utilities (`only-narrow`, `hide-short`, etc.), and `data-viewport` on `<html>`.
- [x] **Dev server 500 / missing vendor-chunks** — Caused by corrupted `.next` cache (often from multiple `npm run dev` instances). Fix: stop all dev servers, delete `.next`, restart once.

---

## To do — viewport compatibility

### Layout shell
- [ ] **Navbar** — Reduce fixed left padding for StatsBadge (`pl-[130px]`) on `narrow` / `compact`
- [ ] **StatsBadge** — Prevent overlap with nav logo on narrow widths
- [ ] **Footer** — Constellation artwork sizing; two-column layout on `narrow`

### Pages
- [ ] **Home hero** — Reduce vertical padding (`py-28` … `lg:py-44`) on `short` / `compact`; consider disabling float animation on `short`
- [ ] **Home grids** — Align column breakpoints with 1000px (`narrow`) instead of only `sm`/`lg`
- [ ] **About / Contact / Project detail** — Sidebars use `md:` (768px); review at `narrow` (1000px)

### Canvas / effects
- [ ] **MagneticCursor** — Review on touch and compact viewports
- [ ] **CursorEffects** — Home-only; disable or simplify on `short` / `compact`
- [ ] **ContourLines, DemTerrain, BinaryField** — Resize / density on small viewports
- [ ] **WaterCursor, SatelliteCursor, SatellitePass** — Review pointer effects on narrow layouts
- [ ] **Constellations** — Absolute SVG artwork may clip on `short` / `compact`

### Shared utilities
- [ ] **`.section`** — Tighter `py-*` on `short` and `compact`
- [ ] **`.container-content`** — Padding adjustments on `narrow`

---

## Vercel setup (stats)

1. Vercel project → **Storage** → add **Upstash Redis**
2. Connect to the project (injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)
3. Redeploy

See `.env.local.example` for local Redis credentials.
