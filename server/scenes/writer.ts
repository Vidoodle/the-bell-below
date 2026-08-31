import { and, eq, isNotNull } from "drizzle-orm";
import type { RunId } from "../../shared/run.js";
import type { Database } from "../db/client.js";
import { runs } from "../runs/table.js";
import { StorageError } from "../storage-error.js";
import type { RunScenePosition, RunSceneState } from "./model.js";
import { runSceneStates } from "./table.js";

export interface RunSceneWriter {
  transition(
    runId: RunId,
    position: RunScenePosition,
  ): Promise<RunSceneState | undefined>;
}

export function createPostgresRunSceneWriter(database: Database): RunSceneWriter {
  return {
    async transition(runId, position) {
      try {
        return await database.transaction(async (transaction) => {
          const updatedAt = new Date();
          const [run] = await transaction.update(runs)
            .set({ currentSceneId: position.sceneId, updatedAt })
            .where(and(
              eq(runs.id, runId),
              isNotNull(runs.prologueCompletedAt),
            ))
            .returning({ id: runs.id });
          if (!run) return undefined;

          await transaction.insert(runSceneStates).values({
            runId,
            sceneId: position.sceneId,
            phaseId: position.phaseId,
            updatedAt,
          }).onConflictDoUpdate({
            target: [runSceneStates.runId, runSceneStates.sceneId],
            set: { phaseId: position.phaseId, updatedAt },
          });
          return { runId, ...position };
        });
      } catch (cause) {
        throw new StorageError("Scene state could not be updated.", { cause });
      }
    },
  };
}
