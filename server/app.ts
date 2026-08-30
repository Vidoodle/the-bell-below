import fastifyStatic from "@fastify/static";
import Fastify, { type FastifyError } from "fastify";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { runsPath } from "../shared/api.js";
import { handleError } from "./api/errors.js";
import { runRoutes } from "./api/runs.js";
import { RunValidationError } from "./domain/run.js";
import { createMemoryRunRepository } from "./storage/memory-run-repository.js";

type ServerOptions = {
  production?: boolean;
  createId?: () => string;
};

export function buildServer({ production = false, createId = randomUUID }: ServerOptions = {}) {
  const server = Fastify({ logger: production });
  const runs = createMemoryRunRepository();

  server.setErrorHandler<FastifyError | RunValidationError>(handleError);
  server.register(runRoutes, { prefix: runsPath, runs, createId });

  if (production) {
    server.register(fastifyStatic, { root: resolve("dist") });
  }

  return server;
}
