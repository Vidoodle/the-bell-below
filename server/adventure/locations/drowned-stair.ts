import { locationId, type LocationDefinition } from "./model.js";

export const drownedStair = {
  id: locationId("drowned-stair"),
  name: "The Drowned Stair",
  description: "The old processional stair descends through Grayhaven's retaining wall into the flooded cathedral close. The city watch holds its reopened gate.",
} as const satisfies LocationDefinition;
