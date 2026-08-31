# AI authority

Status: accepted.

Updated: 2026-08-31.

## Decision

The game combines authored truth and deterministic mechanics with flexible AI DM adjudication and narration. Freeform text is the primary gameplay control; authored action suggestions are not required.

The AI DM may interpret player intent; classify an attempt as routine, check, impossible, or clarify; select a stat and contextual difficulty from the supported scale; cite relevant fact identifiers for internal validation; propose a disclosure-safe rationale plus bounded stakes and effects; choose among authorized NPC behaviors; and narrate committed outcomes. Explicit engine-owned effects supply numeric modifiers outside combat, and no circumstance may affect both the difficulty and a modifier.

Any AI DM output that affects future legality or outcomes remains a proposal. The server validates cited facts, authored and configured bounds, action economy, feasibility, costs, and effects. The server owns randomness, mechanical success, atomic commitment, and ending selection. The AI DM may not establish protected lore, bypass validation, or directly mutate canonical state.

Authored obstacles define truth, resistance, fixed conditions where necessary, permitted concessions, and consequence boundaries rather than enumerating every possible player approach. Generated important content is not permitted; generated incidental content must be mundane, bounded, and owned by one run.

## Why

This gives the AI DM enough discretion to adjudicate unanticipated actions and character-specific circumstances without requiring authors to predefine every permutation. Persisting and validating the adjudication keeps that discretion grounded, auditable, retryable, and subordinate to authored truth and binding mechanics. The complete operating model is documented in [AI-assisted play](../game-design/ai-assisted-play.md).
