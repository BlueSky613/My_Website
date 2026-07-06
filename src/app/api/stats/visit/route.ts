import { NextResponse } from "next/server";
import { incrementVisits } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const stats = await incrementVisits();
    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[stats] visit increment failed:", error);
    return NextResponse.json(
      { error: "Failed to record visit" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
