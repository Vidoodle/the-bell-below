# The Bell Below — Demo Product and Technical Specification

**Status:** Working draft
**Version:** 0.3
**Date:** 2026-08-31
**Product:** Public, single-player, AI-assisted web RPG demo
**Target playtime:** 60–90 minutes

## 1. Product

*The Bell Below* is an authored gothic-fantasy RPG played by telling an AI DM what the protagonist says and does in freeform text. The player chooses one of four pre-written protagonists, assigns their stats, enters a flooded cathedral beneath Grayhaven, and reaches a binding ending through conversation, exploration, resource use, and combat.

The game is not an open-ended story generator. Its central promise is:

> **The AI DM adjudicates the attempt. The rules make the result binding. The adventure owns truth.**

The AI DM runs play: it interprets and adjudicates player ideas, controls NPC decisions, decides whether uncertainty warrants a check, proposes the relevant stat and contextual difficulty, introduces ordinary details when useful, performs dialogue, and narrates committed events. The rules engine validates adjudication proposals, rolls checks, and commits consequences. The underlying model cannot bypass that validation, write state directly, change authored facts, invent major discoveries, or choose an ending.

The demo is for narrative-RPG and tabletop players. It should prove that freeform play can coexist with binding rules, persistent consequences, and authored dramatic quality.

## 2. Scope

The demo contains:

- one 60–90 minute adventure;
- four pre-written protagonists with player-assigned stats;
- six persistent locations;
- three principal NPCs;
- social, exploration, and combat resolution;
- a six-segment pressure clock;
- two deliberate endings plus a failure family covering the final toll, death, or catastrophe;
- anonymous save and resume on the same browser;
- a publicly hosted web client with server-side model access.

It does not include:

- custom protagonists, user-generated campaigns, or procedural world expansion;
- multiplayer, accounts, cross-device saves, or social features;
- a full tabletop ruleset, tactical grid, voice, or native mobile app;
- arbitrary player-created spells, major items, NPCs, locations, or world lore;
- romance or explicit sexual content;
- runtime image generation;
- player-supplied model credentials;
- rewind, save branching, manual rerolls, or recovery after ordinary death.

## 3. Design laws

### 3.1 Canonical truth is structured

The rules engine maintains canonical locations, characters, HP, resources, inventory, relationships, knowledge, clocks, combat, quest state, and endings. The AI DM changes that state through validated adjudication proposals rather than direct model-written mutations. The accepted adjudication and mechanical result commit before narration, so a failed response may be retried without asking for another ruling, rerolling, or applying consequences twice.

### 3.2 The AI DM acts through the rules engine

The AI DM is responsible for running the game. It adjudicates player intent, chooses NPC actions, calls for checks, and causes resulting state changes. It does so through structured resolutions that the rules engine validates, rolls, and commits. No model response can directly bypass that process.

The DM may:

- interpret the player's goal, approach, targets, and flavor;
- decompose a submission into mechanically significant actions;
- classify an action as routine, check, impossible, or clarify;
- select a relevant stat and concrete difficulty from the supported scale, citing the current facts and circumstances that justify them;
- propose stakes and bounded success, failure, and critical effects;
- recognize novel solutions to authored obstacles;
- introduce plausible mundane details and objects;
- choose legal NPC dialogue, movement, attacks, abilities, and other actions from their goals and policies;
- choose among engine-authorized NPC behaviors and concessions;
- render dialogue and narration after resolution.

The rules engine verifies that cited facts exist in the supplied context, the proposed difficulty and modifiers stay within configured or authored bounds, the requested outcome is feasible, and the effects are permitted. It then determines legal costs, performs rolls, commits approved effects, and rejects mutations outside the rules. In product language the AI DM makes the ruling; the separation exists to keep that ruling grounded, auditable, and recoverable.

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
- attempt any reasonable approach in ordinary language without first choosing from a menu;
- see what mechanical action the AI DM inferred;
- see all player-facing dice, modifiers, targets, results, and disclosure-safe contextual factors;
- revisit locations and observe persistent changes;
- learn, conceal, apply, and misrepresent information;
- acquire, use, give, damage, and lose items;
- avoid at least one combat through preparation or social play;
- reach a final choice constrained by accumulated state;
- resume after the last committed action;
- receive a ledger explaining the ending and decisive consequences.

The freeform composer is the primary gameplay control. A future, optional **Suggest an approach** affordance may ask the AI DM for contextual hints from the same observable state. Suggestions are advisory, do not enumerate legal actions, reveal no protected information, and never mutate state.

## 5. Adventure

### 5.1 Premise

The buried Bell of Mercy has begun to toll beneath Grayhaven. For forty years, the church has denied rumors that the flood-dead still walk behind the seals of Saint Orra's drowned cathedral. The priests now fear that the final toll at midnight will break those seals. The protagonist enters through the guarded Drowned Stair to silence the bell before that happens.

The authored truth is immutable: during the siege, the cathedral diverted death from the city into refugees sheltering below. The miracle that saved Grayhaven bound those victims to the bell and erased their sacrifice from official history. Characters may know, misunderstand, conceal, or lie about this truth; the DM cannot replace it.

### 5.2 Structure

**Act I — Descent, 10–15 minutes**

- Establish the protagonist's stake.
- Teach movement, inspection, inventory, and one low-risk check.
- Introduce the Midnight Clock and persistent world state.

**Act II — The drowned cathedral, 30–45 minutes**

- Explore the cathedral in a flexible order.
- Meet conflicting NPCs and uncover the erased history.
- Acquire leverage, tools, or ritual knowledge.
- Face an environmental hazard and an avoidable combat.

**Act III — The final toll, 15–25 minutes**

- The clock or Severin's arrival forces convergence.
- Earlier actions determine allies, opposition, resources, and available resolutions.
- The final encounter combines physical, ritual, and social options.
- Committed state selects the ending.

### 5.3 Locations

1. **The Drowned Stair** — entrance, tutorial, and retreat point.
2. **The Cathedral Close** — flooded courtyard and surrounding precinct outside the cathedral.
3. **The Drowned Nave** — central hub; contains the keeper's refuge and changes as water rises.
4. **The Ossuary Archive** — remains, altered records, wards, and evidence of the erased refugees.
5. **The Chain Cistern** — bell machinery, vertical and water hazards, optional bound spirit, and alternate crypt access.
6. **The Bell Crypt** — final encounter and ending resolution.

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

1. **Reseal the Bell** — preserve Grayhaven, suspend the diverted deaths, and continue binding the dead; the cost remains unresolved.
2. **Free the Dead** — end the binding and allow the undead to die; the fatal wounds diverted during the siege return to the protected survivors who are still alive.
3. **The Final Toll** — failure: the diverted wounds return while the undead remain trapped, or the protagonist dies without a valid intervention.

Immobilizing or removing the clapper may buy time or support another resolution, but it is not a separate ending family.

Ending predicates must be mutually exclusive or have an explicit deterministic priority. Narration expands the selected ending but cannot change it.

## 6. Protagonists

All protagonists are adults with fixed identities, concise histories, personal stakes, and one character benefit. The player assigns their stats after choosing a protagonist. Backgrounds shape authored knowledge, relationships, and access; they do not impose a fixed build or signature ability.

### Seren Holt — The Oathbreaker

- **Benefit:** +1 Might
- **Stake:** Seren helped seal the cathedral during the siege and left people below.
- **Access:** old military relationships and an honored reputation among the city watch.

### Veyra Sable — The Relic Thief

- **Benefit:** +1 Grace
- **Stake:** Veyra was hired to steal a jeweled reliquary while the Drowned Stair is open.
- **Access:** professional experience and criminal contacts that support different approaches to the guarded entrance.

### Brother Cael — The Heretic

- **Benefit:** +1 Wits
- **Stake:** Cael was excommunicated after finding evidence that the church altered the history of Saint Orra's miracle.
- **Access:** ritual literacy, copied archival evidence, and a former relationship with Sister Mara.

### Dame Riona Voss — The Bell-Warden

- **Benefit:** +1 Presence
- **Stake:** Riona was formally commissioned by Grayhaven's council to stop the bell before midnight.
- **Access:** the council's authority and orders requiring the city watch to admit her.

Character variation comes from reactions, routes, knowledge, relationships, personal objectives, and ending modifiers. It does not require separate adventures or a fixed percentage of unique prose.

## 7. Rules

### 7.1 Characters and checks

The player begins with 1 in each of four stats, spends 8 additional points, and may raise each base stat to 5. Every protagonist adds +1 to one stat after allocation, allowing that effective stat to reach 6.

- **Might:** force, endurance, close combat;
- **Grace:** speed, precision, stealth;
- **Wits:** perception, deduction, occult and technical knowledge;
- **Presence:** persuasion, deception, intimidation, composure.

Stats are the only mechanical choices made during protagonist creation. Equipment, conditions, and later game state may modify what a character can do during the adventure.

Uncertain, feasible, consequential actions use:

`d10 + stat + situational modifiers` versus difficulty 7, 9, 11, or 13.

Advantage and disadvantage use two d10s and keep the higher or lower. A natural 10 or 1 has no automatic critical meaning. Critical effects require an explicit authored or rules-bounded outcome predicate and cannot make an impossible action possible.

Each stat point changes the success chance of an unclamped check by ten percentage points. The full effective stat range from 1 to 6 therefore changes the chance by fifty percentage points, making protagonist strengths and weaknesses consequential rather than letting the die dominate them.

The engine does not roll a check with no uncertainty. If the validated minimum total already meets the DV, the action is routine; if the validated maximum total cannot meet it, that protagonist and approach are impossible without some further change in circumstances.

The AI DM proposes a concrete difficulty from the supported scale using the complete relevant context: the attempted outcome and method, character history and capabilities, relationships, leverage, obstacle state, equipment, conditions, and current environment. It must cite the supplied facts that materially raised or lowered the difficulty.

An authored obstacle may specify fixed routine or impossible conditions, a baseline or allowed difficulty range, protected facts, permitted concessions, and bounded consequences. It defines what is true and what may change, not every approach a player might attempt. Improvised tasks use configured global bounds. The engine validates the AI DM's internal fact citations, disclosure-safe rationale, difficulty, modifiers, stakes, and effects before rolling.

Outside combat, cited narrative circumstances normally explain the final DV. Numeric modifiers come from explicit engine-owned effects such as equipment, conditions, assistance, or an established bonus. The same circumstance cannot change the DV and also supply a modifier. Structured combat uses fixed defenses; contextual factors there may instead justify a validated modifier or advantage and disadvantage.

### 7.2 Consequences

Resolved actions select effects from an engine-owned vocabulary. Important authored obstacles may define specific success, failure, and critical outcomes. Improvised outcomes may use generic effects but cannot mutate protected story state.

### 7.3 Conversation

Ordinary conversation is freeform and requires no check. A social check occurs when the player attempts to overcome meaningful resistance: obtaining a withheld concession, sustaining a consequential lie, coercing compliance, or changing an NPC's committed course.

The AI DM identifies the argument and requested outcome, evaluates leverage, relationship state, contradictions, promises, and circumstances, and classifies the exchange as routine, check, impossible, or clarify. A social check uses the AI DM's validated stat and contextual difficulty. Success grants only a concession permitted by the NPC and authored situation.

### 7.4 Combat and action economy

Combat is turn-based and zone-based. A turn normally grants one action and one move to an adjacent zone. Attacks resolve against Guard or Spirit. Damage, cover, engagement, elevation, hazards, and the conditions **Exposed, Hindered, Frightened, Restrained,** and **Bleeding** are structured rules.

The DM decomposes multi-part submissions and validates their total cost against the action economy. Several described motions are allowed when mechanically legal. Excess actions are not executed; the game explains the limit and offers legal alternatives rather than silently choosing a subset.

Combat flavor never overrides resolution. “She feints and drives the blade beneath its ribs” may describe a standard attack, but the final narration describes a wound only if the attack hits. A claimed maneuver grants a mechanical effect only when it maps to a legal ability or validated improvised action.

Core defenses, action economy, damage, and condition rules remain engine-owned. The AI DM may propose bounded situational modifiers or advantage and disadvantage from cited context. For example, Seren's established familiarity with city-watch training may make a particular feint or defensive read easier; the engine verifies that grounding and applies the validated modifier before rolling.

The AI DM chooses NPC actions within authored goals and tactical policies. NPC actions use the same validated action economy, checks, dice, and committed effects as protagonist actions. The player controls only the protagonist. The initial demo does not support recruitable combat companions.

At 0 HP, an authored rescue, capture, or sacrifice occurs only when its predicates are satisfied. Otherwise the protagonist dies and the run ends.

### 7.5 Resources and clock

There is no full rest. Healing and Resolve are scarce, inventory capacity is explicit, and quest-critical objects cannot be silently discarded.

The six-segment Midnight Clock advances from authored time costs, failures, traversal, repeated attempts, and antagonist actions—not once per message. Thresholds change water levels, routes, NPC locations, opposition, and final-event availability.

## 8. Action resolution

Supported action families are:

`MOVE`, `EXAMINE`, `SPEAK`, `SOCIAL_ATTEMPT`, `TAKE`, `GIVE`, `USE_ITEM`, `INTERACT`, `ATTACK`, `DEFEND`, `USE_ABILITY`, `WAIT`, `FLEE`, and `CLARIFY`.

`INTERACT` includes both authored affordances and plausible improvised interactions with observable or reasonably introduced mundane entities.

These families are an internal classification vocabulary, not a player-facing action menu and not an exhaustive list of phrases or approaches. The player submits only freeform text.

For each submission:

1. Persist the player's exact text.
2. Build a bounded AI DM context from observable scene state, relevant authored facts, character history, relationships, equipment, conditions, and recent committed events.
3. Ask the AI DM for a structured adjudication: routine, check, impossible, or clarify; goal, approach, targets, and action costs; and, for a check, stat, difficulty, internal fact citations, a disclosure-safe rationale, stakes, and bounded effects.
4. Resolve references against the observable world.
5. Instantiate any permitted mundane detail required by the proposal.
6. Validate feasibility, protected state, cited facts, difficulty bounds, modifiers, targets, costs, preconditions, stakes, and effects.
7. Clarify only material ambiguity.
8. Persist the accepted adjudication, roll when required, and construct a complete resolved-action event bundle.
9. Apply the transition atomically and persist current state.
10. Ask the AI DM to generate dialogue or narration from the committed adjudication and result, then validate the presentation.

The adjudication context may include relevant hidden obstacle facts tagged with disclosure rules when the AI DM needs them to determine whether observation or investigation is routine, a check, or impossible. Internal citations identify the facts used to validate the ruling; the mechanics display and generated prose may include only a separate disclosure-safe rationale. Adjudication, narration, and future suggestion calls are separate stateless provider requests with explicit context. Player-facing stages receive only facts made observable by committed state.

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
- freeform composer as the primary gameplay control;
- protagonist HP, Resolve, conditions, equipment, and inventory;
- location, exits, characters, and notable objects;
- objectives, clues, and Midnight Clock;
- collapsible mechanics feed;
- initiative, zones, combatants, defenses, and legal combat actions when needed.

The interface acknowledges submissions immediately. Mechanical resolution appears before or alongside concise streamed narration. Invalid actions receive a clear explanation and useful legal alternatives.

Static portraits, location art, and ending images are optional. No runtime image generation appears in the demo.

Generated presentation must describe only committed outcomes and observable facts, preserve undiscovered uncertainty, keep NPC voices distinct, and avoid second-person protagonist narration. Invalid presentation is repaired without changing state.

A future **Suggest an approach** control is a separate, read-only AI DM request. It may offer a few context-sensitive possibilities without implying that they are the only legal actions. It cannot roll, advance time, mutate state, or receive protected facts the player has not earned.

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

- **Web client:** selection, transcript, freeform composer, state panels, combat, and endings.
- **Application API:** run lifecycle, action submission, streaming, and resume.
- **AI DM orchestrator:** interpretation, adjudication, NPC decisions, plausible detail generation, resolution requests, dialogue, and narration.
- **Rules and adventure engine:** validation, action economy, dice, combat, committed effects, authored facts, NPC constraints, clocks, and endings.
- **Persistence:** event ledger, current state, transcript, memories, and content version.
- **Provider adapter:** replaceable access to the initial hosted text model.

The rules and adventure engine must be testable without a live model by supplying deterministic adjudication proposals through a fake AI DM. Automated validated-proposal paths must reach every ending; the player-facing game does not require authored action menus. Adventure content should be declarative where practical, versioned separately from runs, and validated for identifiers, predicates, invariants, and reachability.

## 13. Acceptance criteria

The demo is complete when:

- all four protagonists can begin, resume, complete, and die in a run correctly;
- first-time players can reach an ending in approximately 60–90 minutes;
- both deliberate ending families and the final-toll failure are reachable through tested paths;
- no mandatory progress depends on one successful check;
- at least one combat can be avoided through prior action;
- players can attempt reasonable actions directly through freeform text;
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

- Finalize the adventure bible, six-location graph, three NPC policies, protagonists, assets, and endings.
- Define proposals, effects, facts, knowledge, events, runtime entities, and ending predicates.
- Build static validation and reachability tests.

### Milestone 1 — Headless deterministic slice

- Implement state, persistence, movement, checks, inventory, clock, one NPC interaction, one combat, generic effect validation, and one ending.
- Test structured actions without a model.

### Milestone 2 — Greybox game

- Add protagonist selection, transcript, state panels, freeform composer, combat UI, save/resume, and death.

### Milestone 3 — AI DM integration

- Add AI DM context assembly, structured freeform adjudication, contextual difficulty proposals, multi-action parsing, mundane detail generation, clarification, constrained NPC dialogue, post-commit narrative rendering, validation, streaming, and failure recovery.
- Defer AI-generated approach suggestions until the primary freeform loop is proven in play.

### Milestone 4 — Complete and host

- Finish all locations, NPCs, protagonists, encounters, ending variants, public-run isolation, abuse controls, playtesting, accessibility, and polish.

## 15. Deferred choices

The following may be chosen during implementation or playtesting without changing the product thesis:

- concise versus moderately novelistic prose density;
- static art package;
- initial model provider;
- open access, invite code, or daily play allowance;
- portfolio, validation, or commercial follow-on positioning;
- Severin's objective and role now that controlling the bell is not an ending.
