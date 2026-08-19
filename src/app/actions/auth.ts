"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";

import { db } from "../../db";
import { users } from "../../db/schema";
import {
  createSession,
  deleteSession,
  hashPassword,
  verifyPassword,
} from "../../lib/auth";
import { loginSchema, signupSchema } from "../../lib/validation";

const THROTTLE_MAX_ATTEMPTS = 5;
const THROTTLE_WINDOW_MS = 10 * 60 * 1000;

const failedLogins = new Map<
  string,
  { count: number; resetAt: number }
>();

function isThrottled(key: string): boolean {
  const entry = failedLogins.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failedLogins.delete(key);
    return false;
  }
  return entry.count >= THROTTLE_MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const entry = failedLogins.get(key);
  if (!entry) {
    failedLogins.set(key, {
      count: 1,
      resetAt: Date.now() + THROTTLE_WINDOW_MS,
    });
  } else {
    entry.count += 1;
  }
}

function clearFailures(key: string): void {
  failedLogins.delete(key);
}

type ActionState = { error?: string };

function zodError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Invalid input";
}

export async function signupAction(
  _prev: ActionState,
  input: z.infer<typeof signupSchema>,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { error: zodError(parsed.error) };
  }

  const { name, email, password } = parsed.data;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing.length > 0) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash })
    .returning({ id: users.id });

  await createSession(created.id);
  redirect("/dashboard");
}

export async function loginAction(
  _prev: ActionState,
  input: z.infer<typeof loginSchema>,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: zodError(parsed.error) };
  }

  const { email, password } = parsed.data;
  const throttleKey = `email:${email}`;

  if (isThrottled(throttleKey)) {
    return {
      error: "Too many failed attempts. Please try again later.",
    };
  }

  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    recordFailure(throttleKey);
    return { error: "Invalid email or password" };
  }

  clearFailures(throttleKey);
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
