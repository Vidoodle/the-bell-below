import { eq } from "drizzle-orm";
import type { CharacterCreation } from "../../shared/character.js";
import type { Database } from "../db/client.js";
import { characters } from "../db/schema/characters.js";
import { runs } from "../db/schema/runs.js";
import { createRun } from "../domain/run.js";
import { RunStorageError, type RunRepository } from "./run-repository.js";

export function createPostgresRunRepository(database: Database): RunRepository {
  return {
    async save(run) {
      const { character } = run;
      const stats = character.baseStats;
      try {
        await database.transaction(async (transaction) => {
          await transaction.insert(characters).values({
            id: character.id,
            protagonistId: character.protagonist.id,
            might: stats.Might,
            grace: stats.Grace,
            wits: stats.Wits,
            presence: stats.Presence,
          });
          await transaction.insert(runs).values({
            id: run.id,
            characterId: character.id,
          });
        });
      } catch (cause) {
        throw new RunStorageError("Run could not be saved.", { cause });
      }
    },
    async find(id) {
      try {
        const [row] = await database
          .select({
            runId: runs.id,
            characterId: characters.id,
            protagonistId: characters.protagonistId,
            might: characters.might,
            grace: characters.grace,
            wits: characters.wits,
            presence: characters.presence,
          })
          .from(runs)
          .innerJoin(characters, eq(characters.id, runs.characterId))
          .where(eq(runs.id, id))
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
        return createRun(row.runId, row.characterId, input);
      } catch (cause) {
        throw new RunStorageError("Run could not be loaded.", { cause });
      }
    },
  };
}
