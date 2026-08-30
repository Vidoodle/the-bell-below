import { buildServer } from "./server/app.js";

const production = process.argv.includes("--production");
const port = Number(process.env.PORT) || (production ? 5173 : 5174);
const server = buildServer({ production });

try {
  await server.listen({ host: "127.0.0.1", port });
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
