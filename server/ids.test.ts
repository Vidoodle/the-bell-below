import assert from "node:assert/strict";
import test from "node:test";
import { createCharacterId, createRunId } from "./ids.js";

test("uses the character and run SID formats", () => {
  assert.match(createCharacterId(), /^char[0-9a-f]{30}$/);
  assert.match(createRunId(), /^runs[0-9a-f]{30}$/);
});
