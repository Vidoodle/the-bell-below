# Authored adventure model

Status: accepted.

## Decision

An `Adventure` is the validated, server-only package of authored locations, scenes, NPCs, and collective groups. `AdventureContent` is the unprocessed collection used to construct it.

This is the authored-content model for one campaign package, not the universal definition of the engine. A future campaign may surround its adventure content with different stat, character, rules, resource, and effect definitions while reusing the same orchestration and committed-action lifecycle. The current implementation should inject its selected `Adventure` into reusable consumers rather than importing one *The Bell Below* singleton, but it should not add a generic plugin system before a second campaign creates a concrete need.

- A location is a persistent authored place within the adventure.
- A scene is an authored situation anchored to exactly one location.
- An NPC is adventure-scoped and may appear in multiple scenes.
- A scene's `initialNpcIds` identify the authored NPCs present when that situation begins. The scene does not own them.
- A scene catalogs its content-defined phase IDs and identifies its initial phase. Phase IDs have meaning only within that scene and are validated by the Adventure rather than enumerated in the database schema.
- A collective group is an adventure-scoped identity with reusable protected facts, without the personal identity, judgment, goals, knowledge, or memories of an NPC.
- A scene's group participation records which collective group is present, how it appears to the player, and its initial disposition in that situation. The scene does not own the group definition.
- An NPC records its typed initial reputation toward each authored protagonist. The server selects the active protagonist's reputation when it builds a presentation instead of exposing the full authored map. Changes during play belong to per-run NPC state.

The adventure indexes definitions by branded IDs and validates uniqueness and references. A location does not also store its scene IDs; scenes are found from their `locationId`, avoiding two sources of truth.

Mutable location, scene, NPC, and group state belongs to a run. Generated incidental NPCs are also run-owned and do not alter the authored adventure.

## Why

The adventure is a connected graph, not an inheritance hierarchy or a tree of nested objects. This model lets NPCs and collective groups participate in multiple situations, keeps authored truth reusable across runs, and separates static content from consequences produced during play. Modeling groups separately avoids giving a crowd or guard detail artificial personal identity merely to reuse the NPC model.
