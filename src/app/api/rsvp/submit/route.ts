import { NextResponse } from "next/server";
import { createRsvpEntry, validateRsvpSubmission } from "@/lib/rsvp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = validateRsvpSubmission(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validatedData.error.errors,
        },
        { status: 400 },
      );
    }

    const savedEntry = await createRsvpEntry(validatedData.data);

    return NextResponse.json(
      {
        success: true,
        message: "Konfirmasi kehadiran berhasil disimpan",
        data: savedEntry,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
