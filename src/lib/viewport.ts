/** Viewport compatibility thresholds for responsive layout work. */
export const VIEWPORT_MAX_WIDTH = 1000;
export const VIEWPORT_MAX_HEIGHT = 600;

/**
 * Four viewport cases used to divide compatibility work:
 * - default — width > 1000 and height > 600
 * - narrow   — width ≤ 1000 only
 * - short    — height ≤ 600 only
 * - compact  — width ≤ 1000 and height ≤ 600
 */
export type ViewportCase = "default" | "narrow" | "short" | "compact";

export const VIEWPORT_MEDIA = {
  narrow: `(max-width: ${VIEWPORT_MAX_WIDTH}px)`,
  short: `(max-height: ${VIEWPORT_MAX_HEIGHT}px)`,
  compact: `(max-width: ${VIEWPORT_MAX_WIDTH}px) and (max-height: ${VIEWPORT_MAX_HEIGHT}px)`,
} as const;

export type ViewportMediaQuery = keyof typeof VIEWPORT_MEDIA;

export function getViewportCase(width: number, height: number): ViewportCase {
  const isNarrow = width <= VIEWPORT_MAX_WIDTH;
  const isShort = height <= VIEWPORT_MAX_HEIGHT;
  if (isNarrow && isShort) return "compact";
  if (isNarrow) return "narrow";
  if (isShort) return "short";
  return "default";
}

export function getViewportFlags(width: number, height: number) {
  const viewportCase = getViewportCase(width, height);
  return {
    width,
    height,
    case: viewportCase,
    isNarrow: width <= VIEWPORT_MAX_WIDTH,
    isShort: height <= VIEWPORT_MAX_HEIGHT,
    isCompact: viewportCase === "compact",
  };
}

export function matchViewport(query: ViewportMediaQuery): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(VIEWPORT_MEDIA[query]).matches;
}

/**
 * Areas to revisit when applying per-case styles (audit list for study):
 *
 * Layout shell
 * - Navbar: fixed left padding for StatsBadge (pl-[130px])
 * - StatsBadge: fixed top-left badge overlaps nav on narrow widths
 * - Footer: constellation artwork + two-column layout
 *
 * Pages
 * - Home hero: large vertical padding (py-28 … lg:py-44), float animations
 * - Home grids: sm:grid-cols-2 lg:grid-cols-3 breakpoints differ from 1000px
 * - About / Contact / Project detail: md:grid-cols sidebars
 *
 * Canvas / effects (JS resize listeners)
 * - MagneticCursor, CursorEffects, ContourLines, DemTerrain
 * - BinaryField, WaterCursor, SatelliteCursor, SatellitePass
 * - Constellations (absolute positioned SVG artwork)
 *
 * Shared utilities
 * - .section (py-16 sm:py-24), .container-content
 */
