import { eq } from "drizzle-orm";
import type { RunId, RunSnapshot } from "../../shared/run.js";
import type { Database } from "../db/client.js";
import { StorageError } from "../storage-error.js";
import { createRun } from "./model.js";
import { runs } from "./table.js";

export interface RunReader {
  find(id: RunId): Promise<RunSnapshot | undefined>;
}

export function createPostgresRunReader(database: Database): RunReader {
  return {
    async find(id) {
      try {
        const [row] = await database.select({
          id: runs.id,
          prologueCompletedAt: runs.prologueCompletedAt,
        }).from(runs)
          .where(eq(runs.id, id))
          .limit(1);

        return row && createRun(row.id, row.prologueCompletedAt?.toISOString() ?? null);
      } catch (cause) {
        throw new StorageError("Run could not be loaded.", { cause });
      }
    },
  };
}
