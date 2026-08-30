import { eq } from "drizzle-orm";
import type { CharacterCreation, CharacterSnapshot } from "../../shared/character.js";
import type { RunId } from "../../shared/run.js";
import type { Database } from "../db/client.js";
import { StorageError } from "../storage-error.js";
import { createCharacter } from "./model.js";
import { characters } from "./table.js";

export interface CharacterReader {
  findByRunId(runId: RunId): Promise<CharacterSnapshot | undefined>;
}

export function createPostgresCharacterReader(database: Database): CharacterReader {
  return {
    async findByRunId(runId) {
      try {
        const [row] = await database.select({
          id: characters.id,
          runId: characters.runId,
          protagonistId: characters.protagonistId,
          might: characters.might,
          grace: characters.grace,
          wits: characters.wits,
          presence: characters.presence,
        }).from(characters)
          .where(eq(characters.runId, runId))
          .limit(1);
        if (!row) return undefined;

        const input: CharacterCreation = {
          protagonistId: row.protagonistId,
          baseStats: {
            Might: row.might,
            Grace: row.grace,
            Wits: row.wits,
            Presence: row.presence,
          },
        };
        return createCharacter(row.id, row.runId, input);
      } catch (cause) {
        throw new StorageError("Character could not be loaded.", { cause });
      }
    },
  };
}
