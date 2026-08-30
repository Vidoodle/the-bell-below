import type { FastifyPluginAsync } from "fastify";
import {
  CreateRunRequestSchema,
  RunParamsSchema,
  type CreateRunRequest,
  type RunParams,
  type RunId,
} from "../../shared/run.js";
import type { CharacterId } from "../../shared/character.js";
import { createRun } from "../domain/run.js";
import type { RunRepository } from "../storage/run-repository.js";

type RunRoutesOptions = {
  runs: RunRepository;
  createCharacterId: () => CharacterId;
  createRunId: () => RunId;
};

export const runRoutes: FastifyPluginAsync<RunRoutesOptions> = async (server, options) => {
  server.post<{ Body: CreateRunRequest }>("/", {
    schema: { body: CreateRunRequestSchema },
  }, async (request, reply) => {
    const run = createRun(
      options.createRunId(),
      options.createCharacterId(),
      request.body,
    );
    await options.runs.save(run);
    return reply.code(201).send(run);
  });

  server.get<{ Params: RunParams }>("/:id", {
    schema: { params: RunParamsSchema },
  }, async (request, reply) => {
    const run = await options.runs.find(request.params.id);
    return run ?? reply.code(404).send({ error: "Run not found." });
  });
};
