import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET ?? "aivized-dev-admin-secret";
const JWT_EXPIRES_IN = "8h";
const ADMIN_COOKIE_NAME = "aivized_admin_token";

export interface AdminSession {
  id: string;
  email: string;
  name: string | null;
}

async function signToken(payload: { sub: string; email: string; name: string | null }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(new TextEncoder().encode(JWT_SECRET));
}

async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  if (typeof payload.sub !== "string") throw new Error("Invalid token subject");
  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, name: true },
  });
  if (!admin) throw new Error("Admin not found");
  return { id: admin.id, email: admin.email, name: admin.name } satisfies AdminSession;
}

export async function getAdminSession(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function createAdminSessionToken(adminId: string, email: string, name: string | null) {
  return signToken({ sub: adminId, email, name });
}

export async function verifyAdminPassword(plainPassword: string, passwordHash: string) {
  return bcrypt.compare(plainPassword, passwordHash);
}

export const ADMIN_SESSION_COOKIE = ADMIN_COOKIE_NAME;

