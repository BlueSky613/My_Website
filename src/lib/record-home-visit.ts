import { headers } from "next/headers";
import { incrementVisits } from "@/lib/stats";

/**
 * Record one visit when the homepage is loaded as a full browser document
 * (open, refresh, address bar) — not client-side router / RSC / prefetch.
 */
export async function recordHomeVisitIfNeeded(): Promise<void> {
  const h = headers();

  // Next.js client navigation & prefetch — not a real visitor page load.
  if (h.get("rsc") === "1") return;
  if (h.get("next-router-prefetch") === "1") return;
  if (h.get("purpose") === "prefetch") return;

  const mode = h.get("sec-fetch-mode");
  const dest = h.get("sec-fetch-dest");

  if (mode && dest) {
    if (mode !== "navigate" || dest !== "document") return;
  } else {
    // Browsers without Sec-Fetch: only count HTML document requests.
    const accept = h.get("accept") ?? "";
    if (!accept.includes("text/html")) return;
  }

  try {
    await incrementVisits();
  } catch (err) {
    // Never fail the page render because of counters.
    console.error("[visit] recordHomeVisitIfNeeded failed:", err);
  }
}
