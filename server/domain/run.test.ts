import assert from "node:assert/strict";
import test from "node:test";
import { statNames, type BaseStats } from "../../shared/run.js";
import { protagonists } from "./protagonists.js";
import { createRun, RunValidationError } from "./run.js";

const balanced: BaseStats = { Might: 3, Grace: 3, Wits: 3, Presence: 3 };

test("creates canonical run state", () => {
  const run = createRun("run-1", {
    protagonistId: "seren",
    baseStats: { Might: 5, Grace: 3, Wits: 2, Presence: 2 },
  });

  assert.equal(run.id, "run-1");
  assert.deepEqual(run.effectiveStats, { Might: 6, Grace: 3, Wits: 2, Presence: 2 });
});

test("rejects invalid stats", () => {
  assert.throws(
    () => createRun("run-1", {
      protagonistId: "seren",
      baseStats: { ...balanced, Might: 2 },
    }),
    RunValidationError,
  );
  assert.throws(
    () => createRun("run-1", {
      protagonistId: "seren",
      baseStats: { ...balanced, Might: 6, Grace: 2, Wits: 2, Presence: 2 },
    }),
    RunValidationError,
  );
});

test("applies each protagonist benefit", () => {
  for (const protagonist of Object.values(protagonists)) {
    const run = createRun("run-1", { protagonistId: protagonist.id, baseStats: balanced });
    for (const stat of statNames) {
      assert.equal(run.effectiveStats[stat], balanced[stat] + (stat === protagonist.benefit ? 1 : 0));
    }
  }
});
