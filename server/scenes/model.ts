import type { RunId } from "../../shared/run.js";
import type { Adventure } from "../adventure/model.js";
import type { SceneId, ScenePhaseId } from "../adventure/scenes/model.js";

export type StoredRunSceneState = Readonly<{
  runId: RunId;
  sceneId: string;
  phaseId: string;
}>;

export type RunScenePosition = Readonly<{
  sceneId: SceneId;
  phaseId: ScenePhaseId;
}>;

export type RunSceneState = Readonly<{
  runId: RunId;
  sceneId: SceneId;
  phaseId: ScenePhaseId;
}>;

export class RunSceneValidationError extends Error {}

export function resolveRunScenePosition(
  adventure: Adventure,
  sceneId: string,
  phaseId: string,
): RunScenePosition {
  const scene = adventure.scenes.get(sceneId as SceneId);
  if (!scene) throw new RunSceneValidationError(`Unknown scene ${sceneId}.`);

  const authoredPhaseId = scene.phaseIds.find((candidate) => candidate === phaseId);
  if (!authoredPhaseId) {
    throw new RunSceneValidationError(`Unknown phase ${phaseId} for scene ${sceneId}.`);
  }
  return { sceneId: scene.id, phaseId: authoredPhaseId };
}

export function resolveRunSceneState(
  adventure: Adventure,
  stored: StoredRunSceneState,
): RunSceneState {
  return {
    runId: stored.runId,
    ...resolveRunScenePosition(adventure, stored.sceneId, stored.phaseId),
  };
}

export function initialRunScenePosition(adventure: Adventure): RunScenePosition {
  const scene = adventure.scenes.get(adventure.initialSceneId);
  if (!scene) {
    throw new RunSceneValidationError(`Unknown initial scene ${adventure.initialSceneId}.`);
  }
  return { sceneId: scene.id, phaseId: scene.initialPhaseId };
}
