import { createHash, randomBytes } from "crypto";

export const TOKEN_TTL_DAYS = 30;

export const CLIENT_TOKEN_COOKIE = "aivized_client_token";

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getTokenExpiryDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

