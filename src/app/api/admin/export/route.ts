import type { NextRequest } from "next/server";
import { buildRsvpCsv } from "@/lib/csv";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { getAllRsvpEntries } from "@/lib/rsvp";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return Response.json(
      {
        success: false,
        error: "Unauthorized.",
      },
      { status: 401 },
    );
  }

  try {
    const entries = await getAllRsvpEntries();
    const csvContent = buildRsvpCsv(entries);

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rsvp-beauty-raha-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengeksport data",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
