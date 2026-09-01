import type { ProtagonistId } from "../../../shared/protagonist.js";
import type { Reputation } from "../../../shared/reputation.js";

declare const npcIdBrand: unique symbol;

export type NpcId = string & { readonly [npcIdBrand]: "npc" };

export const npcId = <Value extends string>(value: Value) => value as Value & NpcId;

export type NpcDefinition = Readonly<{
  id: NpcId;
  name: string;
  actsCollectively: boolean;
  protectedFacts: readonly string[];
  initialReputationByProtagonist: Readonly<Record<ProtagonistId, Reputation>>;
}>;
