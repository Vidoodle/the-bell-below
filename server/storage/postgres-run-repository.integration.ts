import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { RunSnapshot } from "../../shared/run.js";
import { buildServer } from "../app.js";
import { createDatabase } from "../db/client.js";
import { characters } from "../db/schema/characters.js";
import { runs } from "../db/schema/runs.js";
import { createPostgresRunRepository } from "./postgres-run-repository.js";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TEST_DATABASE_URL is required for PostgreSQL integration tests.");
}

test("persists a run across server and connection-pool restarts", async () => {
  const firstConnection = createDatabase(databaseUrl);
  let createdRun: RunSnapshot | undefined;
  try {
    await migrate(firstConnection.database, { migrationsFolder: resolve("drizzle") });
    const firstServer = buildServer({
      runs: createPostgresRunRepository(firstConnection.database),
    });
    try {
      const created = await firstServer.inject({
        method: "POST",
        url: "/api/runs",
        payload: {
          protagonistId: "riona",
          baseStats: { Might: 2, Grace: 2, Wits: 3, Presence: 5 },
        },
      });
      assert.equal(created.statusCode, 201);
      const completed = await firstServer.inject({
        method: "POST",
        url: `/api/runs/${(created.json() as RunSnapshot).id}/prologue`,
      });
      assert.equal(completed.statusCode, 200);
      createdRun = completed.json() as RunSnapshot;
    } finally {
      await firstServer.close();
    }
  } finally {
    await firstConnection.close();
  }

  assert.ok(createdRun);
  const secondConnection = createDatabase(databaseUrl);
  const secondServer = buildServer({
    runs: createPostgresRunRepository(secondConnection.database),
  });
  try {
    const retrieved = await secondServer.inject({
      method: "GET",
      url: `/api/runs/${createdRun.id}`,
    });
    assert.equal(retrieved.statusCode, 200);
    assert.deepEqual(retrieved.json(), createdRun);
  } finally {
    try {
      await secondConnection.database.transaction(async (transaction) => {
        await transaction.delete(runs).where(eq(runs.id, createdRun.id));
        await transaction.delete(characters).where(eq(characters.id, createdRun.character.id));
      });
      await secondServer.close();
    } finally {
      await secondConnection.close();
    }
  }
});
