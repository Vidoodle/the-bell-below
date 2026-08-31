import { groupId, type GroupDefinition } from "./model.js";

export const gatheredCrowd = {
  id: groupId("gathered-crowd"),
  name: "Gathered Crowd",
  protectedFacts: [
    "The crowd gathered after the Bell of Mercy began tolling again.",
    "Its members are ordinary people of Grayhaven, not an organized faction.",
  ],
} as const satisfies GroupDefinition;
