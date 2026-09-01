# AI DM context and memory for the playable prototype

Status: accepted.

Date: 2026-09-01.

## Decision

The application, not the model provider, owns gameplay continuity. It persists the player-facing transcript and makes a fresh, explicit request for each AI DM adjudication and narration call.

For the initial Drowned Stair slice, each adjudication request includes the relevant campaign rules, active protagonist, current location and scene, present NPCs, including collectives, canonical run state, the complete current-scene transcript ending with the latest player message, and the campaign-owned stat, difficulty, and effect vocabulary. Narration receives the transcript plus the already committed ruling and result, but only the authored and runtime information it is allowed to reveal. The resulting presentation is appended to the transcript.

Authored information remains attached to the definition that owns it: a protagonist, NPC, location, or scene. The prototype will not normalize that prose into a generic fact model with kinds, subjects, sources, or citation IDs. Run-specific mechanical consequences remain structured canonical state. Transcript prose provides narrative continuity but cannot create or override mechanics.

The prototype will not implement a generic event-memory graph, semantic retrieval, tagged long-term memories, transcript summaries, or compaction. The complete current-scene transcript is small enough for the first playable slice. A separate future change will address context growth when multiple scenes or measured token limits make it necessary, without replacing canonical state with generated summaries.

## Why

This is the smallest design that lets the AI DM understand the authored setting and the conversation so far while keeping the game resumable and provider-neutral. It avoids requiring a speculative memory architecture before there is playable evidence about what must be remembered, retrieved, or compacted.
