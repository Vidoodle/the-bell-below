import { createAdventure } from "./model.js";
import { cathedralClose } from "./locations/cathedral-close.js";
import { drownedStair } from "./locations/drowned-stair.js";
import { watchSergeant } from "./npcs/watch-sergeant.js";
import { guardedEntrance } from "./scenes/guarded-entrance.js";

export const theBellBelow = createAdventure({
  initialSceneId: guardedEntrance.id,
  locations: [drownedStair, cathedralClose],
  scenes: [guardedEntrance],
  npcs: [watchSergeant],
});
