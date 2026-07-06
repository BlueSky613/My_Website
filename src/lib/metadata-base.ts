import { site } from "@/lib/site";

/** Canonical origin for metadata / Open Graph (Vercel env → site.url → localhost). */
export function getMetadataBase(): URL {
  const host =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, "");

  if (host) return new URL(`https://${host.replace(/^https?:\/\//, "")}`);

  if (process.env.NODE_ENV === "development") {
    return new URL("http://localhost:3000");
  }

  return new URL(site.url);
}
