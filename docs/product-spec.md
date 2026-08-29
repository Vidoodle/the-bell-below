# The Bell Below — Demo Product Specification

Status: canonical demo specification  
Target experience: one complete 60–90 minute web adventure

## 1. Product thesis

The Bell Below is a curated gothic-fantasy role-playing game that combines a
deterministic game engine with language-model dialogue.

The engine owns reality. It decides what exists, what an actor knows, whether
an action is legal, which check is required, how combat resolves, and which
consequences become true. A language model may interpret freeform intent and
render dialogue or narration, but it cannot directly overwrite canonical
state, invent permissions, reveal hidden knowledge, or declare success.

This is deliberately more authored than an open-ended AI sandbox. The campaign
controls the major story beats while still allowing meaningful choices,
conversation, exploration, combat, failure, and multiple endings.

## 2. Demo promise

A player can:

1. Choose one of four pregenerated protagonists.
2. Enter the dungeon beneath the bell.
3. Explore persistent locations.
4. Talk with persistent NPCs who have private knowledge, motives, and changing
   attitudes.
5. Use structured controls or submit freeform intent.
6. Resolve uncertain actions with real checks and dice.
7. Fight using explicit combat rules and tracked resources.
8. Change quest and world state through engine-owned consequences.
9. Reach an authored ending in approximately 60–90 minutes.

All player-facing prose is written in third person. Second-person narration is
not permitted.

## 3. Demo scope

### Included

- One gothic-fantasy campaign: **The Bell Below**
- Four pregenerated protagonists
- Hybrid interaction: contextual controls plus freeform text
- Persistent locations and inspectable objects
- Persistent NPC identity, disposition, goals, knowledge, and memory
- Hidden facts with explicit audiences and reveal conditions
- Inventory, equipment, HP, and limited resources
- Lightweight bespoke rules
- Actual dice and difficulty checks
- Turn-based combat with legal actions and deterministic resolution
- Quest state, world facts, clocks, and irreversible consequences
- Multiple authored ending families
- Restart after death or terminal failure
- A desktop-oriented website suitable for public demo hosting

### Explicitly excluded

- Public world or campaign creator
- Marketplace
- On-demand image generation
- Native mobile applications
- Elaborate character creation
- Multiple genres or a campaign catalogue
- Multiplayer
- Sexual-content features for the initial demo

## 4. Interaction model

The primary interface offers contextual actions such as move, inspect, speak,
use item, attempt check, attack, defend, flee, and rest. The player may also
write freeform intent.

Freeform text is never executed as prose. It is interpreted into a proposed
typed action. The engine then:

1. resolves referenced entities;
2. checks location, inventory, state, and action legality;
3. requests any required target or clarification;
4. applies costs and rolls;
5. commits canonical events and state changes; and
6. gives the resulting facts to the narrator for third-person presentation.

For example, “convince the guard to permit regicide” can become an attempt to
persuade the guard, but cannot directly establish that the guard agrees. The
NPC policy, knowledge, disposition, difficulty, roll, and authored consequence
determine the result.

## 5. Rules requirements

The demo uses bespoke lightweight rules rather than depending on Dungeons &
Dragons mechanics.

- Checks use an explicit die roll, modifier, and target difficulty.
- Rolls and modifiers are recorded and visible to the player.
- Combat proceeds in turns.
- Combat actions have defined legality, targets, costs, and effects.
- HP and limited resources cannot be changed by narration.
- Defeat can cause death or an authored terminal outcome.
- Terminal outcomes offer restart for the demo.
- The rules must be data-driven enough to support this campaign without
  pretending to be a universal RPG system.

## 6. Canonical state

The backend is the sole authority for:

- current location and discovered routes;
- location and object state;
- NPC location, condition, disposition, goals, concessions, knowledge, and
  remembered events;
- protagonist statistics, HP, resources, inventory, and equipment;
- clocks, quests, facts, encounter state, and ending eligibility;
- action history, rolls, costs, damage, healing, and irreversible events.

Narrative text is a projection of committed state. It is not itself state and
cannot contradict or mutate the engine.

## 7. NPC knowledge and memory

Facts identify who may know them, how they can be learned, and whether they
have been revealed. An NPC response may use only facts available to that NPC
plus public and directly observed events.

Long-term memory means compact, useful, structured continuity—not an unlimited
chat transcript. The system stores important events, promises, discoveries,
injuries, transfers, attitude changes, and authored relationship beats.

## 8. Campaign structure

The adventure is authored as versioned data with stable identifiers. It
contains:

- an adventure bible and hidden truth;
- locations and routes;
- protagonists and protagonist-specific affordances;
- NPC dossiers and hidden knowledge;
- items and inspectable objects;
- encounters and combatants;
- facts, quests, clocks, and state transitions;
- ending conditions and ending witnesses.

Static validation must reject duplicate identifiers, dangling references,
invalid ownership, unreachable required content, unauthorized knowledge,
secret leakage, manifest traversal, version mismatches, soft locks, and endings
without valid witnesses.

## 9. Technical direction

- Frontend: React with TypeScript
- Backend: Python with complete type hints
- API: typed HTTP boundary; FastAPI is the preferred initial framework
- Persistence: server-owned run snapshots plus an append-only event history
- Content: versioned authored files loaded and validated by the backend
- LLM boundary: structured intent proposal and prose rendering only

The domain and content engine must remain independent of React, FastAPI,
database adapters, and any specific model provider.

## 10. Demo user flow

1. Landing page introduces The Bell Below.
2. Character selection presents four concise pregenerated choices.
3. Starting a run creates canonical state for the chosen protagonist.
4. The main play view shows third-person narrative, contextual actions,
   freeform input, current location, HP/resources, and inventory.
5. Each submitted action produces a visible resolution and committed state
   change.
6. Combat uses a focused turn interface while preserving the narrative log.
7. Reaching an ending shows the outcome and offers restart.

## 11. Acceptance criteria

The demo is complete when:

- a new player can finish a coherent run in 60–90 minutes;
- all four protagonists can reach at least one ending;
- conversation, exploration, checks, inventory, combat, and quest state all
  affect the run;
- hidden NPC knowledge cannot leak through generated dialogue;
- illegal or impossible freeform requests cannot mutate state;
- reloading restores the exact canonical run;
- death or terminal failure leads to a restart path;
- all narration is third person;
- the authored content passes static validation; and
- the website can be deployed and shared as a public demo.

## 12. Future, not demo commitments

Possible later work includes additional campaigns, richer authoring tools,
adult-content support, more sophisticated character creation, and broader
platform support. None of these should complicate or delay the first complete
adventure.
