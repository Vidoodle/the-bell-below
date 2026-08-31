import type { FastifyPluginAsync } from "fastify";
import { RunParamsSchema, type RunParams } from "../../shared/run.js";
import type { Adventure } from "../adventure/model.js";
import type { CharacterReader } from "../characters/reader.js";
import type { RunReader } from "../runs/reader.js";
import { resolveRunSceneState } from "./model.js";
import { createScenePresentation } from "./presentation.js";
import type { RunSceneReader } from "./reader.js";

type SceneRoutesOptions = {
  adventure: Adventure;
  runReader: RunReader;
  characterReader: CharacterReader;
  runSceneReader: RunSceneReader;
};

export const sceneRoutes: FastifyPluginAsync<SceneRoutesOptions> = async (
  server,
  options,
) => {
  server.get<{ Params: RunParams }>("/:id/current-scene", {
    schema: { params: RunParamsSchema },
  }, async (request, reply) => {
    const [run, character, storedSceneState] = await Promise.all([
      options.runReader.find(request.params.id),
      options.characterReader.findByRunId(request.params.id),
      options.runSceneReader.findCurrent(request.params.id),
    ]);
    if (!run) return reply.code(404).send({ error: "Run not found." });
    if (!run.prologueCompletedAt) {
      return reply.code(409).send({ error: "Prologue is not complete." });
    }
    if (!character) return reply.code(404).send({ error: "Character not found." });
    if (!storedSceneState) {
      return reply.code(409).send({ error: "Run has no current scene." });
    }
    const sceneState = resolveRunSceneState(options.adventure, storedSceneState);

    return createScenePresentation(
      options.adventure,
      sceneState.sceneId,
      sceneState.phaseId,
      character.protagonist.id,
    );
  });
};
