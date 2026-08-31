import type { CharacterSnapshot } from "../shared/character.js";
import type { RunId, RunSnapshot } from "../shared/run.js";
import type { CharacterReader } from "./characters/reader.js";
import { completePrologue } from "./runs/model.js";
import type { RunReader } from "./runs/reader.js";
import type { RunWriter } from "./runs/writer.js";
import type { RunScenePosition, StoredRunSceneState } from "./scenes/model.js";
import type { RunSceneReader } from "./scenes/reader.js";
import type { RunSceneWriter } from "./scenes/writer.js";

type MemoryStorage = {
  runReader: RunReader;
  runWriter: RunWriter;
  characterReader: CharacterReader;
  runSceneReader: RunSceneReader;
  runSceneWriter: RunSceneWriter;
};

export function createMemoryStorage(): MemoryStorage {
  const runs = new Map<RunId, RunSnapshot>();
  const characters = new Map<RunId, CharacterSnapshot>();
  const currentSceneIds = new Map<RunId, string>();
  const sceneStates = new Map<RunId, Map<string, StoredRunSceneState>>();

  function writeSceneState(runId: RunId, position: RunScenePosition) {
    const runStates = sceneStates.get(runId) ?? new Map<string, StoredRunSceneState>();
    const state = { runId, ...position };
    runStates.set(position.sceneId, state);
    sceneStates.set(runId, runStates);
    currentSceneIds.set(runId, position.sceneId);
    return state;
  }

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
      async completePrologue(id, completedAt, initialScene) {
        const run = runs.get(id);
        if (!run) return undefined;
        if (run.prologueCompletedAt) return run;
        const updated = completePrologue(run, completedAt);
        runs.set(id, updated);
        writeSceneState(id, initialScene);
        return updated;
      },
    },
    characterReader: {
      async findByRunId(runId) {
        return characters.get(runId);
      },
    },
    runSceneReader: {
      async find(runId, sceneId) {
        return sceneStates.get(runId)?.get(sceneId);
      },
      async findCurrent(runId) {
        const sceneId = currentSceneIds.get(runId);
        return sceneId ? sceneStates.get(runId)?.get(sceneId) : undefined;
      },
    },
    runSceneWriter: {
      async transition(runId, position) {
        if (!runs.get(runId)?.prologueCompletedAt) return undefined;
        return writeSceneState(runId, position);
      },
    },
  };
}
