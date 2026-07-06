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
- [x] **Stats badge stuck on "—" in dev** — React Strict Mode remount skipped the stats fetch; badge now always refreshes totals on mount even when visit POST is deduped.
- [x] **Visit count on every tab click** — Visits now increment only on homepage hard loads (refresh or new tab/session), not on client-side nav between pages.
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

## Stats counters — root causes when broken

| Symptom | Cause | Fix |
|---------|-------|-----|
| Badge shows **"—"** | API failed or Strict Mode skipped fetch (fixed in code) | Redeploy; check browser Network tab for `/api/stats` |
| Counts stay at **0** or reset | **No Redis on Vercel** — file storage is ephemeral on serverless | Add Upstash Redis integration (below) |
| Counts work locally, not in production | `.env.local` has no Redis vars; local uses `.data/stats.json` | Connect Redis to Vercel project + redeploy |
| Railway deploy resets counts | No Volume or `STATS_DIR` not set | Attach Volume at `/data`, set `STATS_DIR=/data` |

## Vercel setup (stats) — required for production

1. Vercel project → **Storage** → add **Upstash Redis**
2. Connect to the project (injects `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)
3. **Redeploy** (env vars only apply after redeploy)

See `.env.local.example` for local Redis credentials (`vercel env pull` to sync).
