import { and, eq } from "drizzle-orm";
import type { RunId } from "../../shared/run.js";
import type { Database } from "../db/client.js";
import { runs } from "../runs/table.js";
import { StorageError } from "../storage-error.js";
import type { StoredRunSceneState } from "./model.js";
import { runSceneStates } from "./table.js";

export interface RunSceneReader {
  find(runId: RunId, sceneId: string): Promise<StoredRunSceneState | undefined>;
  findCurrent(runId: RunId): Promise<StoredRunSceneState | undefined>;
}

export function createPostgresRunSceneReader(database: Database): RunSceneReader {
  async function find(runId: RunId, sceneId: string) {
    const [row] = await database.select({
      runId: runSceneStates.runId,
      sceneId: runSceneStates.sceneId,
      phaseId: runSceneStates.phaseId,
    }).from(runSceneStates)
      .where(and(
        eq(runSceneStates.runId, runId),
        eq(runSceneStates.sceneId, sceneId),
      ))
      .limit(1);
    return row;
  }

  return {
    async find(runId, sceneId) {
      try {
        return await find(runId, sceneId);
      } catch (cause) {
        throw new StorageError("Scene state could not be loaded.", { cause });
      }
    },
    async findCurrent(runId) {
      try {
        const [run] = await database.select({
          currentSceneId: runs.currentSceneId,
        }).from(runs)
          .where(eq(runs.id, runId))
          .limit(1);
        return run?.currentSceneId
          ? await find(runId, run.currentSceneId)
          : undefined;
      } catch (cause) {
        throw new StorageError("Current scene state could not be loaded.", { cause });
      }
    },
  };
}
