import assert from "node:assert/strict";
import test from "node:test";
import { theBellBelow } from "./the-bell-below.js";
import {
  AdventureValidationError,
  createAdventure,
  type AdventureContent,
} from "./model.js";
import { drownedStair } from "./locations/drowned-stair.js";
import { locationId } from "./locations/model.js";
import { gatheredCrowd } from "./npcs/gathered-crowd.js";
import { guardDetail } from "./npcs/guard-detail.js";
import { npcId } from "./npcs/model.js";
import { watchSergeant } from "./npcs/watch-sergeant.js";
import { guardedEntrance } from "./scenes/guarded-entrance.js";
import { sceneId, scenePhaseId } from "./scenes/model.js";

const opening: AdventureContent = {
  initialSceneId: guardedEntrance.id,
  locations: [drownedStair],
  scenes: [guardedEntrance],
  npcs: [watchSergeant, guardDetail, gatheredCrowd],
};

test("defines the opening adventure content", () => {
  assert.equal(theBellBelow.scenes.get(theBellBelow.initialSceneId), guardedEntrance);
  assert.equal(theBellBelow.locations.get(guardedEntrance.locationId), drownedStair);
  assert.equal(theBellBelow.npcs.size, 3);
  assert.equal(theBellBelow.npcs.get(watchSergeant.id), watchSergeant);
  assert.deepEqual(
    guardedEntrance.initialNpcParticipations.map(({ npcId }) => npcId),
    [watchSergeant.id, guardDetail.id, gatheredCrowd.id],
  );
  assert.equal(theBellBelow.npcs.get(guardDetail.id), guardDetail);
  assert.equal(theBellBelow.npcs.get(gatheredCrowd.id), gatheredCrowd);
  assert.equal(guardDetail.actsCollectively, true);
  assert.equal(watchSergeant.actsCollectively, false);
  assert.equal(guardedEntrance.initialPhaseId, scenePhaseId("guarded"));
});

test("rejects duplicate authored IDs", () => {
  assert.throws(
    () => createAdventure({ ...opening, locations: [drownedStair, drownedStair] }),
    AdventureValidationError,
  );
});

test("rejects duplicate NPC IDs", () => {
  assert.throws(
    () => createAdventure({ ...opening, npcs: [watchSergeant, guardDetail, guardDetail] }),
    /Duplicate NPC ID/,
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
    const scene = {
      ...guardedEntrance,
      initialNpcParticipations: [
        {
          ...guardedEntrance.initialNpcParticipations[0],
          npcId: npcId("missing-npc"),
        },
      ],
    };
    assert.throws(() => createAdventure({ ...opening, scenes: [scene] }), /unknown NPC/);
  });
});
