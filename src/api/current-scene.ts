import { runCurrentScenePath } from "../../shared/api";
import type { CurrentScenePresentation } from "../../shared/current-scene";
import { readResponse } from "./response";

export async function getCurrentScene(runId: string): Promise<CurrentScenePresentation> {
  return readResponse<CurrentScenePresentation>(await fetch(runCurrentScenePath(runId)));
}
