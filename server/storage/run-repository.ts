import type { RunSnapshot } from "../../shared/run.js";

export interface RunRepository {
  save(run: RunSnapshot): Promise<void>;
  find(id: string): Promise<RunSnapshot | undefined>;
}
