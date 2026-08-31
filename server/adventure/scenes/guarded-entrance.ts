import { drownedStair } from "../locations/drowned-stair.js";
import { watchSergeant } from "../npcs/watch-sergeant.js";
import { sceneId, type SceneDefinition } from "./model.js";

export const guardedEntrance = {
  id: sceneId("guarded-entrance"),
  locationId: drownedStair.id,
  title: "The Guarded Descent",
  description: "A watch sergeant controls the reopened gate at the upper landing while a guard detail keeps the gathered crowd behind the cordon.",
  initialNpcIds: [watchSergeant.id],
} as const satisfies SceneDefinition;
