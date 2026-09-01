import { locationId, type LocationDefinition } from "./model.js";

export const drownedStair = {
  id: locationId("drowned-stair"),
  name: "The Drowned Stair",
  description:
    "For forty years, Grayhaven's retaining wall has sealed the only intact landward passage into the flooded Lower Ward. Tonight, its gate stands open. Beyond it, the old processional stair descends toward Saint Orra's cathedral, where the Bell of Mercy has begun to toll again.",
} as const satisfies LocationDefinition;
