import fastifyStatic from "@fastify/static";
import Fastify, { type FastifyError } from "fastify";
import { resolve } from "node:path";
import type { CharacterId } from "../shared/character.js";
import { runsPath } from "../shared/api.js";
import type { RunId } from "../shared/run.js";
import { handleError } from "./api/errors.js";
import { runRoutes } from "./api/runs.js";
import { CharacterValidationError } from "./domain/character.js";
import { createCharacterId, createRunId } from "./domain/ids.js";
import { createMemoryRunRepository } from "./storage/memory-run-repository.js";
import { RunStorageError, type RunRepository } from "./storage/run-repository.js";

type ServerOptions = {
  production?: boolean;
  createCharacterId?: () => CharacterId;
  createRunId?: () => RunId;
  runs?: RunRepository;
};

export function buildServer({
  production = false,
  createCharacterId: makeCharacterId = createCharacterId,
  createRunId: makeRunId = createRunId,
  runs = createMemoryRunRepository(),
}: ServerOptions = {}) {
  const server = Fastify({ logger: production });

  server.setErrorHandler<FastifyError | CharacterValidationError | RunStorageError>(handleError);
  server.register(runRoutes, {
    prefix: runsPath,
    runs,
    createCharacterId: makeCharacterId,
    createRunId: makeRunId,
  });

  if (production) {
    server.register(fastifyStatic, { root: resolve("dist") });
  }

  return server;
}
