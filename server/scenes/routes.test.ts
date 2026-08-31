import assert from "node:assert/strict";
import test from "node:test";
import type { CharacterId } from "../../shared/character.js";
import type { ProtagonistId } from "../../shared/protagonist.js";
import type { Reputation } from "../../shared/reputation.js";
import type { RunId } from "../../shared/run.js";
import { buildServer } from "../app.js";

const runId = `runs${"1".repeat(30)}` as RunId;
const characterId = `char${"1".repeat(30)}` as CharacterId;
const baseStats = { Might: 3, Grace: 3, Wits: 3, Presence: 3 };

const reputations: Record<ProtagonistId, Reputation> = {
  seren: "friendly",
  veyra: "neutral",
  cael: "unfriendly",
  riona: "trusted",
};

async function createRun(server: ReturnType<typeof buildServer>, protagonistId: ProtagonistId) {
  const response = await server.inject({
    method: "POST",
    url: "/api/runs",
    payload: { protagonistId, baseStats },
  });
  assert.equal(response.statusCode, 201);
}

test("serves the observable initial scene for every protagonist", async (context) => {
  for (const protagonistId of Object.keys(reputations) as ProtagonistId[]) {
    await context.test(protagonistId, async () => {
      const server = buildServer({
        createRunId: () => runId,
        createCharacterId: () => characterId,
        now: () => "2026-08-31T12:00:00.000Z",
      });
      await createRun(server, protagonistId);
      await server.inject({ method: "POST", url: `/api/runs/${runId}/prologue` });

      const response = await server.inject({
        method: "GET",
        url: `/api/runs/${runId}/current-scene`,
      });
      assert.equal(response.statusCode, 200);
      assert.equal(response.json().npcs[0].reputation, reputations[protagonistId]);

      if (protagonistId === "seren") {
        assert.deepEqual(response.json(), {
          location: {
            name: "The Drowned Stair",
            description: "The old processional stair descends through Grayhaven's retaining wall into the flooded cathedral close. The city watch holds its reopened gate.",
          },
          scene: {
            title: "The Guarded Descent",
            description: "A watch sergeant controls the reopened gate at the upper landing while a guard detail keeps the gathered crowd behind the cordon.",
          },
          npcs: [{
            name: "Watch Sergeant",
            description: "The officer responsible for deciding who passes the cordon.",
            reputation: reputations.seren,
          }],
          groups: [
            {
              name: "Guard Detail",
              description: "A disciplined line of city-watch guards blocks the reopened gate.",
            },
            {
              name: "Gathered Crowd",
              description: "Grayhaven residents press against the cordon to watch the reopened stair.",
            },
          ],
        });
        assert.doesNotMatch(
          response.body,
          /protectedFacts|initialDisposition|initialReputationByProtagonist/,
        );
      }
    });
  }
});

test("requires an existing prologue-complete run", async (context) => {
  const server = buildServer({
    createRunId: () => runId,
    createCharacterId: () => characterId,
  });

  await context.test("missing run", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/api/runs/${runId}/current-scene`,
    });
    assert.equal(response.statusCode, 404);
    assert.deepEqual(response.json(), { error: "Run not found." });
  });

  await context.test("incomplete prologue", async () => {
    await createRun(server, "seren");
    const response = await server.inject({
      method: "GET",
      url: `/api/runs/${runId}/current-scene`,
    });
    assert.equal(response.statusCode, 409);
    assert.deepEqual(response.json(), { error: "Prologue is not complete." });
  });
});
