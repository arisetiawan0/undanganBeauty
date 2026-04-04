import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE_NAME,
  getClearedAdminSessionCookieOptions,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logout berhasil.",
  });

  response.cookies.set(ADMIN_SESSION_COOKIE_NAME, "", getClearedAdminSessionCookieOptions());

  return response;
}
