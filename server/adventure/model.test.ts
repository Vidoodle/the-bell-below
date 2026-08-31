import assert from "node:assert/strict";
import test from "node:test";
import { theBellBelow } from "./the-bell-below.js";
import {
  AdventureValidationError,
  createAdventure,
  type AdventureContent,
} from "./model.js";
import { gatheredCrowd } from "./groups/gathered-crowd.js";
import { guardDetail } from "./groups/guard-detail.js";
import { groupId } from "./groups/model.js";
import { drownedStair } from "./locations/drowned-stair.js";
import { locationId } from "./locations/model.js";
import { npcId } from "./npcs/model.js";
import { watchSergeant } from "./npcs/watch-sergeant.js";
import { guardedEntrance } from "./scenes/guarded-entrance.js";
import { sceneId, scenePhaseId } from "./scenes/model.js";

const opening: AdventureContent = {
  initialSceneId: guardedEntrance.id,
  groups: [guardDetail, gatheredCrowd],
  locations: [drownedStair],
  scenes: [guardedEntrance],
  npcs: [watchSergeant],
};

test("defines the opening adventure content", () => {
  assert.equal(theBellBelow.scenes.get(theBellBelow.initialSceneId), guardedEntrance);
  assert.equal(theBellBelow.locations.get(guardedEntrance.locationId), drownedStair);
  assert.equal(theBellBelow.npcs.size, 1);
  assert.equal(theBellBelow.npcs.get(watchSergeant.id), watchSergeant);
  assert.equal(theBellBelow.groups.size, 2);
  assert.deepEqual(guardedEntrance.initialNpcIds, [watchSergeant.id]);
  assert.deepEqual(
    guardedEntrance.groupParticipations.map(({ groupId }) => groupId),
    [guardDetail.id, gatheredCrowd.id],
  );
  assert.equal(theBellBelow.groups.get(guardDetail.id), guardDetail);
  assert.equal(theBellBelow.groups.get(gatheredCrowd.id), gatheredCrowd);
  assert.equal(guardedEntrance.initialPhaseId, scenePhaseId("guarded"));
});

test("rejects duplicate authored IDs", () => {
  assert.throws(
    () => createAdventure({ ...opening, locations: [drownedStair, drownedStair] }),
    AdventureValidationError,
  );
});

test("rejects duplicate group IDs", () => {
  assert.throws(
    () => createAdventure({ ...opening, groups: [guardDetail, guardDetail] }),
    /Duplicate group ID/,
  );
});

test("validates authored scene phases", async (context) => {
  await context.test("duplicate phase IDs", () => {
    const scene = {
      ...guardedEntrance,
      phaseIds: [guardedEntrance.initialPhaseId, guardedEntrance.initialPhaseId],
    };
    assert.throws(
      () => createAdventure({ ...opening, scenes: [scene] }),
      /duplicate phase IDs/,
    );
  });
  await context.test("missing initial phase", () => {
    const scene = {
      ...guardedEntrance,
      phaseIds: [scenePhaseId("another-phase")],
    };
    assert.throws(
      () => createAdventure({ ...opening, scenes: [scene] }),
      /does not include initial phase/,
    );
  });
});

test("rejects missing authored references", async (context) => {
  await context.test("initial scene", () => {
    assert.throws(
      () => createAdventure({ ...opening, initialSceneId: sceneId("missing-scene") }),
      /Unknown initial scene/,
    );
  });
  await context.test("scene location", () => {
    const scene = { ...guardedEntrance, locationId: locationId("missing-location") };
    assert.throws(
      () => createAdventure({ ...opening, scenes: [scene] }),
      /unknown location/,
    );
  });
  await context.test("scene initial NPC", () => {
    const scene = { ...guardedEntrance, initialNpcIds: [npcId("missing-npc")] };
    assert.throws(() => createAdventure({ ...opening, scenes: [scene] }), /unknown NPC/);
  });
  await context.test("scene group", () => {
    const scene = {
      ...guardedEntrance,
      groupParticipations: [
        {
          ...guardedEntrance.groupParticipations[0],
          groupId: groupId("missing-group"),
        },
      ],
    };
    assert.throws(
      () => createAdventure({ ...opening, scenes: [scene] }),
      /unknown group/,
    );
  });
});
