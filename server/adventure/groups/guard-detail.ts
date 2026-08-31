import { groupId, type GroupDefinition } from "./model.js";

export const guardDetail = {
  id: groupId("guard-detail"),
  name: "Guard Detail",
  protectedFacts: [
    "The detail is part of Grayhaven's city watch.",
    "It has been ordered to hold the Drowned Stair cordon.",
  ],
} as const satisfies GroupDefinition;
