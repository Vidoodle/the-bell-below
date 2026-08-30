import type { FastifyPluginAsync } from "fastify";
import { RunParamsSchema, type RunParams } from "../../shared/run.js";
import type { CharacterReader } from "./reader.js";

type CharacterRoutesOptions = {
  reader: CharacterReader;
};

export const characterRoutes: FastifyPluginAsync<CharacterRoutesOptions> = async (
  server,
  options,
) => {
  server.get<{ Params: RunParams }>("/:id/character", {
    schema: { params: RunParamsSchema },
  }, async (request, reply) => {
    const character = await options.reader.findByRunId(request.params.id);
    return character ?? reply.code(404).send({ error: "Character not found." });
  });
};
