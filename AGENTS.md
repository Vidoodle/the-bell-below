# Working on The Bell Below

Build the game as a sequence of playable slices. Keep each change focused on the current ticket and the next usable player experience. Do not introduce systems for imagined future requirements.

## Before changing code

- Read the Linear ticket, the relevant product specification, [the AI-assisted play design](docs/game-design/ai-assisted-play.md), applicable files under `docs/lore/`, and any relevant [engineering decisions](docs/decisions/README.md).
- Inspect the existing implementation and tests around the feature before proposing new structure.
- Preserve unrelated work in the working tree.
- Discuss a change first if it alters the data model, adds a dependency, establishes a new cross-cutting abstraction, or substantially changes established architecture.
- Record an accepted, durable architectural choice in a focused file under `docs/decisions/`. Update or supersede the existing decision when one changes; do not create decision records for routine implementation details.

## Code organization

- Organize backend code by domain concept, such as `server/runs/` or `server/characters/`.
- Keep a domain's model, table definition, routes, and persistence code beside that domain. Use focused files such as `model.ts`, `table.ts`, `reader.ts`, and `writer.ts` when those responsibilities exist; do not create ceremonial layers that add no separation.
- Keep domain models independent of Fastify, Drizzle, React, and other infrastructure.
- Keep separate concepts in separate files. Do not grow catch-all files for schemas, models, routes, helpers, or utilities.
- Put code in `shared/` only when it is a genuine client-server contract or shared domain type. Split shared files by concept.
- Keep `server/app.ts` as the composition root: configure the server, connect dependencies, and register route modules there. Route behavior belongs in domain route modules.
- Keep `src/App.tsx` focused on top-level application flow. Screen rendering belongs in `src/screens/`, HTTP calls in `src/api/`, and authored copy in `src/content/`.
- Extract code because it represents a clear responsibility, not merely to reduce line counts. A small cohesive file is better than either a monolith or a web of trivial wrappers.

## Domain and persistence

- The backend owns canonical game state. Browser storage may retain a run ID for recovery, but it is not the source of truth.
- A run and its character are separate relational entities. A character belongs to a run and references the run ID; run endpoints return runs, and character endpoints return characters.
- Fetch separate entities separately unless a concrete use case requires a combined database projection. Do not add joins as a default convenience.
- Access persistence through narrow reader and writer interfaces so domain and route code do not depend directly on PostgreSQL.
- Use Drizzle for typed tables and ordinary queries. Use committed, versioned migrations for schema changes; never create or alter tables during application startup. Reserve raw SQL for database constraints or queries Drizzle cannot express cleanly.
- Use the established typed SID format: a four-character entity prefix followed by 30 lowercase hexadecimal characters, such as `runs...` and `char...`.
- Validate HTTP input with TypeBox at the boundary and enforce important invariants in the domain and database where appropriate.

## Gameplay and lore

- Prefer the smallest end-to-end playable behavior over disconnected setup work.
- Treat an authored scene as a situation with participants, stakes, boundaries, and legal transitions, not as a dialogue tree or a list of every possible player action.
- Keep protected truth and major content in server-only authored definitions, per-run consequences in committed state, and generated prose in presentation. Do not blur these categories for implementation convenience.
- Keep mechanics reproducible from committed state, an accepted AI DM adjudication, and a random seed. The AI DM may classify an attempt, select a stat and contextual difficulty from the supported scale, cite situational factors, propose bounded effects, choose among authorized NPC behaviors, and narrate an outcome. The server must validate the proposal and owns rules limits, randomness, mechanical success, and committed state.
- Treat all model output that would affect future legality or outcomes as a proposal. Validate it, assign any runtime identity, and commit it before narration.
- Keep principal NPCs, major discoveries, important resources, secret routes, and endings authored. Generated entities must be mundane, bounded, run-scoped, and unable to introduce protected knowledge or dramatic authority.
- Commit mechanical outcomes before requesting narration, and make narration retryable without resolving the action again.
- Treat established lore as source material, not filler to rewrite during implementation. Put new canon in the relevant focused file under `docs/lore/`; do not create a single catch-all lore document.

## Tests and review

- Test meaningful behavior, business rules, failure boundaries, regressions, and persistence contracts.
- Do not test framework behavior, private implementation minutiae, or the same invariant redundantly at every layer without a distinct risk being covered.
- Prefer pure unit tests for domain rules, route tests for HTTP contracts, and integration tests for behavior that genuinely depends on PostgreSQL.
- Keep changes as small as the coherent feature permits. There is no mechanical line limit, but remove speculative abstractions, duplicate logic, and unrelated cleanup before review.
- Review the complete diff yourself. Confirm naming and file boundaries still make sense once the implementation is finished.
- Run `pnpm test` and `pnpm build`. For database changes, also run `pnpm db:check` and `pnpm test:integration`; the integration command provisions its own isolated PostgreSQL database when Docker is available.
