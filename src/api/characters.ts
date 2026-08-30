import { runCharacterPath } from "../../shared/api";
import type { CharacterSnapshot } from "../../shared/character";
import { readResponse } from "./response";

export async function getRunCharacter(runId: string): Promise<CharacterSnapshot> {
  return readResponse<CharacterSnapshot>(await fetch(runCharacterPath(runId)));
}
