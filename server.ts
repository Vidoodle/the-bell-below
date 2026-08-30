import { buildServer } from "./server/app.js";
import { createPostgresCharacterReader } from "./server/characters/reader.js";
import { createDatabase } from "./server/db/client.js";
import { createPostgresRunReader } from "./server/runs/reader.js";
import { createPostgresRunWriter } from "./server/runs/writer.js";

const production = process.argv.includes("--production");
const port = Number(process.env.PORT) || (production ? 5173 : 5174);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const connection = createDatabase(databaseUrl);
const runReader = createPostgresRunReader(connection.database);
const server = buildServer({
  production,
  runReader,
  runWriter: createPostgresRunWriter(connection.database, runReader),
  characterReader: createPostgresCharacterReader(connection.database),
});
server.addHook("onClose", connection.close);

try {
  await server.listen({ host: "127.0.0.1", port });
} catch (error) {
  console.error("Server failed to start.", error);
  await connection.close();
  process.exitCode = 1;
}
