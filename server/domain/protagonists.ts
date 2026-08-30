import type { ProtagonistId, ProtagonistSnapshot } from "../../shared/run.js";

export const protagonists = {
  seren: { id: "seren", name: "Seren Holt", benefit: "Might" },
  veyra: { id: "veyra", name: "Veyra Sable", benefit: "Grace" },
  cael: { id: "cael", name: "Brother Cael", benefit: "Wits" },
  riona: { id: "riona", name: "Dame Riona Voss", benefit: "Presence" },
} as const satisfies Record<ProtagonistId, ProtagonistSnapshot>;
