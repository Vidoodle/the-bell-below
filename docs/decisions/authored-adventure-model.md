# Authored adventure model

Status: accepted.

## Decision

An `Adventure` is the validated, server-only package of authored locations, scenes, and NPCs. `AdventureContent` is the unprocessed collection used to construct it.

- A location is a persistent authored place within the adventure.
- A scene is an authored situation anchored to exactly one location.
- An NPC is adventure-scoped and may appear in multiple scenes.
- A scene's `initialNpcIds` identify the authored NPCs present when that situation begins. The scene does not own them.

The adventure indexes definitions by branded IDs and validates uniqueness and references. A location does not also store its scene IDs; scenes are found from their `locationId`, avoiding two sources of truth.

Mutable location, scene, and NPC state belongs to a run. Generated incidental NPCs are also run-owned and do not alter the authored adventure.

## Why

The adventure is a connected graph, not an inheritance hierarchy or a tree of nested objects. This model lets NPCs move between situations, keeps authored truth reusable across runs, and separates static content from consequences produced during play.
