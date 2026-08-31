# Run scene state

Status: accepted.

## Decision

A run stores its current authored scene ID. Per-scene progress is stored separately in `run_scene_states`, keyed by run ID and authored scene ID, so leaving a scene does not discard its committed phase.

Authored scene and phase IDs remain text references in PostgreSQL. The application validates them against the server-side Adventure before use or transition; database constraints do not enumerate content. The current location is derived from the current scene's authored definition and is not duplicated in run state.

Completing the prologue initializes the opening scene and its initial phase in the same transaction. A later transition atomically updates the run's current scene and upserts the target scene's phase while preserving every other scene's state.

## Why

The database owns mutable progress without becoming a second adventure catalog. Composite per-scene state supports revisiting locations, while content-neutral text references allow scenes and phases to be added without schema migrations.
