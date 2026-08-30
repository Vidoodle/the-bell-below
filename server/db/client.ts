import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

const databaseTimeoutMs = 5_000;

export type Database = NodePgDatabase<typeof schema>;

export function createDatabase(connectionString: string) {
  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: databaseTimeoutMs,
    query_timeout: databaseTimeoutMs,
    statement_timeout: databaseTimeoutMs,
  });

  return {
    database: drizzle({ client: pool, schema }),
    close: () => pool.end(),
  };
}
