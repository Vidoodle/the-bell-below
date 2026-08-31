import { readLocalDatabaseConfig } from "./local-database-config.mjs";

try {
  const config = await readLocalDatabaseConfig();
  process.env.DATABASE_URL = config.databaseUrl;
  await import("../.server-dist/server.js");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
