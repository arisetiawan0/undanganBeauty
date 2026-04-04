import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  isValidAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Password wajib diisi.",
        },
        { status: 400 },
      );
    }

    if (!isValidAdminPassword(validatedData.data.password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Password salah. Silakan coba lagi.",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE_NAME,
      createAdminSessionToken(),
      getAdminSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat login.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
