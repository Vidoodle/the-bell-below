import { drownedStair } from "../locations/drowned-stair.js";
import { gatheredCrowd } from "../npcs/gathered-crowd.js";
import { guardDetail } from "../npcs/guard-detail.js";
import { watchSergeant } from "../npcs/watch-sergeant.js";
import { sceneId, scenePhaseId, type SceneDefinition } from "./model.js";

export const guardedEntranceInitialPhaseId = scenePhaseId("guarded");

export const guardedEntrance = {
  id: sceneId("guarded-entrance"),
  locationId: drownedStair.id,
  title: "The Guarded Descent",
  description:
    "The tolling has drawn a restless crowd to the upper landing, hungry for a glimpse of the cathedral the Church kept sealed below. A disciplined line of city-watch guards holds them behind a cordon while the watch sergeant decides who may pass. The flooded cathedral close lies at the foot of the stair, with Saint Orra's cathedral beyond it. The Bell must be silenced before midnight; the way down runs through the sergeant's gate.",
  initialPhaseId: guardedEntranceInitialPhaseId,
  phaseIds: [guardedEntranceInitialPhaseId],
  initialNpcParticipations: [
    {
      npcId: watchSergeant.id,
      observableDescription: "The officer responsible for deciding who passes the cordon.",
      initialDisposition: "Attentive and prepared to judge each request for passage.",
    },
    {
      npcId: guardDetail.id,
      observableDescription: "A disciplined line of city-watch guards blocks the reopened gate.",
      initialDisposition: "Alert and ready to enforce the watch sergeant's decisions.",
    },
    {
      npcId: gatheredCrowd.id,
      observableDescription:
        "Grayhaven residents press against the cordon to watch the reopened stair.",
      initialDisposition: "Restless and curious, but still contained by the guard detail.",
    },
  ],
} as const satisfies SceneDefinition;
