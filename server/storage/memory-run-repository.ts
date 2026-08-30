import type { RunSnapshot } from "../../shared/run.js";
import type { RunRepository } from "./run-repository.js";

export function createMemoryRunRepository(): RunRepository {
  const runs = new Map<string, RunSnapshot>();
  return {
    async save(run) {
      runs.set(run.id, run);
    },
    async find(id) {
      return runs.get(id);
    },
  };
}
