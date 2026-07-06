import { NextResponse } from "next/server";
import { incrementDownloads } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const stats = await incrementDownloads();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[stats] download increment failed:", error);
    return NextResponse.json(
      { error: "Failed to record download" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
