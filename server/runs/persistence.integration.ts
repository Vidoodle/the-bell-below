import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { CharacterSnapshot } from "../../shared/character.js";
import type { RunSnapshot } from "../../shared/run.js";
import { buildServer } from "../app.js";
import { createPostgresCharacterReader } from "../characters/reader.js";
import { characters } from "../characters/table.js";
import { createDatabase } from "../db/client.js";
import { createPostgresRunReader } from "./reader.js";
import { runs } from "./table.js";
import { createPostgresRunWriter } from "./writer.js";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TEST_DATABASE_URL is required for PostgreSQL integration tests.");
}

function createStorage(database: ReturnType<typeof createDatabase>["database"]) {
  const runReader = createPostgresRunReader(database);
  return {
    runReader,
    runWriter: createPostgresRunWriter(database, runReader),
    characterReader: createPostgresCharacterReader(database),
  };
}

test("persists a run across server and connection-pool restarts", async () => {
  const firstConnection = createDatabase(databaseUrl);
  let createdRun: RunSnapshot | undefined;
  let createdCharacter: CharacterSnapshot | undefined;
  try {
    await migrate(firstConnection.database, { migrationsFolder: resolve("drizzle") });
    const firstServer = buildServer(createStorage(firstConnection.database));
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
      const character = await firstServer.inject({
        method: "GET",
        url: `/api/runs/${(created.json() as RunSnapshot).id}/character`,
      });
      assert.equal(character.statusCode, 200);
      createdCharacter = character.json() as CharacterSnapshot;
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
  assert.ok(createdCharacter);
  const secondConnection = createDatabase(databaseUrl);
  const secondServer = buildServer(createStorage(secondConnection.database));
  try {
    const retrieved = await secondServer.inject({
      method: "GET",
      url: `/api/runs/${createdRun.id}`,
    });
    assert.equal(retrieved.statusCode, 200);
    assert.deepEqual(retrieved.json(), createdRun);
    const retrievedCharacter = await secondServer.inject({
      method: "GET",
      url: `/api/runs/${createdRun.id}/character`,
    });
    assert.equal(retrievedCharacter.statusCode, 200);
    assert.deepEqual(retrievedCharacter.json(), createdCharacter);
  } finally {
    try {
      await secondConnection.database.transaction(async (transaction) => {
        await transaction.delete(characters).where(eq(characters.runId, createdRun.id));
        await transaction.delete(runs).where(eq(runs.id, createdRun.id));
      });
      await secondServer.close();
    } finally {
      await secondConnection.close();
    }
  }
});
