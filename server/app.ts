import fastifyStatic from "@fastify/static";
import Fastify, { type FastifyError } from "fastify";
import { resolve } from "node:path";
import type { CharacterId } from "../shared/character.js";
import { runsPath } from "../shared/api.js";
import type { RunId } from "../shared/run.js";
import type { CharacterReader } from "./characters/reader.js";
import { characterRoutes } from "./characters/routes.js";
import { CharacterValidationError } from "./characters/model.js";
import { handleError } from "./error-handler.js";
import { createCharacterId, createRunId } from "./ids.js";
import { createMemoryStorage } from "./memory-storage.js";
import { buildCreateRun } from "./runs/create.js";
import type { RunReader } from "./runs/reader.js";
import { runRoutes } from "./runs/routes.js";
import type { RunWriter } from "./runs/writer.js";
import { StorageError } from "./storage-error.js";

type ServerOptions = {
  production?: boolean;
  createCharacterId?: () => CharacterId;
  createRunId?: () => RunId;
  now?: () => string;
  runReader?: RunReader;
  runWriter?: RunWriter;
  characterReader?: CharacterReader;
};

export function buildServer(options: ServerOptions = {}) {
  const memory = createMemoryStorage();
  const runReader = options.runReader ?? memory.runReader;
  const runWriter = options.runWriter ?? memory.runWriter;
  const characterReader = options.characterReader ?? memory.characterReader;
  const createRun = buildCreateRun({
    writer: runWriter,
    createCharacterId: options.createCharacterId ?? createCharacterId,
    createRunId: options.createRunId ?? createRunId,
  });
  const server = Fastify({ logger: options.production ?? false });

  server.setErrorHandler<FastifyError | CharacterValidationError | StorageError>(handleError);
  server.register(runRoutes, {
    prefix: runsPath,
    createRun,
    reader: runReader,
    writer: runWriter,
    now: options.now ?? (() => new Date().toISOString()),
  });
  server.register(characterRoutes, {
    prefix: runsPath,
    reader: characterReader,
  });

  if (options.production) {
    server.register(fastifyStatic, { root: resolve("dist") });
  }

  return server;
}
