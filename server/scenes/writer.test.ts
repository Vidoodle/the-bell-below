import assert from "node:assert/strict";
import test from "node:test";
import type { CharacterId } from "../../shared/character.js";
import type { RunId } from "../../shared/run.js";
import { createCharacter } from "../characters/model.js";
import { createMemoryStorage } from "../memory-storage.js";
import { createRun } from "../runs/model.js";
import { sceneId, scenePhaseId } from "../adventure/scenes/model.js";

const runId = `runs${"3".repeat(30)}` as RunId;
const characterId = `char${"3".repeat(30)}` as CharacterId;
const initialPosition = {
  sceneId: sceneId("guarded-entrance"),
  phaseId: scenePhaseId("guarded"),
};

test("creates, transitions, and recovers content-neutral scene state", async () => {
  const storage = createMemoryStorage();
  const run = createRun(runId);
  const character = createCharacter(characterId, runId, {
    protagonistId: "seren",
    baseStats: { Might: 5, Grace: 3, Wits: 2, Presence: 2 },
  });
  await storage.runWriter.create(run, character);
  await storage.runWriter.completePrologue(
    runId,
    "2026-08-31T12:00:00.000Z",
    initialPosition,
  );

  assert.deepEqual(await storage.runSceneReader.findCurrent(runId), {
    runId,
    ...initialPosition,
  });

  const changedOpening = {
    sceneId: initialPosition.sceneId,
    phaseId: scenePhaseId("watch-alerted"),
  };
  await storage.runSceneWriter.transition(runId, changedOpening);
  const nextPosition = {
    sceneId: sceneId("cathedral-close-arrival"),
    phaseId: scenePhaseId("entered"),
  };
  await storage.runSceneWriter.transition(runId, nextPosition);

  assert.deepEqual(await storage.runSceneReader.findCurrent(runId), {
    runId,
    ...nextPosition,
  });
  assert.deepEqual(
    await storage.runSceneReader.find(runId, initialPosition.sceneId),
    { runId, ...changedOpening },
  );

  await storage.runWriter.completePrologue(
    runId,
    "2026-08-31T13:00:00.000Z",
    initialPosition,
  );
  assert.deepEqual(await storage.runSceneReader.findCurrent(runId), {
    runId,
    ...nextPosition,
  });
});

test("does not create scene state before the prologue is complete", async () => {
  const storage = createMemoryStorage();
  const run = createRun(runId);
  const character = createCharacter(characterId, runId, {
    protagonistId: "seren",
    baseStats: { Might: 5, Grace: 3, Wits: 2, Presence: 2 },
  });
  await storage.runWriter.create(run, character);
  assert.equal(
    await storage.runSceneWriter.transition(runId, initialPosition),
    undefined,
  );
});
