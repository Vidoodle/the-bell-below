import { npcId, type NpcDefinition } from "./model.js";

export const watchSergeant = {
  id: npcId("watch-sergeant"),
  name: "Watch Sergeant",
  description: "The officer responsible for deciding who passes the cordon.",
  initialReputationByProtagonist: {
    seren: "friendly",
    veyra: "neutral",
    cael: "unfriendly",
    riona: "trusted",
  },
} as const satisfies NpcDefinition;
