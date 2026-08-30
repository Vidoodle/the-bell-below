import { and, eq, isNull } from "drizzle-orm";
import type { CharacterSnapshot } from "../../shared/character.js";
import type { RunId, RunSnapshot } from "../../shared/run.js";
import { characters } from "../characters/table.js";
import type { Database } from "../db/client.js";
import { StorageError } from "../storage-error.js";
import type { RunReader } from "./reader.js";
import { runs } from "./table.js";

export interface RunWriter {
  create(run: RunSnapshot, character: CharacterSnapshot): Promise<void>;
  completePrologue(id: RunId, completedAt: string): Promise<RunSnapshot | undefined>;
}

export function createPostgresRunWriter(
  database: Database,
  reader: RunReader,
): RunWriter {
  return {
    async create(run, character) {
      const stats = character.baseStats;
      try {
        await database.transaction(async (transaction) => {
          await transaction.insert(runs).values({ id: run.id });
          await transaction.insert(characters).values({
            id: character.id,
            runId: run.id,
            protagonistId: character.protagonist.id,
            might: stats.Might,
            grace: stats.Grace,
            wits: stats.Wits,
            presence: stats.Presence,
          });
        });
      } catch (cause) {
        throw new StorageError("Run could not be saved.", { cause });
      }
    },
    async completePrologue(id, completedAt) {
      try {
        const timestamp = new Date(completedAt);
        await database.update(runs)
          .set({ prologueCompletedAt: timestamp, updatedAt: timestamp })
          .where(and(eq(runs.id, id), isNull(runs.prologueCompletedAt)));
        return await reader.find(id);
      } catch (cause) {
        throw new StorageError("Run could not be updated.", { cause });
      }
    },
  };
}
