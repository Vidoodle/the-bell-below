import { buildServer } from "./server/app.js";
import { createDatabase } from "./server/db/client.js";
import { createPostgresRunRepository } from "./server/storage/postgres-run-repository.js";

const production = process.argv.includes("--production");
const port = Number(process.env.PORT) || (production ? 5173 : 5174);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const connection = createDatabase(databaseUrl);
const runs = createPostgresRunRepository(connection.database);
const server = buildServer({ production, runs });
server.addHook("onClose", connection.close);

try {
  await server.listen({ host: "127.0.0.1", port });
} catch (error) {
  console.error("Server failed to start.", error);
  await connection.close();
  process.exitCode = 1;
}
