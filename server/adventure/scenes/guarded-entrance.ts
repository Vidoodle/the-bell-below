import { gatheredCrowd } from "../groups/gathered-crowd.js";
import { guardDetail } from "../groups/guard-detail.js";
import { drownedStair } from "../locations/drowned-stair.js";
import { watchSergeant } from "../npcs/watch-sergeant.js";
import { sceneId, type SceneDefinition } from "./model.js";

export const guardedEntrance = {
  id: sceneId("guarded-entrance"),
  locationId: drownedStair.id,
  title: "The Guarded Descent",
  description: "A watch sergeant controls the reopened gate at the upper landing while a guard detail keeps the gathered crowd behind the cordon.",
  initialNpcIds: [watchSergeant.id],
  groupParticipations: [
    {
      groupId: guardDetail.id,
      observableDescription: "A disciplined line of city-watch guards blocks the reopened gate.",
      initialDisposition: "Alert and ready to enforce the watch sergeant's decisions.",
    },
    {
      groupId: gatheredCrowd.id,
      observableDescription:
        "Grayhaven residents press against the cordon to watch the reopened stair.",
      initialDisposition: "Restless and curious, but still contained by the guard detail.",
    },
  ],
} as const satisfies SceneDefinition;
