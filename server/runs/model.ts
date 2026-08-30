import type { RunId, RunSnapshot } from "../../shared/run.js";

export function createRun(
  id: RunId,
  prologueCompletedAt: string | null = null,
): RunSnapshot {
  return { id, prologueCompletedAt };
}

export function completePrologue(run: RunSnapshot, completedAt: string): RunSnapshot {
  return run.prologueCompletedAt ? run : { ...run, prologueCompletedAt: completedAt };
}
