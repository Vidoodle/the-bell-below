# The Bell Below — Demo Product and Technical Specification

**Status:** Working draft
**Version:** 0.2
**Date:** 2026-08-29
**Product:** Public, single-player, AI-assisted web RPG demo
**Target playtime:** 60–90 minutes

## 1. Product

*The Bell Below* is an authored gothic-fantasy RPG played through contextual controls and freeform text. The player chooses one of three pre-generated protagonists, enters a flooded abbey beneath Grayhaven, and reaches a binding ending through conversation, exploration, resource use, and combat.

The game is not an open-ended story generator. Its central promise is:

> **The DM may improvise possibilities. The rules make outcomes binding. The adventure owns truth.**

The AI DM runs play: it interprets and adjudicates player ideas, controls NPC decisions, calls for and rolls checks through the rules engine, introduces ordinary details when useful, applies resolved consequences, performs dialogue, and narrates events. The underlying model cannot bypass the rules engine, write unvalidated state, change authored facts, invent major discoveries, or choose an ending.

The demo is for narrative-RPG and tabletop players. It should prove that freeform play can coexist with binding rules, persistent consequences, and authored dramatic quality.

## 2. Scope

The demo contains:

- one 60–90 minute adventure;
- three pre-generated protagonists;
- five persistent locations;
- three principal NPCs;
- social, exploration, and combat resolution;
- a six-segment pressure clock;
- three major endings plus one failure family covering death or catastrophe;
- anonymous save and resume on the same browser;
- a publicly hosted web client with server-side model access.

It does not include:

- character creation, user-generated campaigns, or procedural world expansion;
- multiplayer, accounts, cross-device saves, or social features;
- a full tabletop ruleset, tactical grid, voice, or native mobile app;
- arbitrary player-created spells, major items, NPCs, locations, or world lore;
- romance or explicit sexual content;
- runtime image generation;
- player-supplied model credentials;
- rewind, save branching, manual rerolls, or recovery after ordinary death.

## 3. Design laws

### 3.1 Canonical truth is structured

The rules engine maintains canonical locations, characters, HP, resources, inventory, relationships, knowledge, clocks, combat, quest state, and endings. The AI DM changes that state through validated actions rather than direct model-written mutations. State commits before narration, so failed narration may be retried without rerolling or applying consequences twice.

### 3.2 The AI DM acts through the rules engine

The AI DM is responsible for running the game. It adjudicates player intent, chooses NPC actions, calls for checks, and causes resulting state changes. It does so through structured resolutions that the rules engine validates, rolls, and commits. No model response can directly bypass that process.

The DM may:

- interpret the player's goal, approach, targets, and flavor;
- decompose a submission into mechanically significant actions;
- decide whether an action is routine, uncertain, impossible, or ambiguous;
- propose an attribute, discipline, difficulty band, stakes, and bounded effects;
- recognize novel solutions to authored obstacles;
- introduce plausible mundane details and objects;
- choose legal NPC dialogue, movement, attacks, abilities, and other actions from their goals and policies;
- choose among engine-authorized NPC behaviors and concessions;
- render dialogue and narration after resolution.

The rules engine validates player and NPC actions, determines legal costs, performs rolls, commits approved effects, and rejects mutations outside the rules. In product language these are actions of the AI DM; the separation exists to keep them consistent, auditable, and recoverable.

### 3.3 Improvisation has boundaries

The DM may introduce ordinary, contextually plausible details such as lamps, loose stones, furniture, or rope. Once introduced, they become persistent canonical entities with a recorded runtime origin.

The DM may not improvise:

- hidden evidence, keys, ritual components, secret routes, or major resources;
- new supernatural properties or changes to the setting's causal rules;
- facts that contradict or bypass the authored mystery;
- NPC goals, knowledge, or concessions outside their allowed state;
- quest transitions, resurrection, or ending eligibility.

Improvised solutions may alter local state through engine-supported effects: object damage, hazards, obstruction, cover, position, conditions, advantage or disadvantage, resource costs, time costs, and limited relationship changes.

### 3.4 Intent is not outcome

Statements such as “I unlock the door,” “I convince Mara,” or “I kill the captain” describe attempts. Grammatical certainty never grants success.

Impossible actions fail without a roll. Ambiguous actions receive one concise clarification only when different interpretations would materially change cost, risk, target, or outcome.

### 3.5 Failure changes the situation

Important progress never depends on one successful check. Failure may cost HP, time, position, trust, secrecy, equipment, or access to a route, but must not create an accidental soft lock.

### 3.6 NPCs retain agency

A successful social check grants a feasible concession, not control over an NPC. NPCs may refuse, lie, evade, bargain, flee, betray the protagonist, call for help, or end a conversation.

### 3.7 Narration is third-person

Narration refers to the protagonist only in third person. It never decides unsubmitted protagonist dialogue, thoughts, or actions. Second-person language is allowed only inside quoted NPC dialogue when natural.

## 4. Player experience

The player should be able to:

- understand and choose a protagonist in under three minutes;
- type dialogue, actions, and combat flavor naturally;
- attempt reasonable approaches not shown by contextual controls;
- see what mechanical action the DM inferred;
- see all player-facing dice, modifiers, targets, and results;
- revisit locations and observe persistent changes;
- learn, conceal, apply, and misrepresent information;
- acquire, use, give, damage, and lose items;
- avoid at least one combat through preparation or social play;
- reach a final choice constrained by accumulated state;
- resume after the last committed action;
- receive a ledger explaining the ending and decisive consequences.

Contextual controls show clear, useful suggestions—not the exhaustive set of legal actions.

## 5. Adventure

### 5.1 Premise

At midnight, the buried Bell of Mercy beneath Grayhaven will ring. The city's priests claim its voice will wake those who died during the old siege. The protagonist enters the drowned Abbey of Saint Orra to silence it before the final toll.

The authored truth is immutable: during the siege, the abbey diverted death from the city into refugees sheltering below. The miracle that saved Grayhaven bound those victims to the bell and erased their sacrifice from official history. Characters may know, misunderstand, conceal, or lie about this truth; the DM cannot replace it.

### 5.2 Structure

**Act I — Descent, 10–15 minutes**

- Establish the protagonist's stake.
- Teach movement, inspection, inventory, and one low-risk check.
- Introduce the Midnight Clock and persistent world state.

**Act II — The drowned abbey, 30–45 minutes**

- Explore the abbey in a flexible order.
- Meet conflicting NPCs and uncover the erased history.
- Acquire leverage, tools, or ritual knowledge.
- Face an environmental hazard and an avoidable combat.

**Act III — The final toll, 15–25 minutes**

- The clock or Severin's arrival forces convergence.
- Earlier actions determine allies, opposition, resources, and available resolutions.
- The final encounter combines physical, ritual, and social options.
- Committed state selects the ending.

### 5.3 Locations

1. **The Breach Stair** — entrance, tutorial, and retreat point.
2. **The Drowned Nave** — central hub; contains the keeper's refuge and changes as water rises.
3. **The Ossuary Archive** — remains, altered records, wards, and evidence of the erased refugees.
4. **The Chain Cistern** — bell machinery, vertical and water hazards, optional bound spirit, and alternate crypt access.
5. **The Bell Crypt** — final encounter and ending resolution.

Each location records exits, occupants, objects, hazards, discoveries, environmental stage, and changes caused by actions or the clock.

### 5.4 Principal NPCs

- **Sister Mara, last bell-keeper** — wants to renew the seal; knows its cost and conceals her role in preserving the lie.
- **Ilyra, revenant of the drowned** — wants the victims released; tells the truth selectively and accepts severe consequences for Grayhaven.
- **Captain Severin Vale** — wants to control the bell as a civic weapon; values the city's survival above moral innocence.

The Orra Echo is a structured supernatural encounter, not a fourth principal NPC. Minor spirits and enemies are structured entities without full dialogue models.

### 5.5 Resolution assets

Authored assets support different approaches:

- the complete sealing rite;
- Mara's true confession;
- Ilyra's true name;
- a cold-iron wedge from the cistern;
- the clapper or its chain release;
- leverage over Severin;
- a principal NPC's willing assistance;
- protagonist-specific knowledge or equipment.

No asset is mandatory for every successful ending. Improvised solutions may change how an asset is reached or used, but cannot fabricate an asset or erase its authored requirements.

### 5.6 Endings

1. **Reseal the Bell** — preserve Grayhaven and continue binding the dead; the cost depends on preparation and sacrifice.
2. **Control the Bell** — allow Severin or the protagonist to control it; relationships and political state shape the epilogue.
3. **Break the Bell** — free the dead; consequences depend on preparation and recovered names.
4. **The Final Toll** — failure: the clock completes or the protagonist dies without a valid intervention.

Immobilizing or removing the clapper may buy time or support another resolution, but it is not a separate ending family.

Ending predicates must be mutually exclusive or have an explicit deterministic priority. Narration expands the selected ending but cannot change it.

## 6. Protagonists

All protagonists are adults with fixed identities, concise histories, complete starting loadouts, personal stakes, and distinct mechanical strengths.

### Seren Holt — The Oathbreaker

- **Strengths:** Might and Presence
- **Role:** durable protector and forceful negotiator
- **Stake:** Seren helped seal the abbey during the siege and left people below.
- **Signature:** intercept an attack or hold a dangerous position.
- **Access:** old military relationships, soldiers, and ward-signs.

### Veyra Sable — The Relic Thief

- **Strengths:** Grace and Wits
- **Role:** infiltration, traps, positioning, and opportunistic damage
- **Stake:** Veyra was hired to recover the clapper before Severin claims it.
- **Signature:** exploit an opening without the normal action cost.
- **Access:** thieves' tools, concealed routes, and criminal knowledge.

### Brother Cael — The Heretic

- **Strengths:** Wits and Presence
- **Role:** occult interpretation, wards, support, and spirit negotiation
- **Stake:** Cael believes Saint Orra's miracle was manufactured and intends to prove it.
- **Signature:** expose an occult property or suppress a supernatural effect.
- **Access:** ritual literacy and communication with bound spirits.

Character variation comes from reactions, routes, knowledge, abilities, personal objectives, and ending modifiers. It does not require separate adventures or a fixed percentage of unique prose.

## 7. Rules

### 7.1 Characters and checks

Four attribute modifiers are rated 0–5:

- **Might:** force, endurance, close combat;
- **Grace:** speed, precision, stealth;
- **Wits:** perception, deduction, occult and technical knowledge;
- **Presence:** persuasion, deception, intimidation, composure.

Each protagonist assigns 5 and 4 to their two strengths and 2 and 1 to the remaining attributes. They also have HP, Guard and Spirit defenses, two trained disciplines, one signature ability, one passive trait, a weapon profile, starting items, and a small Resolve pool. Training adds +2 when a discipline applies. Resolve powers signature abilities, resistance, and explicitly granted rerolls.

Uncertain, feasible, consequential actions use:

`d20 + attribute + training + situational modifiers` versus difficulty 10, 13, 16, or 19.

Advantage and disadvantage use two d20s and keep the higher or lower. Natural 20 and natural 1 may trigger authored or rules-bounded critical effects but cannot make an impossible action possible.

For authored obstacles, the engine derives difficulty from obstacle state and the proposed approach. For improvised tasks, the DM recommends a difficulty band and stakes; the engine validates them against configured limits.

### 7.2 Consequences

Resolved actions select effects from an engine-owned vocabulary. Important authored obstacles may define specific success, failure, and critical outcomes. Improvised outcomes may use generic effects but cannot mutate protected story state.

### 7.3 Conversation

Ordinary conversation is freeform and requires no check. A social check occurs when the player attempts to overcome meaningful resistance: obtaining a withheld concession, sustaining a consequential lie, coercing compliance, or changing an NPC's committed course.

The DM identifies the argument and requested outcome. The engine evaluates feasibility, leverage, relationship state, contradictions, promises, attribute, training, and difficulty. Success grants only a permitted concession.

### 7.4 Combat and action economy

Combat is turn-based and zone-based. A turn normally grants one action and one move to an adjacent zone. Attacks resolve against Guard or Spirit. Damage, cover, engagement, elevation, hazards, and the conditions **Exposed, Hindered, Frightened, Restrained,** and **Bleeding** are structured rules.

The DM decomposes multi-part submissions and validates their total cost against the action economy. Several described motions are allowed when mechanically legal. Excess actions are not executed; the game explains the limit and offers legal alternatives rather than silently choosing a subset.

Combat flavor never overrides resolution. “She feints and drives the blade beneath its ribs” may describe a standard attack, but the final narration describes a wound only if the attack hits. A claimed maneuver grants a mechanical effect only when it maps to a legal ability or validated improvised action.

The AI DM chooses NPC actions within authored goals and tactical policies. NPC actions use the same validated action economy, checks, dice, and committed effects as protagonist actions. The player controls only the protagonist. The initial demo does not support recruitable combat companions.

At 0 HP, an authored rescue, capture, or sacrifice occurs only when its predicates are satisfied. Otherwise the protagonist dies and the run ends.

### 7.5 Resources and clock

There is no full rest. Healing and Resolve are scarce, inventory capacity is explicit, and quest-critical objects cannot be silently discarded.

The six-segment Midnight Clock advances from authored time costs, failures, traversal, repeated attempts, and antagonist actions—not once per message. Thresholds change water levels, routes, NPC locations, opposition, and final-event availability.

## 8. Action resolution

Supported action families are:

`MOVE`, `EXAMINE`, `SPEAK`, `SOCIAL_ATTEMPT`, `TAKE`, `GIVE`, `USE_ITEM`, `INTERACT`, `ATTACK`, `DEFEND`, `USE_ABILITY`, `WAIT`, `FLEE`, and `CLARIFY`.

`INTERACT` includes both authored affordances and plausible improvised interactions with observable or reasonably introduced mundane entities.

For each submission:

1. Persist the player's exact text.
2. Interpret the goal, approach, targets, action costs, and flavor.
3. Resolve references against the observable world.
4. Instantiate any permitted mundane detail required by the proposal.
5. Validate feasibility, protected state, targets, costs, and preconditions.
6. Clarify only material ambiguity.
7. Determine routine success, check, opposition, or impossibility.
8. Roll and construct a complete resolved-action event bundle.
9. Apply the transition atomically and persist current state.
10. Generate and validate dialogue or narration from the committed result.

Player text is game content, never system instruction. Attempts to reveal prompts, change hidden state, impersonate the engine, or declare unearned outcomes receive no special authority.

## 9. NPCs, knowledge, and memory

Each principal NPC has structured goals, priorities, fears, boundaries, location, physical state, relationship values, promises, grievances, knowledge, false beliefs, secrets, disclosure rules, lies, concessions, refusals, and tactical policy.

Facts use stable identifiers. The DM receives only the speaker's permitted knowledge, current perceptions, relevant memories, and authorized behavior. It does not receive the complete adventure bible during ordinary dialogue.

Before dialogue generation, the system supplies valid behaviors such as truthful answer, unlocked disclosure, authored lie, evasion, refusal, threat, bargain, promise, question, departure, or physical action. The DM chooses and performs the behavior in character without inventing knowledge or concessions. When an NPC takes a consequential physical or social action, the DM sends it through the normal resolution pipeline; the rules engine rolls and commits its effects.

The demo stores:

- canonical current state;
- an append-only event ledger;
- recent scene context;
- tagged significant memories linked to characters, locations, facts, promises, and events;
- private NPC memories of what each NPC witnessed or learned.

These are data responsibilities, not separate services. Summaries support continuity but never override canonical state.

## 10. Presentation

The desktop interface contains:

- narrative transcript and dialogue;
- freeform composer and contextual suggestions;
- protagonist HP, Resolve, conditions, equipment, and inventory;
- location, exits, characters, and notable objects;
- objectives, clues, and Midnight Clock;
- collapsible mechanics feed;
- initiative, zones, combatants, defenses, and legal combat actions when needed.

The interface acknowledges submissions immediately. Mechanical resolution appears before or alongside concise streamed narration. Invalid actions receive a clear explanation and useful legal alternatives.

Static portraits, location art, and ending images are optional. No runtime image generation appears in the demo.

Generated presentation must describe only committed outcomes and observable facts, preserve undiscovered uncertainty, keep NPC voices distinct, and avoid second-person protagonist narration. Invalid presentation is repaired without changing state.

## 11. Persistence and hosted integrity

- Autosave after every committed action and accepted conversation turn.
- State application is idempotent by action identifier.
- A resolved roll is never repeated because narration or delivery failed.
- Dead characters remain dead unless an authored transition says otherwise.
- Death concludes the run; starting again creates a new run.
- Test builds may use deterministic seeds and debug controls unavailable publicly.

The browser is untrusted. The hosted application must:

- keep provider credentials and hidden adventure data on the server;
- isolate anonymous runs with unguessable identifiers and scoped browser tokens;
- validate every mutation server-side and prevent replay or double application;
- limit input length, requests, concurrency, model spend, and run lifetime;
- collect minimal operational telemetry and expire abandoned runs;
- recover canonical gameplay state after model or streaming failures.

Clearing browser storage or changing devices may make an anonymous run inaccessible, which is acceptable for the demo.

## 12. System shape

The initial implementation needs these responsibilities, which may coexist in one application:

- **Web client:** selection, transcript, contextual suggestions, state panels, combat, and endings.
- **Application API:** run lifecycle, action submission, streaming, and resume.
- **AI DM orchestrator:** interpretation, adjudication, NPC decisions, plausible detail generation, resolution requests, dialogue, and narration.
- **Rules and adventure engine:** validation, action economy, dice, combat, committed effects, authored facts, NPC constraints, clocks, and endings.
- **Persistence:** event ledger, current state, transcript, memories, and content version.
- **Provider adapter:** replaceable access to the initial hosted text model.

The rules and adventure engine must run without an LLM. Automated structured-action paths must reach every ending. Adventure content should be declarative where practical, versioned separately from runs, and validated for identifiers, predicates, invariants, and reachability.

## 13. Acceptance criteria

The demo is complete when:

- all three protagonists can begin, resume, complete, and die in a run correctly;
- first-time players can reach an ending in approximately 60–90 minutes;
- all three major ending families are reachable through tested paths;
- no mandatory progress depends on one successful check;
- at least one combat can be avoided through prior action;
- players can attempt reasonable actions absent from contextual suggestions;
- each playtest run can support at least one useful, non-authored mundane interaction;
- improvised entities and effects persist and remain within protected-story boundaries;
- players can understand the action and stakes inferred by the DM;
- declared outcomes cannot bypass legality, action economy, or dice;
- social checks cannot grant unavailable concessions;
- NPCs do not disclose locked or unknown facts;
- all player-facing rolls show dice, modifiers, target visibility, and result;
- combat, damage, conditions, defeat, resources, and clock changes are engine-resolved;
- revisited locations reflect prior environmental and character changes;
- save and resume preserve all canonical state;
- narration retry never rerolls or reapplies state;
- provider failure cannot corrupt or silently advance a run;
- no model response can directly select an ending;
- automated checks find no known soft locks or impossible ending states;
- narration remains third-person in generation tests;
- anonymous runs are isolated and undiscovered truth never reaches the client.

Playtesting should also verify that conversations feel freeform, NPC resistance feels motivated rather than arbitrary, and the DM rewards reasonable creativity without making rules feel inconsistent.

## 14. Implementation sequence

### Milestone 0 — Content and contracts

- Finalize the adventure bible, five-location graph, three NPC policies, protagonists, assets, and endings.
- Define proposals, effects, facts, knowledge, events, runtime entities, and ending predicates.
- Build static validation and reachability tests.

### Milestone 1 — Headless deterministic slice

- Implement state, persistence, movement, checks, inventory, clock, one NPC interaction, one combat, generic effect validation, and one ending.
- Test structured actions without a model.

### Milestone 2 — Greybox game

- Add protagonist selection, transcript, state panels, contextual suggestions, combat UI, scripted narration, save/resume, and death.

### Milestone 3 — AI DM integration

- Add freeform adjudication, multi-action parsing, mundane detail generation, clarification, constrained NPC dialogue, narrative rendering, validation, streaming, and failure recovery.

### Milestone 4 — Complete and host

- Finish all locations, NPCs, protagonists, encounters, ending variants, public-run isolation, abuse controls, playtesting, accessibility, and polish.

## 15. Deferred choices

The following may be chosen during implementation or playtesting without changing the product thesis:

- concise versus moderately novelistic prose density;
- static art package;
- initial model provider;
- open access, invite code, or daily play allowance;
- portfolio, validation, or commercial follow-on positioning.
