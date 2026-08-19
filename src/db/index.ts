import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://devdocs:devdocs@localhost:5432/devdocs";

export const queryClient = postgres(connectionString, { max: 1 });

export const db = drizzle(queryClient, { schema });
