import assert from "node:assert/strict";
import test from "node:test";
import type { CharacterId } from "../../shared/character.js";
import type { RunId } from "../../shared/run.js";
import { buildServer } from "../app.js";

const runId = `runs${"0".repeat(30)}` as RunId;
const characterId = `char${"0".repeat(30)}` as CharacterId;
const completedAt = "2026-08-30T12:00:00.000Z";

test("creates, starts, and retrieves a run through the API", async () => {
  const server = buildServer({
    createRunId: () => runId,
    createCharacterId: () => characterId,
    now: () => completedAt,
  });
  const created = await server.inject({
    method: "POST",
    url: "/api/runs",
    payload: {
      protagonistId: "seren",
      baseStats: { Might: 5, Grace: 3, Wits: 2, Presence: 2 },
    },
  });

  assert.equal(created.statusCode, 201);
  assert.equal(created.json().id, runId);
  assert.equal(created.json().prologueCompletedAt, null);
  assert.equal(created.json().character, undefined);

  const character = await server.inject({ method: "GET", url: `/api/runs/${runId}/character` });
  assert.equal(character.statusCode, 200);
  assert.equal(character.json().id, characterId);
  assert.equal(character.json().runId, runId);

  const retrieved = await server.inject({ method: "GET", url: `/api/runs/${runId}` });
  assert.equal(retrieved.statusCode, 200);
  assert.deepEqual(retrieved.json(), created.json());

  const completed = await server.inject({ method: "POST", url: `/api/runs/${runId}/prologue` });
  assert.equal(completed.statusCode, 200);
  assert.equal(completed.json().prologueCompletedAt, completedAt);

  const resumed = await server.inject({ method: "GET", url: `/api/runs/${runId}` });
  assert.deepEqual(resumed.json(), completed.json());

  const resumedCharacter = await server.inject({
    method: "GET", url: `/api/runs/${runId}/character`,
  });
  assert.deepEqual(resumedCharacter.json(), character.json());
});

test("separates request validation from game-rule validation", async () => {
  const server = buildServer();
  const malformed = await server.inject({
    method: "POST",
    url: "/api/runs",
    payload: { protagonistId: "seren", baseStats: { Might: 5 } },
  });
  assert.equal(malformed.statusCode, 400);
  assert.deepEqual(malformed.json(), { error: "Invalid request." });

  const invalidBudget = await server.inject({
    method: "POST",
    url: "/api/runs",
    payload: {
      protagonistId: "seren",
      baseStats: { Might: 2, Grace: 3, Wits: 3, Presence: 3 },
    },
  });
  assert.equal(invalidBudget.statusCode, 400);
  assert.deepEqual(invalidBudget.json(), { error: "Base stats must spend exactly 8 points." });
});

test("rejects invalid JSON and unknown routes", async () => {
  const server = buildServer();
  const invalidJson = await server.inject({
    method: "POST",
    url: "/api/runs",
    headers: { "content-type": "application/json" },
    payload: "{",
  });
  assert.equal(invalidJson.statusCode, 400);
  assert.deepEqual(invalidJson.json(), { error: "Invalid request." });

  const missing = await server.inject({ method: "GET", url: "/somewhere-else" });
  assert.equal(missing.statusCode, 404);
});
