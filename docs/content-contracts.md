# Content contracts and authoring guide

This document explains the implementation boundary delivered by Linear
milestone 1 (`VID-12` through `VID-20`).

## Dependency direction

```text
domain.ids ───────────────┐
domain.models ────────────┼──> adventure.dsl ──> adventure.schema
domain.actions ───────────┘                           │
                                                     v
                                  adventure.loader ──> adventure.validation
```

The domain and adventure packages import no API framework, ORM, database
driver, frontend code, or model-provider SDK. The rules and content validator
therefore run in a plain Python process.

## Canonical IDs

Each entity category has a frozen Pydantic `RootModel` subclass. Prefixes are
validated at construction and the Python type checker distinguishes, for
example, `LocationId` from `NpcId`. Serialized contracts remain readable
strings such as `location.drowned-nave`.

IDs are stable API and persistence identifiers. Renaming display text does not
change an ID. Changing or removing an ID requires a new content version and an
explicit migration decision.

## Versioning policy

Each run will pin an exact `ContentVersion`. Adventure data lives under:

```text
content/<adventure-slug>/<semantic-version>/
```

The manifest and metadata must agree on the content version. The current
loader rejects unsupported or mismatched data; it does not silently load the
newest directory. A future migration may either transform an old run into a
new schema or explicitly declare the run incompatible. It must never reinterpret
old event payloads under new IDs.

## Predicates and effects

The DSL is a closed, discriminated union. Content may compose predicates and
select from explicit effects; it cannot execute arbitrary Python or mutate an
unmodeled field.

- Predicates are pure and deterministic.
- Effects apply in authored order to a copy of canonical state.
- The resulting state is revalidated before it is returned.
- A resource cannot be driven below zero.
- An item cannot be transferred unless an instance exists in canonical state.
- Reference validation walks nested predicates and every effect target.

Adding a new predicate or effect requires updating the union, evaluator or
application function, reference scanner, and tests together.

## Information boundaries

Facts are classified as:

- `player_discoverable`: safe to expose when its discovery rule is met;
- `npc_restricted`: held only by explicitly authorized NPCs, though an authored
  discovery or disclosure can reveal it to the protagonist;
- `engine_only`: never valid in protagonist knowledge, directly visible
  location facts, or public narration inputs.

NPC knowledge and disclosure are separate. Knowing a fact does not authorize
an NPC to reveal it. Each record contains a source, stance, confidence, and
disclosure predicate. The validator rejects unauthorized knowledge and direct
location exposure of non-public facts.

## Authoring workflow

1. Copy the most recent content directory to a new semantic version.
2. Update both manifest and metadata versions.
3. Preserve stable IDs when the entity retains its identity.
4. Add every new reference target before using it in a predicate or effect.
5. Give every important check explicit success and failure effects.
6. Add or update an ending witness whenever an ending predicate changes.
7. Run:

   ```powershell
   .\.venv\Scripts\python.exe -m ruff format --check backend
   .\.venv\Scripts\python.exe -m ruff check backend
   .\.venv\Scripts\python.exe -m mypy backend\src
   .\.venv\Scripts\python.exe -m pytest
   .\.venv\Scripts\python.exe -m wayfarer.adventure.validation content\the-bell-below\1.0.0\manifest.json --json
   ```

The final command exits nonzero for load or validation errors and includes a
stable code, concrete authored JSON file, and logical source path for every
static issue. Loader failures include the concrete filesystem path and schema
error location.
