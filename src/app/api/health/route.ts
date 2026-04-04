import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/db/index";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dbHealth = await checkDatabaseHealth();

    return NextResponse.json(
      {
        status: dbHealth.healthy ? "healthy" : "unhealthy",
        timestamp: new Date().toISOString(),
        database: dbHealth.healthy ? "connected" : "disconnected",
        ...(dbHealth.error ? { error: dbHealth.error } : {}),
      },
      { status: dbHealth.healthy ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Health check failed",
      },
      { status: 503 },
    );
  }
}
