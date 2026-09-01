# AI-assisted play

## Player promise

The player may attempt any reasonable approach in ordinary language. The game should understand the attempt, resolve it consistently, and remember what happened.

The Bell Below is neither an unrestricted story generator nor a fixed choice tree disguised by a text box. Freeform text is the primary gameplay control; the game does not require a visible menu of authored actions.

## Allocation of authority

Different parts of the system have different authority:

| Concern | Authority |
| --- | --- |
| Lore, hidden truth, principal NPCs, major discoveries, and endings | Authored adventure definitions |
| Stat catalog, check scale, resources, action and effect vocabulary, and campaign-specific rules | Campaign definitions |
| Situation invariants, protected information, obstacle bounds, permitted concessions, and ending predicates | Authored adventure definitions |
| Current location, relationships, resources, consequences, and other run history | Committed run state |
| Interpretation, routine/check/infeasible/clarify classification, stat choice, contextual difficulty, stakes, and selection among permitted NPC behaviors | AI DM adjudication proposals |
| Proposal validation, action economy, random resolution, effect commitment, and ending eligibility | Rules engine |
| Dialogue, narration, and atmospheric phrasing | AI DM presentation |

The AI DM makes the contextual ruling, but it never receives direct authority to change canonical state. The engine verifies the proposal's identifiers, classification-specific shape, authored and configured bounds, and permitted effects. It does not attempt to mechanically prove that the model made the best narrative judgment. Prompting, representative evaluations, and playtesting cover that quality boundary. The engine then rolls and commits a complete mechanical result before the AI DM narrates it.

## Primary interaction loop

The player submits what the protagonist says or does in ordinary language. For the first playable slice, the server rebuilds an explicit request context for every model call from:

- relevant setting and campaign rules;
- the active protagonist, location, scene, NPC, and group definitions, including information stored directly on those definitions;
- canonical current run state, including stats, resources, relationships, location, scene phase, and committed consequences;
- the complete player-facing transcript for the current scene, ending with the player's latest message; and
- the campaign's allowed stat, difficulty, and effect vocabulary.

The provider is not the game's memory. Each adjudication and narration call is stateless from the application's point of view; continuity comes from the context the server sends.

Adjudication may require protected authored information—for example, that an apparently ordinary wall conceals something searchable. The server may include that information in the adjudication context while withholding it from presentation. Adjudication, narration, and suggestion calls remain separate requests; narration and suggestions receive only information that the committed state permits them to reveal.

The transcript is narrative memory, not canonical mechanics. If narration says that Cael was wounded and passed the guards, the server must also have committed the life loss and scene transition. Prose alone cannot establish a condition, resource change, relationship, discovery, or legal transition.

The prototype does not require a generic fact table, event/participant memory graph, semantic retrieval, summaries, or compaction. Authored information stays on the character, NPC, group, location, or scene that owns it. Run-specific mechanical consequences stay in canonical run state. The complete current-scene transcript supplies conversational continuity. Longer-run memory and context compaction are deferred until the playable game demonstrates a real context limit.

The AI DM returns a structured adjudication:

- **routine** when the attempt is feasible and no meaningful uncertainty or resistance warrants a roll;
- **check** with a relevant stat, concrete difficulty, a disclosure-safe explanation of the important contextual factors, stakes, and bounded effects;
- **infeasible** when the requested outcome contradicts established truth or exceeds what the approach can accomplish;
- **clarify** when different reasonable interpretations would materially change risk, cost, target, or outcome.

The AI DM judges feasibility from the requested outcome, the stated approach, the protagonist's capabilities, available tools, time, and the physical and supernatural limits of the setting. Fighting through a guard cordon may be an Impossible-rated check because extraordinary luck could still carry it. Creating a tunnel to the keep through solid ground by applying Might alone is infeasible and receives no roll. If different tools, time, or circumstances could make a superficially similar plan plausible, the AI DM evaluates that materially different approach instead of treating the outcome phrase in isolation.

The server resolves references, validates the proposal, persists the accepted adjudication, rolls if required, and commits the result atomically. Only then does the AI DM receive the committed result for dialogue and narration. Retrying interpretation, delivery, or narration must not produce a second ruling or roll for the same accepted action.

The four classifications and committed-action lifecycle are reusable. The check payload receives its available stat identifiers, difficulty scale, effect vocabulary, and other mechanical bounds from the active campaign package. Provider-neutral orchestration must not hardcode *The Bell Below*'s stat names or content IDs, even though the first implementation only needs to exercise this campaign.

## Authored scenes

An authored scene defines a situation rather than every possible exchange or player approach. It establishes:

- the location and observable conditions;
- who is present;
- what the participants want, know, fear, and refuse;
- obstacle invariants, any fixed routine or infeasible conditions, and optional baseline or bounded difficulty guidance;
- legal concessions, consequence vocabulary, and transitions;
- any protected information or resources the scene cannot invent.

Authors do not enumerate every persuasive argument, investigative method, combat maneuver, or sequence a player might attempt. The AI DM evaluates the submitted approach against the authored situation and full relevant run context. The rules engine prevents a creative ruling from granting an impossible concession, inventing protected content, or committing an unsupported effect.

## Contextual difficulty

*The Bell Below* checks use `d10 + stat + situational modifiers` against 5, 7, 9, 11, 13, or 15. Each stat point changes the ordinary success chance by ten percentage points, so the effective stat range from 1 to 6 expresses a meaningful character strength or weakness. The AI DM selects the concrete difficulty and relevant stat from the active campaign's supplied catalog using the attempted outcome, method, protagonist history, relationships, leverage, obstacle state, equipment, conditions, environment, and established scene transcript.

Advantage and disadvantage roll two d10s and keep the higher or lower. When the kept d10 is a natural 10, roll one non-exploding d8 luck die and add it to the total. A natural 1 has no extra penalty. A natural 10 is not automatic success, and neither face alone authorizes a critical effect.

Routine is a semantic AI DM ruling for an action that does not warrant a check; it is not derived from a 100% success probability. Once an accepted action is classified as a check, the server always rolls it. A 100% check is presented as **Trivial**, and the committed total and margin inform how the AI DM narrates the quality of the attempt. Margin alone cannot grant additional mechanical effects. A requested outcome that the approach cannot produce remains infeasible and receives no roll.

An authored obstacle may fix a difficulty when the fiction genuinely supports one stable challenge, or provide a baseline or allowed range. Most obstacles should instead author their resistance, boundaries, and possible consequences, leaving the AI DM to evaluate unanticipated approaches. The engine validates the selected value, modifier limits, referenced game entities, and effects. It may reject a structurally or mechanically invalid proposal and request a corrected adjudication. Representative evaluations detect unsupported narrative judgments that deterministic validation cannot prove.

For exploration and social play, the AI DM's disclosure-safe contextual factors normally explain the final difficulty. Numeric modifiers are reserved for explicit structured effects such as equipment, conditions, assistance, or an established bonus. A factor applies once: it cannot lower the difficulty and also add a bonus. This separation must be visible in the resolved mechanics.

Combat retains engine-owned action economy, fixed defenses, damage, and conditions. The AI DM may propose bounded situational modifiers or advantage and disadvantage from grounded context—for example, a protagonist's established familiarity with an opponent's training—but cannot rewrite core combat rules or alter a fixed defense directly.

## Determinism and variation

For the same committed state, accepted adjudication, and random seed, the mechanical result must be reproducible. The accepted adjudication is persisted so retries do not ask the model to choose another stat, difficulty, or consequence. Narration may vary without changing that result.

Useful variation may come from:

- player-selected approaches;
- seeded dice;
- NPC choices among engine-authorized behaviors;
- different orders of discovery;
- accumulated relationships, resources, and consequences;
- generated dialogue and narration;
- bounded mundane improvisation.

The model does not invent success, hidden facts, ending eligibility, or unvalidated consequences. It may propose contextual difficulty as part of adjudication, but the engine owns the supported scale, bounds, validation, roll, and committed result. Failure or retry of presentation never readjudicates, rerolls, or reapplies mechanics.

## Optional suggestions

AI-generated suggestions are a future assistance feature, not the main interaction model. A player may explicitly ask for a hint, causing a separate read-only AI DM call over the observable current state. The response may offer a few possible approaches, but it does not define legality, submit an action, roll, advance time, mutate state, or reveal protected information. The initial freeform loop must be usable without this feature.

## Authored, runtime, and presentation content

Content belongs to one of three categories:

1. **Protected authored content** defines the adventure across runs. Locations, principal NPCs, important items, clues, causal rules, encounters, and endings are server-only, versioned definitions.
2. **Canonical runtime content** belongs to one run. A permitted mundane NPC, object, or environmental detail becomes canonical only after the engine validates it, assigns an identity, and commits it as part of an accepted action.
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

