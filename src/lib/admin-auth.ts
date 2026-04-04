import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { getAdminPassword, getAdminSessionSecret, isProductionEnv } from "@/lib/env";

export const ADMIN_SESSION_COOKIE_NAME = "beauty-raha-admin-session";
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 12;

type AdminSessionPayload = {
  role: "admin";
  exp: number;
};

function encodePayload(payload: AdminSessionPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(payload: string) {
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSessionPayload;
  } catch {
    return null;
  }
}

function signValue(value: string) {
  return createHmac("sha256", getAdminSessionSecret()).update(value).digest("base64url");
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidAdminPassword(password: string) {
  return safeCompare(password, getAdminPassword());
}

export function createAdminSessionToken() {
  const payload = encodePayload({
    role: "admin",
    exp: Date.now() + ADMIN_SESSION_DURATION_SECONDS * 1000,
  });

  return `${payload}.${signValue(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signValue(payload);

  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  const decodedPayload = decodePayload(payload);

  if (!decodedPayload || decodedPayload.role !== "admin") {
    return false;
  }

  return decodedPayload.exp > Date.now();
}

export function isAdminRequestAuthenticated(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value);
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isProductionEnv(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_DURATION_SECONDS,
  };
}

export function getClearedAdminSessionCookieOptions() {
  return {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  };
}
