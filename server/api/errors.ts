import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { RunValidationError } from "../domain/run.js";

export function handleError(
  this: FastifyInstance,
  error: FastifyError | RunValidationError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof RunValidationError) {
    return reply.code(400).send({ error: error.message });
  }

  const status = error.statusCode ?? 500;
  if (status < 500) {
    const message = status === 413 ? "Request body is too large." : "Invalid request.";
    return reply.code(status).send({ error: message });
  }

  request.log.error({ err: error }, "Unhandled request error");
  return reply.code(500).send({ error: "Internal server error." });
}
