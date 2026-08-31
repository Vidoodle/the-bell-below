import assert from "node:assert/strict";
import test from "node:test";
import { theBellBelow } from "../adventure/the-bell-below.js";
import {
  initialRunScenePosition,
  resolveRunScenePosition,
  resolveRunSceneState,
  RunSceneValidationError,
} from "./model.js";
import type { RunId } from "../../shared/run.js";

const runId = `runs${"2".repeat(30)}` as RunId;

test("resolves authored run scene references", () => {
  const initial = initialRunScenePosition(theBellBelow);
  assert.deepEqual(initial, { sceneId: "guarded-entrance", phaseId: "guarded" });
  assert.deepEqual(
    resolveRunSceneState(theBellBelow, { runId, ...initial }),
    { runId, ...initial },
  );
});

test("rejects run scene references outside the authored catalog", () => {
  assert.throws(
    () => resolveRunScenePosition(theBellBelow, "missing-scene", "guarded"),
    RunSceneValidationError,
  );
  assert.throws(
    () => resolveRunScenePosition(theBellBelow, "guarded-entrance", "missing-phase"),
    RunSceneValidationError,
  );
});
