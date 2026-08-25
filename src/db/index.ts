import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

export const queryClient = postgres(connectionString, {
  max: 1,
  prepare: false,
  connect_timeout: 15,
});

export const db = drizzle(queryClient, { schema });