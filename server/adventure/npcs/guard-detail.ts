import { npcId, type NpcDefinition } from "./model.js";

export const guardDetail = {
  id: npcId("guard-detail"),
  name: "Guard Detail",
  actsCollectively: true,
  protectedFacts: [
    "The detail is part of Grayhaven's city watch.",
    "It has been ordered to hold the Drowned Stair cordon.",
  ],
  initialReputationByProtagonist: {
    seren: "friendly",
    veyra: "neutral",
    cael: "unfriendly",
    riona: "trusted",
  },
} as const satisfies NpcDefinition;
