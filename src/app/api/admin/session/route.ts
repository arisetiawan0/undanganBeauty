import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    authenticated: isAdminRequestAuthenticated(request),
  });
}
