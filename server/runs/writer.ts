import { and, eq, isNull } from "drizzle-orm";
import type { CharacterSnapshot } from "../../shared/character.js";
import type { RunId, RunSnapshot } from "../../shared/run.js";
import { characters } from "../characters/table.js";
import type { Database } from "../db/client.js";
import type { RunScenePosition } from "../scenes/model.js";
import { runSceneStates } from "../scenes/table.js";
import { StorageError } from "../storage-error.js";
import type { RunReader } from "./reader.js";
import { runs } from "./table.js";

export interface RunWriter {
  create(run: RunSnapshot, character: CharacterSnapshot): Promise<void>;
  completePrologue(
    id: RunId,
    completedAt: string,
    initialScene: RunScenePosition,
  ): Promise<RunSnapshot | undefined>;
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
    async completePrologue(id, completedAt, initialScene) {
      try {
        const timestamp = new Date(completedAt);
        await database.transaction(async (transaction) => {
          const [completed] = await transaction.update(runs)
            .set({
              prologueCompletedAt: timestamp,
              currentSceneId: initialScene.sceneId,
              updatedAt: timestamp,
            })
            .where(and(eq(runs.id, id), isNull(runs.prologueCompletedAt)))
            .returning({ id: runs.id });
          if (!completed) return;

          await transaction.insert(runSceneStates).values({
            runId: id,
            sceneId: initialScene.sceneId,
            phaseId: initialScene.phaseId,
            updatedAt: timestamp,
          });
        });
        return await reader.find(id);
      } catch (cause) {
        throw new StorageError("Run could not be updated.", { cause });
      }
    },
  };
}
