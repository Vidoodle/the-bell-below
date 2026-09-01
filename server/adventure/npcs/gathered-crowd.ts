import { npcId, type NpcDefinition } from "./model.js";

export const gatheredCrowd = {
  id: npcId("gathered-crowd"),
  name: "Gathered Crowd",
  actsCollectively: true,
  protectedFacts: [
    "The crowd gathered after the Bell of Mercy began tolling again.",
    "Its members are ordinary people of Grayhaven, not an organized faction.",
  ],
  initialReputationByProtagonist: {
    seren: "friendly",
    veyra: "neutral",
    cael: "friendly",
    riona: "unfriendly",
  },
} as const satisfies NpcDefinition;
