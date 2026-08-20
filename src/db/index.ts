import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://devdocs:devdocs@localhost:5432/devdocs";

const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 600;

function isRetriableConnectionError(err: unknown): boolean {
  if (!err || typeof err !== "object" || !("message" in err)) {
    return false;
  }
  const msg = String((err as { message: unknown }).message ?? "");
  return (
    msg.includes("EAI_AGAIN") ||
    msg.includes("getaddrinfo") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("socket hang up")
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type AsyncFn = (...args: never[]) => Promise<unknown>;

function withRetry<R>(
  fn: (...args: never[]) => Promise<R>,
): (...args: never[]) => Promise<R> {
  return async (...args: never[]) => {
    let lastErr: unknown;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastErr = err;
        if (!isRetriableConnectionError(err) || attempt === MAX_ATTEMPTS) {
          throw err;
        }
        await sleep(BASE_DELAY_MS * attempt);
      }
    }
    throw lastErr;
  };
}

const raw = postgres(connectionString, { max: 1 });

const queryClient = new Proxy(raw, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (
      (prop === "unsafe" || prop === "query") &&
      typeof value === "function"
    ) {
      return withRetry(value.bind(target) as AsyncFn);
    }
    return value;
  },
});

export const db = drizzle(queryClient, { schema });