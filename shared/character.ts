import { Type, type Static } from "@sinclair/typebox";
import {
  ProtagonistIdSchema,
  type ProtagonistSnapshot,
} from "./protagonist.js";
import { sidSchema, type Sid } from "./sid.js";
import { BaseStatsSchema } from "./stats-schema.js";
import type { BaseStats } from "./stats.js";
import type { RunId } from "./run.js";

export type CharacterId = Sid<"char">;

export const CharacterIdSchema = sidSchema("char");

export const CharacterCreationSchema = Type.Object({
  protagonistId: ProtagonistIdSchema,
  baseStats: BaseStatsSchema,
}, { additionalProperties: false });

export type CharacterCreation = Static<typeof CharacterCreationSchema>;
export type CharacterSnapshot = {
  id: CharacterId;
  runId: RunId;
  protagonist: ProtagonistSnapshot;
  baseStats: BaseStats;
  effectiveStats: BaseStats;
};
