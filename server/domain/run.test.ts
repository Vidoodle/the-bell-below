import assert from "node:assert/strict";
import test from "node:test";
import type { CharacterId } from "../../shared/character.js";
import type { RunId } from "../../shared/run.js";
import { statNames, type BaseStats } from "../../shared/stats.js";
import { CharacterValidationError } from "./character.js";
import { protagonists } from "./protagonists.js";
import { createRun } from "./run.js";

const balanced: BaseStats = { Might: 3, Grace: 3, Wits: 3, Presence: 3 };
const runId = `runs${"0".repeat(30)}` as RunId;
const characterId = `char${"0".repeat(30)}` as CharacterId;

test("creates canonical run state", () => {
  const run = createRun(runId, characterId, {
    protagonistId: "seren",
    baseStats: { Might: 5, Grace: 3, Wits: 2, Presence: 2 },
  });

  assert.equal(run.id, runId);
  assert.equal(run.character.id, characterId);
  assert.equal(run.prologueCompletedAt, null);
  assert.deepEqual(run.character.effectiveStats, {
    Might: 6, Grace: 3, Wits: 2, Presence: 2,
  });
});

test("rejects invalid stats", () => {
  assert.throws(
    () => createRun(runId, characterId, {
      protagonistId: "seren",
      baseStats: { ...balanced, Might: 2 },
    }),
    CharacterValidationError,
  );
  assert.throws(
    () => createRun(runId, characterId, {
      protagonistId: "seren",
      baseStats: { ...balanced, Might: 6, Grace: 2, Wits: 2, Presence: 2 },
    }),
    CharacterValidationError,
  );
});

test("applies each protagonist benefit", () => {
  for (const protagonist of Object.values(protagonists)) {
    const run = createRun(runId, characterId, {
      protagonistId: protagonist.id,
      baseStats: balanced,
    });
    for (const stat of statNames) {
      assert.equal(
        run.character.effectiveStats[stat],
        balanced[stat] + (stat === protagonist.benefit ? 1 : 0),
      );
    }
  }
});
