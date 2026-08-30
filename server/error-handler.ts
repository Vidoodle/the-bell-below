import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { CharacterValidationError } from "./characters/model.js";
import { StorageError } from "./storage-error.js";

export function handleError(
  this: FastifyInstance,
  error: FastifyError | CharacterValidationError | StorageError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof CharacterValidationError) {
    return reply.code(400).send({ error: error.message });
  }

  if (error instanceof StorageError) {
    request.log.error({ err: error }, "Storage error");
    return reply.code(503).send({ error: "Game storage is unavailable." });
  }

  const status = error.statusCode ?? 500;
  if (status < 500) {
    const message = status === 413 ? "Request body is too large." : "Invalid request.";
    return reply.code(status).send({ error: message });
  }

  request.log.error({ err: error }, "Unhandled request error");
  return reply.code(500).send({ error: "Internal server error." });
}
