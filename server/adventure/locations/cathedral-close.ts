import { locationId, type LocationDefinition } from "./model.js";

export const cathedralClose = {
  id: locationId("cathedral-close"),
  name: "The Cathedral Close",
  description: "The flooded courtyard and clergy buildings surround Saint Orra's cathedral at the foot of the Drowned Stair.",
} as const satisfies LocationDefinition;
