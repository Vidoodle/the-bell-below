import type { RunId } from "../../shared/run.js";
import type { Adventure } from "../adventure/model.js";
import { resolveRunScenePosition } from "./model.js";
import type { RunSceneWriter } from "./writer.js";

export function buildTransitionRunScene(
  adventure: Adventure,
  writer: RunSceneWriter,
) {
  return (runId: RunId, sceneId: string, phaseId: string) => (
    writer.transition(runId, resolveRunScenePosition(adventure, sceneId, phaseId))
  );
}
