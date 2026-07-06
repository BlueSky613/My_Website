import { NextResponse } from "next/server";
import { readStats } from "@/lib/stats";

// Always run fresh; never cache the counter response.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await readStats();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[stats] GET failed:", error);
    return NextResponse.json(
      { error: "Failed to read stats" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
