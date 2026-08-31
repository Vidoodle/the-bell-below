import { randomBytes } from "node:crypto";
import { captureCommand, runCommand, runPnpm } from "./process.mjs";

async function runTest(databaseUrl, authorization) {
  await runPnpm(["run", "test:integration:database"], {
    ...process.env,
    TEST_DATABASE_URL: databaseUrl,
    ...authorization,
  });
}

async function main() {
  if (process.env.TEST_DATABASE_URL) {
    if (process.env.CONFIRM_EXTERNAL_TEST_DATABASE !== "1") {
      throw new Error("Set CONFIRM_EXTERNAL_TEST_DATABASE=1 to use an externally managed test database.");
    }
    await runTest(process.env.TEST_DATABASE_URL, {
      BELL_BELOW_EXTERNAL_TEST_DATABASE_CONFIRMED: "1",
    });
    return;
  }

  const projectName = `bell-below-test-${process.pid}-${randomBytes(4).toString("hex")}`;
  const password = randomBytes(24).toString("hex");
  const compose = (...args) => [
    "compose", "--project-name", projectName, "--profile", "test", ...args,
  ];
  const environment = { ...process.env, POSTGRES_PASSWORD: password };
  let failure;
  try {
    await runCommand("docker", compose("up", "-d", "--wait", "postgres-test"), { environment });
    const binding = await captureCommand("docker", compose("port", "postgres-test", "5432"), {
      environment,
    });
    const port = binding.match(/:(\d+)$/)?.[1];
    if (!port) throw new Error(`Could not determine the test database port from '${binding}'.`);
    const databaseUrl = `postgresql://bell_below:${password}@127.0.0.1:${port}/bell_below_test`;
    await runTest(databaseUrl, { BELL_BELOW_MANAGED_TEST_DATABASE: "1" });
  } catch (error) {
    failure = error;
  }
  try {
    await runCommand("docker", compose("down", "--volumes"), { environment });
  } catch (error) {
    if (!failure) throw error;
    const cleanupMessage = error instanceof Error ? error.message : String(error);
    const failureMessage = failure instanceof Error ? failure.message : String(failure);
    if (cleanupMessage !== failureMessage) {
      console.error(`Test database cleanup also failed: ${cleanupMessage}`);
    }
  }
  if (failure) throw failure;
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
