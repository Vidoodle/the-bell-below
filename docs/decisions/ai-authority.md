# AI authority

Status: accepted.

## Decision

The game combines authored truth and deterministic mechanics with flexible model interpretation and narration.

An LLM may interpret player intent, propose bounded actions, choose among authorized NPC behaviors, and narrate committed outcomes. It may not establish protected lore, decide mechanical success, bypass validation, or directly mutate canonical state.

Any model output that affects future legality or outcomes is a proposal. The server validates and commits it before narration. Generated important content is not permitted; generated incidental content must be mundane, bounded, and owned by one run.

## Why

This preserves freeform play without allowing narration to contradict the adventure or silently change the rules. The complete operating model is documented in [AI-assisted play](../game-design/ai-assisted-play.md).
