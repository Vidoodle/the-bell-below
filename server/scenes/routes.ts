import type { FastifyPluginAsync } from "fastify";
import { RunParamsSchema, type RunParams } from "../../shared/run.js";
import type { Adventure } from "../adventure/model.js";
import type { CharacterReader } from "../characters/reader.js";
import type { RunReader } from "../runs/reader.js";
import { createScenePresentation } from "./presentation.js";

type SceneRoutesOptions = {
  adventure: Adventure;
  runReader: RunReader;
  characterReader: CharacterReader;
};

export const sceneRoutes: FastifyPluginAsync<SceneRoutesOptions> = async (
  server,
  options,
) => {
  server.get<{ Params: RunParams }>("/:id/current-scene", {
    schema: { params: RunParamsSchema },
  }, async (request, reply) => {
    const [run, character] = await Promise.all([
      options.runReader.find(request.params.id),
      options.characterReader.findByRunId(request.params.id),
    ]);
    if (!run) return reply.code(404).send({ error: "Run not found." });
    if (!run.prologueCompletedAt) {
      return reply.code(409).send({ error: "Prologue is not complete." });
    }
    if (!character) return reply.code(404).send({ error: "Character not found." });

    return createScenePresentation(
      options.adventure,
      options.adventure.initialSceneId,
      character.protagonist.id,
    );
  });
};
