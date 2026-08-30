import type {
  CharacterCreation,
  CharacterId,
  CharacterSnapshot,
} from "../../shared/character.js";
import type { RunId } from "../../shared/run.js";
import { statNames, type BaseStats } from "../../shared/stats.js";
import { protagonists } from "./protagonists.js";

export class CharacterValidationError extends Error {}

export function createCharacter(
  id: CharacterId,
  runId: RunId,
  input: CharacterCreation,
): CharacterSnapshot {
  const baseStats = { ...input.baseStats };
  if (statNames.some((stat) => (
    !Number.isInteger(baseStats[stat]) || baseStats[stat] < 1 || baseStats[stat] > 5
  ))) {
    throw new CharacterValidationError("Base stats must be integers from 1 to 5.");
  }
  if (statNames.reduce((total, stat) => total + baseStats[stat], 0) !== 12) {
    throw new CharacterValidationError("Base stats must spend exactly 8 points.");
  }

  const protagonist = protagonists[input.protagonistId];
  const effectiveStats = Object.fromEntries(
    statNames.map((stat) => [stat, baseStats[stat] + (protagonist.benefit === stat ? 1 : 0)]),
  ) as BaseStats;
  return { id, runId, protagonist, baseStats, effectiveStats };
}
