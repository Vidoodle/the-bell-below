import type { CharacterCreation, CharacterId } from "../../shared/character.js";
import type { RunId, RunSnapshot } from "../../shared/run.js";
import { createCharacter } from "./character.js";

export function createRun(
  id: RunId,
  characterId: CharacterId,
  input: CharacterCreation,
): RunSnapshot {
  return { id, character: createCharacter(characterId, input) };
}
