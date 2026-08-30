import { statNames, type BaseStats, type RunSnapshot } from "../../shared/run.js";
import type { CreateRunRequest } from "../../shared/run-schema.js";
import { protagonists } from "./protagonists.js";

export class RunValidationError extends Error {}

export function createRun(id: string, input: CreateRunRequest): RunSnapshot {
  const baseStats = { ...input.baseStats };
  if (statNames.some((stat) => (
    !Number.isInteger(baseStats[stat]) || baseStats[stat] < 1 || baseStats[stat] > 5
  ))) {
    throw new RunValidationError("Base stats must be integers from 1 to 5.");
  }
  if (statNames.reduce((total, stat) => total + baseStats[stat], 0) !== 12) {
    throw new RunValidationError("Base stats must spend exactly 8 points.");
  }

  const protagonist = protagonists[input.protagonistId];
  const effectiveStats = Object.fromEntries(
    statNames.map((stat) => [stat, baseStats[stat] + (protagonist.benefit === stat ? 1 : 0)]),
  ) as BaseStats;
  return { id, protagonist, baseStats, effectiveStats };
}
