import assert from "node:assert/strict";
import test from "node:test";
import { buildServer } from "../app.js";

test("creates and retrieves a run through the API", async () => {
  const server = buildServer({ createId: () => "run-1" });
  const created = await server.inject({
    method: "POST",
    url: "/api/runs",
    payload: {
      protagonistId: "seren",
      baseStats: { Might: 5, Grace: 3, Wits: 2, Presence: 2 },
    },
  });

  assert.equal(created.statusCode, 201);
  assert.equal(created.json().id, "run-1");

  const retrieved = await server.inject({ method: "GET", url: "/api/runs/run-1" });
  assert.equal(retrieved.statusCode, 200);
  assert.deepEqual(retrieved.json(), created.json());
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
