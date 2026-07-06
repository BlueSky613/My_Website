/** Client-side rules for when a homepage visit should increment the global counter. */

const SESSION_COUNTED_KEY = "stats:home-session-counted";

/** Per hard page load — survives React Strict Mode remounts in dev. */
const loadVisitState = new Map<number, "pending" | "done">();

function loadId(): number {
  return performance.timeOrigin;
}

function isHardHomeLoad(initialPath: string, currentPath: string): boolean {
  if (currentPath !== "/") return false;

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const navType = nav?.type;

  if (navType === "reload") return true;

  if (navType === "navigate" && initialPath === "/") {
    return !sessionStorage.getItem(SESSION_COUNTED_KEY);
  }

  // Some browsers / embeds omit navigation timing — treat first paint on `/` as a hard load.
  if (!navType && initialPath === "/") {
    return !sessionStorage.getItem(SESSION_COUNTED_KEY);
  }

  return false;
}

/**
 * Whether this page load should POST /api/counters/visit.
 * Dedupes React Strict Mode double-mounts without blocking retry after a failed POST.
 */
export function shouldCountHomeVisit(
  initialPath: string,
  currentPath: string
): boolean {
  if (!isHardHomeLoad(initialPath, currentPath)) return false;

  const state = loadVisitState.get(loadId());
  return state !== "pending" && state !== "done";
}

export function markHomeVisitPending(): void {
  loadVisitState.set(loadId(), "pending");
}

export function markHomeVisitCounted(): void {
  loadVisitState.set(loadId(), "done");
  sessionStorage.setItem(SESSION_COUNTED_KEY, "1");
}

export function clearHomeVisitPending(): void {
  const id = loadId();
  if (loadVisitState.get(id) === "pending") {
    loadVisitState.delete(id);
  }
}
