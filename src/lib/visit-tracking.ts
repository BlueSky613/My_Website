/** Client-side rules for when a homepage visit should increment the global counter. */

const COUNTED_PREFIX = "stats:visit:done:";
const PENDING_PREFIX = "stats:visit:pending:";

/**
 * Unique id for the current navigation (new on every full page load / refresh).
 * Uses the Navigation Timing navigationId when available (Chrome 110+, Safari 17+).
 */
function getNavigationId(): string {
  const nav = performance.getEntriesByType("navigation")[0] as
    | (PerformanceNavigationTiming & { navigationId?: string })
    | undefined;

  if (nav?.navigationId) return nav.navigationId;

  // Fallback for older browsers: one id per document load, rotated on reload.
  const bootKey = "stats:visit:boot-id";
  if (nav?.type === "reload") {
    sessionStorage.removeItem(bootKey);
  }
  let id = sessionStorage.getItem(bootKey);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(bootKey, id);
  }
  return id;
}

function countedKey(): string {
  return COUNTED_PREFIX + getNavigationId();
}

function pendingKey(): string {
  return PENDING_PREFIX + getNavigationId();
}

/**
 * Count a homepage visit only on a full document load of `/`:
 * - each refresh (new navigation id)
 * - first open of the site directly on `/`
 *
 * Does NOT count client-side navigation to `/` after landing on another page.
 */
export function shouldCountHomeVisit(
  initialPath: string,
  currentPath: string
): boolean {
  if (currentPath !== "/") return false;

  if (sessionStorage.getItem(countedKey()) || sessionStorage.getItem(pendingKey())) {
    return false;
  }

  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;

  if (nav?.type === "reload") return true;

  return initialPath === "/";
}

export function markHomeVisitPending(): void {
  sessionStorage.setItem(pendingKey(), "1");
}

export function markHomeVisitCounted(): void {
  sessionStorage.setItem(countedKey(), "1");
  sessionStorage.removeItem(pendingKey());
}

export function clearHomeVisitPending(): void {
  sessionStorage.removeItem(pendingKey());
}
