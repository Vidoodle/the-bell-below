# Authored adventure model

Status: accepted.

## Decision

An `Adventure` is the validated, server-only package of authored locations, scenes, and NPCs. `AdventureContent` is the unprocessed collection used to construct it.

This is the authored-content model for one campaign package, not the universal definition of the engine. A future campaign may surround its adventure content with different stat, character, rules, resource, and effect definitions while reusing the same orchestration and committed-action lifecycle. The current implementation should inject its selected `Adventure` into reusable consumers rather than importing one *The Bell Below* singleton, but it should not add a generic plugin system before a second campaign creates a concrete need.

- A location is a persistent authored place within the adventure.
- A scene is an authored situation anchored to exactly one location.
- An NPC is adventure-scoped and may appear in multiple scenes. An NPC may represent one individual or a collective whose members generally act in unison; `actsCollectively` records that behavioral distinction without creating a separate entity type.
- A scene's `initialNpcParticipations` identify every authored NPC present when that situation begins, along with its observable description and situation-specific initial disposition. The scene does not own them.
- A scene catalogs its content-defined phase IDs and identifies its initial phase. Phase IDs have meaning only within that scene and are validated by the Adventure rather than enumerated in the database schema.
- Every NPC records reusable protected facts and a typed initial reputation toward each authored protagonist. The server selects the active protagonist's reputation when it builds a presentation instead of exposing the full authored map. Changes during play belong to per-run NPC state.

The adventure indexes definitions by branded IDs and validates uniqueness and references. A location does not also store its scene IDs; scenes are found from their `locationId`, avoiding two sources of truth.

Mutable location, scene, and NPC state belongs to a run. Generated incidental NPCs are also run-owned and do not alter the authored adventure.

## Why

The adventure is a connected graph, not an inheritance hierarchy or a tree of nested objects. This model lets individual and collective NPCs participate in multiple situations, keeps authored truth reusable across runs, and separates static content from consequences produced during play. Treating collectives as NPCs gives every actor the same identity, reputation, presentation, and future state path while preserving their in-unison behavior as explicit authored data.
