import { Type, type Static } from "@sinclair/typebox";
import type { Stat } from "./stats.js";

export const ProtagonistIdSchema = Type.Union([
  Type.Literal("seren"),
  Type.Literal("veyra"),
  Type.Literal("cael"),
  Type.Literal("riona"),
]);

export type ProtagonistId = Static<typeof ProtagonistIdSchema>;
export type ProtagonistSnapshot = {
  id: ProtagonistId;
  name: string;
  benefit: Stat;
};
