/** Client-side rules for when a homepage visit should increment the global counter. */

const COUNTED_LOAD_PREFIX = "stats:home-counted-load:";
const SESSION_COUNTED_KEY = "stats:home-session-counted";

function countedLoadKey(): string {
  return COUNTED_LOAD_PREFIX + performance.timeOrigin;
}

function alreadyCountedThisLoad(): boolean {
  return Boolean(sessionStorage.getItem(countedLoadKey()));
}

function markCountedThisLoad(): void {
  sessionStorage.setItem(countedLoadKey(), "1");
}

/**
 * Count a visit only when the homepage is reached via a full page load:
 * - refresh on `/`
 * - first open of the site on `/` in a new tab/session
 *
 * Does NOT count client-side navigation to `/` (e.g. clicking nav tabs).
 */
export function shouldCountHomeVisit(
  initialPath: string,
  currentPath: string
): boolean {
  if (currentPath !== "/") return false;
  if (alreadyCountedThisLoad()) return false;

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const navType = nav?.type;

  if (navType === "reload") return true;

  if (navType === "navigate" && initialPath === "/") {
    return !sessionStorage.getItem(SESSION_COUNTED_KEY);
  }

  return false;
}

export function markHomeVisitCounted(): void {
  markCountedThisLoad();
  sessionStorage.setItem(SESSION_COUNTED_KEY, "1");
}
