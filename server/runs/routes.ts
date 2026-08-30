import type { FastifyPluginAsync } from "fastify";
import {
  CreateRunRequestSchema,
  RunParamsSchema,
  type CreateRunRequest,
  type RunParams,
} from "../../shared/run.js";
import type { CreateRun } from "./create.js";
import type { RunReader } from "./reader.js";
import type { RunWriter } from "./writer.js";

type RunRoutesOptions = {
  createRun: CreateRun;
  reader: RunReader;
  writer: RunWriter;
  now: () => string;
};

export const runRoutes: FastifyPluginAsync<RunRoutesOptions> = async (server, options) => {
  server.post<{ Body: CreateRunRequest }>("/", {
    schema: { body: CreateRunRequestSchema },
  }, async (request, reply) => (
    reply.code(201).send(await options.createRun(request.body))
  ));

  server.get<{ Params: RunParams }>("/:id", {
    schema: { params: RunParamsSchema },
  }, async (request, reply) => {
    const run = await options.reader.find(request.params.id);
    return run ?? reply.code(404).send({ error: "Run not found." });
  });

  server.post<{ Params: RunParams }>("/:id/prologue", {
    schema: { params: RunParamsSchema },
  }, async (request, reply) => {
    const run = await options.writer.completePrologue(request.params.id, options.now());
    return run ?? reply.code(404).send({ error: "Run not found." });
  });
};
