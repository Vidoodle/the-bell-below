import type { RunId, RunSnapshot } from "../../shared/run.js";

export class RunStorageError extends Error {}

export interface RunRepository {
  save(run: RunSnapshot): Promise<void>;
  find(id: RunId): Promise<RunSnapshot | undefined>;
  completePrologue(id: RunId, completedAt: string): Promise<RunSnapshot | undefined>;
}
