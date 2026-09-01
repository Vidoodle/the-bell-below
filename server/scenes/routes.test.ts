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

const crowdReputations: Record<ProtagonistId, Reputation> = {
  seren: "friendly",
  veyra: "neutral",
  cael: "friendly",
  riona: "unfriendly",
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
      assert.deepEqual(
        response.json().people.map(({ reputation }: { reputation: Reputation }) => reputation),
        [reputations[protagonistId], reputations[protagonistId], crowdReputations[protagonistId]],
      );

      if (protagonistId === "seren") {
        assert.deepEqual(response.json(), {
          location: {
            name: "The Drowned Stair",
            description: "For forty years, Grayhaven's retaining wall has sealed the only intact landward passage into the flooded Lower Ward. Tonight, its gate stands open. Beyond it, the old processional stair descends toward Saint Orra's cathedral, where the Bell of Mercy has begun to toll again.",
          },
          scene: {
            title: "The Guarded Descent",
            description: "The tolling has drawn a restless crowd to the upper landing, hungry for a glimpse of the cathedral the Church kept sealed below. A disciplined line of city-watch guards holds them behind a cordon while the watch sergeant decides who may pass. The flooded cathedral close lies at the foot of the stair, with Saint Orra's cathedral beyond it. The Bell must be silenced before midnight; the way down runs through the sergeant's gate.",
            phase: "guarded",
          },
          people: [
            {
              name: "Watch Sergeant",
              description: "The officer responsible for deciding who passes the cordon.",
              reputation: reputations.seren,
            },
            {
              name: "Guard Detail",
              description: "A disciplined line of city-watch guards blocks the reopened gate.",
              reputation: reputations.seren,
            },
            {
              name: "Gathered Crowd",
              description: "Grayhaven residents press against the cordon to watch the reopened stair.",
              reputation: crowdReputations.seren,
            },
          ],
        });
        assert.doesNotMatch(
          response.body,
          /actsCollectively|protectedFacts|initialDisposition|initialReputationByProtagonist/,
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

test("rejects persisted scene references outside the authored adventure", async () => {
  const server = buildServer({
    createRunId: () => runId,
    createCharacterId: () => characterId,
    runSceneReader: {
      async find() {
        return undefined;
      },
      async findCurrent(id) {
        return { runId: id, sceneId: "guarded-entrance", phaseId: "unknown-phase" };
      },
    },
  });
  await createRun(server, "seren");
  await server.inject({ method: "POST", url: `/api/runs/${runId}/prologue` });

  const response = await server.inject({
    method: "GET",
    url: `/api/runs/${runId}/current-scene`,
  });
  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.json(), { error: "Internal server error." });
});
