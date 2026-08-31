# AI-assisted play

## Player promise

The player may attempt any reasonable approach in ordinary language. The game should understand the attempt, resolve it consistently, and remember what happened.

The Bell Below is neither an unrestricted story generator nor a fixed choice tree disguised by a text box. It is an authored RPG whose interaction surface is wider than its visible menu.

## Allocation of authority

Different parts of the system have different authority:

| Concern | Authority |
| --- | --- |
| Lore, hidden truth, principal NPCs, major discoveries, and endings | Authored adventure definitions |
| Action legality, difficulty, random resolution, effects, and ending eligibility | Rules engine |
| Current location, relationships, resources, consequences, and other run history | Committed run state |
| Interpretation of player language and selection among permitted NPC behaviors | AI DM proposals |
| Dialogue, narration, and atmospheric phrasing | AI DM presentation |

The model may propose. It never receives direct authority to change canonical state. The engine validates and commits a complete mechanical result before the model narrates it.

## Authored scenes

An authored scene defines a situation rather than every possible exchange. It establishes:

- the location and observable conditions;
- who is present;
- what the participants want, know, fear, and refuse;
- the obstacle and stakes;
- legal concessions, consequences, and transitions;
- any protected facts or resources the scene cannot invent.

Contextual controls demonstrate useful approaches without exhausting them. Freeform input may discover another reasonable approach, but it must resolve through the same rules and effect vocabulary as an authored suggestion.

## Determinism and variation

For the same committed state, validated action proposal, and random seed, the mechanical result must be reproducible. Narration may vary without changing that result.

Useful variation may come from:

- player-selected approaches;
- seeded dice;
- NPC choices among engine-authorized behaviors;
- different orders of discovery;
- accumulated relationships, resources, and consequences;
- generated dialogue and narration;
- bounded mundane improvisation.

The model does not invent success, difficulty, hidden facts, ending eligibility, or unvalidated consequences. Failure or retry of presentation never rerolls or reapplies mechanics.

## Authored, runtime, and presentation content

Content belongs to one of three categories:

1. **Protected authored content** defines the adventure across runs. Locations, principal NPCs, important items, clues, causal rules, encounters, and endings are server-only, versioned definitions.
2. **Canonical runtime content** belongs to one run. A permitted mundane NPC, object, or environmental detail becomes canonical only after the engine validates it, assigns an identity, and commits it with its originating event.
3. **Presentation-only content** includes narration, dialogue wording, and atmosphere. It may be stored in the transcript, but prose alone does not create structured world state.

A generated entity follows this lifecycle:

`model proposal -> rules validation -> identity assignment -> atomic commit -> narration`

Generated incidental NPCs may provide texture, witnesses, conversation, or ordinary tactical possibilities. They may not become principal NPCs, possess protected knowledge, introduce major resources, reveal secret routes, or acquire unauthorized supernatural importance. Authored and generated NPCs may eventually share run-scoped physical or relationship state, but their profiles have different origins.

## Storage boundary

Authored adventure definitions live in server-only declarative content and are not copied into PostgreSQL merely to make them queryable. Run-specific mutable state and validated generated entities are persisted. The client receives only the observable projection of the current committed state, never the complete adventure catalog.

## Design check

When adding a feature, ask:

- Does this establish truth across every run? It belongs in authored content.
- Can it differ because of play? It belongs in run state.
- Is it only wording or atmosphere? It is presentation.
- Would its existence affect legality or future outcomes? It must be validated and committed as structured state before narration.
- Did the model produce it? Treat it as a proposal until the engine accepts it.

