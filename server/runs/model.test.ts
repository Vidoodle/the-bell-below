import assert from "node:assert/strict";
import test from "node:test";
import type { RunId } from "../../shared/run.js";
import { completePrologue, createRun } from "./model.js";

const runId = `runs${"0".repeat(30)}` as RunId;
const completedAt = "2026-08-30T12:00:00.000Z";

test("creates canonical run state", () => {
  const run = createRun(runId);

  assert.equal(run.id, runId);
  assert.equal(run.prologueCompletedAt, null);
  assert.equal(completePrologue(run, completedAt).prologueCompletedAt, completedAt);
  assert.equal(completePrologue(completePrologue(run, completedAt), "later").prologueCompletedAt, completedAt);
});
