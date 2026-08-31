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
import { npcId } from "./npcs/model.js";
import { watchSergeant } from "./npcs/watch-sergeant.js";
import { guardedEntrance } from "./scenes/guarded-entrance.js";
import { sceneId } from "./scenes/model.js";

const opening: AdventureContent = {
  initialSceneId: guardedEntrance.id,
  locations: [drownedStair],
  scenes: [guardedEntrance],
  npcs: [watchSergeant],
};

test("defines the opening adventure content", () => {
  assert.equal(theBellBelow.scenes.get(theBellBelow.initialSceneId), guardedEntrance);
  assert.equal(theBellBelow.locations.get(guardedEntrance.locationId), drownedStair);
});

test("rejects duplicate authored IDs", () => {
  assert.throws(
    () => createAdventure({ ...opening, locations: [drownedStair, drownedStair] }),
    AdventureValidationError,
  );
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
});
