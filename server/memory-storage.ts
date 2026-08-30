import type { CharacterSnapshot } from "../shared/character.js";
import type { RunId, RunSnapshot } from "../shared/run.js";
import type { CharacterReader } from "./characters/reader.js";
import { completePrologue } from "./runs/model.js";
import type { RunReader } from "./runs/reader.js";
import type { RunWriter } from "./runs/writer.js";

type MemoryStorage = {
  runReader: RunReader;
  runWriter: RunWriter;
  characterReader: CharacterReader;
};

export function createMemoryStorage(): MemoryStorage {
  const runs = new Map<RunId, RunSnapshot>();
  const characters = new Map<RunId, CharacterSnapshot>();

  return {
    runReader: {
      async find(id) {
        return runs.get(id);
      },
    },
    runWriter: {
      async create(run, character) {
        runs.set(run.id, run);
        characters.set(character.runId, character);
      },
      async completePrologue(id, completedAt) {
        const run = runs.get(id);
        if (!run) return undefined;
        const updated = completePrologue(run, completedAt);
        runs.set(id, updated);
        return updated;
      },
    },
    characterReader: {
      async findByRunId(runId) {
        return characters.get(runId);
      },
    },
  };
}
