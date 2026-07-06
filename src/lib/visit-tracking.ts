/** Client-side rules for when a homepage visit should increment the global counter. */

/** Per document load — dedupes React Strict Mode remounts within the same page load. */
const loadVisitState = new Map<number, "pending" | "done">();

function loadId(): number {
  return performance.timeOrigin;
}

/**
 * Count a homepage visit only on a full document load of `/`:
 * - refresh while on `/` (new performance.timeOrigin each time)
 * - first open of the site directly on `/`
 *
 * Does NOT count client-side navigation to `/` after landing on another page.
 */
export function shouldCountHomeVisit(
  initialPath: string,
  currentPath: string
): boolean {
  if (currentPath !== "/") return false;

  const state = loadVisitState.get(loadId());
  if (state === "pending" || state === "done") return false;

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  // Explicit browser reload of the homepage.
  if (nav?.type === "reload") return true;

  // First paint of this document was the homepage (not a later SPA hop to /).
  return initialPath === "/";
}

export function markHomeVisitPending(): void {
  loadVisitState.set(loadId(), "pending");
}

export function markHomeVisitCounted(): void {
  loadVisitState.set(loadId(), "done");
}

export function clearHomeVisitPending(): void {
  const id = loadId();
  if (loadVisitState.get(id) === "pending") {
    loadVisitState.delete(id);
  }
}
