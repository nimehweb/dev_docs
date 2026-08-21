import "server-only";

import { createHash, randomBytes } from "crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { db } from "../db";
import { sessions } from "../db/schema";

import { withDbRetry } from "./retry";

const SESSION_COOKIE = "devdocs_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await withDbRetry(() =>
    db.insert(sessions).values({ userId, tokenHash, expiresAt }),
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function getSessionUser(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const [session] = await withDbRetry(() =>
      db
        .select({ userId: sessions.userId })
        .from(sessions)
        .where(
          and(
            eq(sessions.tokenHash, hashToken(token)),
            gt(sessions.expiresAt, new Date()),
          ),
        )
        .limit(1),
    );

    return session?.userId ?? null;
  } catch (error) {
    console.error("Session lookup network error:", error);
    return null;
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await withDbRetry(() =>
      db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token))),
    ).catch(() => {});
  }
  cookieStore.delete(SESSION_COOKIE);
}