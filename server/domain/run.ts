import type { CharacterCreation, CharacterId } from "../../shared/character.js";
import type { RunId, RunSnapshot } from "../../shared/run.js";
import { createCharacter } from "./character.js";

export function createRun(
  id: RunId,
  characterId: CharacterId,
  input: CharacterCreation,
  prologueCompletedAt: string | null = null,
): RunSnapshot {
  return { id, character: createCharacter(characterId, input), prologueCompletedAt };
}

export function completePrologue(run: RunSnapshot, completedAt: string): RunSnapshot {
  return run.prologueCompletedAt ? run : { ...run, prologueCompletedAt: completedAt };
}
