import { ensureLocalDatabaseConfig, readLocalDatabaseConfig } from "./local-database-config.mjs";
import { runCommand, runPnpm } from "./process.mjs";

function composeArgs(config, ...args) {
  return ["compose", "--project-name", config.projectName, ...args];
}

function dockerEnvironment(config) {
  return { ...process.env, POSTGRES_PASSWORD: config.password };
}

async function start(config) {
  await runCommand("docker", composeArgs(config, "up", "-d", "--wait", "postgres-dev"), {
    environment: dockerEnvironment(config),
  });
}

async function migrate(config) {
  await runPnpm(["run", "db:migrate"], { ...process.env, DATABASE_URL: config.databaseUrl });
}

const command = process.argv[2];
try {
  if (command === "reset") {
    const config = await readLocalDatabaseConfig();
    await runCommand("docker", composeArgs(config, "rm", "-f", "-s", "postgres-dev"), {
      environment: dockerEnvironment(config),
    });
    await runCommand("docker", ["volume", "rm", "--force", config.volumeName]);
  } else if (command === "stop") {
    const config = await readLocalDatabaseConfig();
    await runCommand("docker", composeArgs(config, "stop", "postgres-dev"), {
      environment: dockerEnvironment(config),
    });
  } else if (["migrate", "setup", "start"].includes(command)) {
    const config = await ensureLocalDatabaseConfig();
    if (command !== "migrate") await start(config);
    if (command !== "start") await migrate(config);
  } else {
    throw new Error("Expected one of: migrate, reset, setup, start, stop.");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
