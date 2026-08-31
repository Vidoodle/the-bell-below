import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { CharacterId, CharacterSnapshot } from "../../shared/character.js";
import type { RunId, RunSnapshot } from "../../shared/run.js";
import type { Adventure } from "../adventure/model.js";
import { guardedEntrance } from "../adventure/scenes/guarded-entrance.js";
import { sceneId, scenePhaseId } from "../adventure/scenes/model.js";
import { theBellBelow } from "../adventure/the-bell-below.js";
import { buildServer } from "../app.js";
import { createPostgresCharacterReader } from "../characters/reader.js";
import { characters } from "../characters/table.js";
import { createDatabase } from "../db/client.js";
import { createPostgresRunSceneReader } from "../scenes/reader.js";
import { runSceneStates } from "../scenes/table.js";
import { buildTransitionRunScene } from "../scenes/transition.js";
import { createPostgresRunSceneWriter } from "../scenes/writer.js";
import { createPostgresRunReader } from "./reader.js";
import { runs } from "./table.js";
import { createPostgresRunWriter } from "./writer.js";

const databaseUrl = process.env.TEST_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("TEST_DATABASE_URL is required for PostgreSQL integration tests.");
}

function databaseIdentity(value: string) {
  const url = new URL(value);
  const loopbackHosts = new Set(["127.0.0.1", "::1", "localhost"]);
  const normalizedHost = url.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  const host = loopbackHosts.has(normalizedHost) ? "loopback" : normalizedHost;
  return `${host}:${url.port || "5432"}/${decodeURIComponent(url.pathname).replace(/^\/+/, "")}`;
}

const databaseName = decodeURIComponent(new URL(databaseUrl).pathname).replace(/^\/+/, "");
if (!databaseName.toLowerCase().endsWith("_test")) {
  throw new Error("TEST_DATABASE_URL must identify a database whose name ends with '_test'.");
}
if (
  process.env.BELL_BELOW_MANAGED_TEST_DATABASE !== "1"
  && process.env.BELL_BELOW_EXTERNAL_TEST_DATABASE_CONFIRMED !== "1"
) {
  throw new Error("The integration test requires a managed database or explicit external confirmation.");
}
if (process.env.DATABASE_URL && databaseIdentity(databaseUrl) === databaseIdentity(process.env.DATABASE_URL)) {
  throw new Error("TEST_DATABASE_URL must not be the development or production DATABASE_URL.");
}

function createStorage(database: ReturnType<typeof createDatabase>["database"]) {
  const runReader = createPostgresRunReader(database);
  return {
    runReader,
    runWriter: createPostgresRunWriter(database, runReader),
    characterReader: createPostgresCharacterReader(database),
    runSceneReader: createPostgresRunSceneReader(database),
    runSceneWriter: createPostgresRunSceneWriter(database),
  };
}

const priorRunId = `runs${"a".repeat(30)}` as RunId;
const priorCharacterId = `char${"a".repeat(30)}` as CharacterId;

async function copyPriorMigrations() {
  const root = await mkdtemp(join(tmpdir(), "bell-below-prior-migrations-"));
  const migrations = join(root, "drizzle");
  await cp(resolve("drizzle"), migrations, { recursive: true });
  await rm(join(migrations, "0003_slim_excalibur.sql"));
  await rm(join(migrations, "meta", "0003_snapshot.json"));
  const journalPath = join(migrations, "meta", "_journal.json");
  const journal = JSON.parse(await readFile(journalPath, "utf8")) as {
    entries: { idx: number }[];
  };
  journal.entries = journal.entries.filter(({ idx }) => idx < 3);
  await writeFile(journalPath, `${JSON.stringify(journal, null, 2)}\n`);
  return { root, migrations };
}

test("backfills existing prologue-complete runs to the authored opening state", async () => {
  const prior = await copyPriorMigrations();
  const connection = createDatabase(databaseUrl);
  try {
    await migrate(connection.database, { migrationsFolder: prior.migrations });
    await connection.database.insert(runs).values({
      id: priorRunId,
      prologueCompletedAt: new Date("2026-08-31T10:00:00.000Z"),
    });
    await connection.database.insert(characters).values({
      id: priorCharacterId,
      runId: priorRunId,
      protagonistId: "seren",
      might: 5,
      grace: 3,
      wits: 2,
      presence: 2,
    });

    await migrate(connection.database, { migrationsFolder: resolve("drizzle") });

    const [run] = await connection.database.select({
      currentSceneId: runs.currentSceneId,
    }).from(runs).where(eq(runs.id, priorRunId));
    const [sceneState] = await connection.database.select({
      sceneId: runSceneStates.sceneId,
      phaseId: runSceneStates.phaseId,
    }).from(runSceneStates).where(eq(runSceneStates.runId, priorRunId));
    assert.equal(run.currentSceneId, "guarded-entrance");
    assert.deepEqual(sceneState, { sceneId: "guarded-entrance", phaseId: "guarded" });
  } finally {
    try {
      await connection.database.delete(characters).where(eq(characters.runId, priorRunId));
      await connection.database.delete(runs).where(eq(runs.id, priorRunId));
    } finally {
      await connection.close();
      await rm(prior.root, { recursive: true, force: true });
    }
  }
});

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

const alertedPhaseId = scenePhaseId("watch-alerted");
const arrivalPhaseId = scenePhaseId("arrived");
const arrivalScene = {
  ...guardedEntrance,
  id: sceneId("test-arrival"),
  title: "Test Arrival",
  initialPhaseId: arrivalPhaseId,
  phaseIds: [arrivalPhaseId],
};
const openingWithTransition = {
  ...guardedEntrance,
  phaseIds: [guardedEntrance.initialPhaseId, alertedPhaseId],
};
const transitionAdventure = {
  ...theBellBelow,
  scenes: new Map(theBellBelow.scenes)
    .set(openingWithTransition.id, openingWithTransition)
    .set(arrivalScene.id, arrivalScene),
} satisfies Adventure;

test("persists current position and prior scene progress across restarts", async () => {
  const firstConnection = createDatabase(databaseUrl);
  let createdRun: RunSnapshot | undefined;
  try {
    await migrate(firstConnection.database, { migrationsFolder: resolve("drizzle") });
    const firstStorage = createStorage(firstConnection.database);
    const firstServer = buildServer({ ...firstStorage, adventure: transitionAdventure });
    try {
      const created = await firstServer.inject({
        method: "POST",
        url: "/api/runs",
        payload: {
          protagonistId: "cael",
          baseStats: { Might: 2, Grace: 2, Wits: 5, Presence: 3 },
        },
      });
      assert.equal(created.statusCode, 201);
      createdRun = created.json() as RunSnapshot;
      const completed = await firstServer.inject({
        method: "POST",
        url: `/api/runs/${createdRun.id}/prologue`,
      });
      assert.equal(completed.statusCode, 200);
      const transition = buildTransitionRunScene(
        transitionAdventure,
        firstStorage.runSceneWriter,
      );
      assert.ok(await transition(createdRun.id, guardedEntrance.id, alertedPhaseId));
      assert.ok(await transition(createdRun.id, arrivalScene.id, arrivalPhaseId));
    } finally {
      await firstServer.close();
    }
  } finally {
    await firstConnection.close();
  }

  assert.ok(createdRun);
  const secondConnection = createDatabase(databaseUrl);
  const secondStorage = createStorage(secondConnection.database);
  const secondServer = buildServer({ ...secondStorage, adventure: transitionAdventure });
  try {
    const current = await secondServer.inject({
      method: "GET",
      url: `/api/runs/${createdRun.id}/current-scene`,
    });
    assert.equal(current.statusCode, 200);
    assert.equal(current.json().scene.title, "Test Arrival");
    assert.equal(current.json().scene.phase, arrivalPhaseId);

    const priorState = await secondStorage.runSceneReader.find(
      createdRun.id,
      guardedEntrance.id,
    );
    assert.equal(priorState?.phaseId, alertedPhaseId);
  } finally {
    try {
      await secondConnection.database.delete(characters)
        .where(eq(characters.runId, createdRun.id));
      await secondConnection.database.delete(runs).where(eq(runs.id, createdRun.id));
      await secondServer.close();
    } finally {
      await secondConnection.close();
    }
  }
});
