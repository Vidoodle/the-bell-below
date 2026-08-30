import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { CharacterValidationError } from "../domain/character.js";
import { RunStorageError } from "../storage/run-repository.js";

export function handleError(
  this: FastifyInstance,
  error: FastifyError | CharacterValidationError | RunStorageError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof CharacterValidationError) {
    return reply.code(400).send({ error: error.message });
  }

  if (error instanceof RunStorageError) {
    request.log.error({ err: error }, "Run storage error");
    return reply.code(503).send({ error: "Run storage is unavailable." });
  }

  const status = error.statusCode ?? 500;
  if (status < 500) {
    const message = status === 413 ? "Request body is too large." : "Invalid request.";
    return reply.code(status).send({ error: message });
  }

  request.log.error({ err: error }, "Unhandled request error");
  return reply.code(500).send({ error: "Internal server error." });
}
