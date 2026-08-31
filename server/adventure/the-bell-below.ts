import { createAdventure } from "./model.js";
import { gatheredCrowd } from "./groups/gathered-crowd.js";
import { guardDetail } from "./groups/guard-detail.js";
import { cathedralClose } from "./locations/cathedral-close.js";
import { drownedStair } from "./locations/drowned-stair.js";
import { watchSergeant } from "./npcs/watch-sergeant.js";
import { guardedEntrance } from "./scenes/guarded-entrance.js";

export const theBellBelow = createAdventure({
  initialSceneId: guardedEntrance.id,
  groups: [guardDetail, gatheredCrowd],
  locations: [drownedStair, cathedralClose],
  scenes: [guardedEntrance],
  npcs: [watchSergeant],
});
