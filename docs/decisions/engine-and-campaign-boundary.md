# Engine and campaign boundary

Status: accepted.

Date: 2026-09-01.

## Decision

*The Bell Below* is the first campaign package built on a reusable game runtime and AI DM orchestration system. It is not the definition of the engine itself.

The reusable core owns cross-campaign execution concerns:

- run and action lifecycle;
- stable identities and content-version references;
- bounded, provider-neutral AI DM requests;
- proposal validation and commitment order;
- seeded randomness and reproducibility;
- atomic event persistence, idempotency, retry, and recovery;
- separation of adjudication, mechanical resolution, and narration.

A campaign package owns its playable vocabulary and truth:

- stat and character definitions;
- check rules, difficulty scale, resources, action economy, and effect vocabulary;
- locations, scenes, individual and collective NPCs, lore, obstacles, encounters, and endings;
- disclosure rules and campaign-specific AI DM context policy;
- presentation labels and assets.

Reusable code receives the active campaign's definitions through explicit dependencies. It must not branch on *The Bell Below* identifiers or hardcode Might, Grace, Wits, Presence, its locations, or its NPCs as universal concepts.

The current demo still ships exactly one campaign and does not include dynamic module loading, a plugin SDK, a universal campaign schema, or creator UI. Preserve the boundary now; extract broader abstractions only when a second concrete campaign or creator workflow demonstrates what must vary.

A future campaign creator may help author or generate these packages, but its output must pass the same static validation, receive a content version, and become fixed canonical input before a run begins. Creator tooling does not make runtime model prose authoritative.

## Why

The intended product can eventually support new authored modules and campaign-creation tools without rebuilding run persistence, AI DM orchestration, outcome commitment, or failure recovery. Keeping campaign vocabulary out of those systems makes that possible. Deferring a generic framework avoids designing speculative abstractions from only one example.
