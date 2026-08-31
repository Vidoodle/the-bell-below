# Backend language and HTTP framework

Status: accepted.

## Decision

The backend uses Node.js and TypeScript. Fastify handles HTTP routing and server composition, while TypeBox defines runtime request schemas that also produce TypeScript types.

`server/app.ts` is the composition root. Routes live with their domain, and domain models do not depend on Fastify or TypeBox.

## Why

The client already uses TypeScript, so this keeps one language and toolchain across the application. Fastify provides routing, validation integration, error handling, and plugins without requiring a large application framework. TypeBox keeps boundary validation and request types aligned.

Python with Flask was considered and remains viable in isolation, but a second language did not provide a demonstrated benefit for this project. Raw Node HTTP handling would require application code for concerns the framework already handles.
