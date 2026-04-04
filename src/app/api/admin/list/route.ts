import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { getAllRsvpEntries } from "@/lib/rsvp";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const entries = await getAllRsvpEntries();

    return NextResponse.json({
      success: true,
      data: entries,
      count: entries.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengambil data",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
