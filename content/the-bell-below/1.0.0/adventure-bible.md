# The Bell Below — Adventure Bible

Version: `content.the-bell-below.1.0.0`

This document is the human-facing source of dramatic intent. The adjacent JSON
files are canonical for identifiers, predicates, effects, and reachability.
When prose and data disagree about a state transition, the data wins and the
disagreement is a content bug.

## Promise and tone

At midnight, the Bell of Mercy beneath Grayhaven will ring. The player chooses
one of four fixed adult protagonists and descends into the flooded Abbey of
Saint Orra to stop it. The adventure is intimate gothic fantasy: wet stone,
institutional guilt, names deliberately erased, and people whose defensible
goals cannot all be satisfied.

The narration is always third-person. It does not decide the protagonist's
thoughts, unsubmitted dialogue, or actions. NPC dialogue may address the
protagonist directly inside quotation marks.

## Immutable hidden truth

During the siege, the abbey performed a forbidden rite that diverted death
from citizens above into refugees and attendants sheltering below. The civic
miracle saved Grayhaven by binding those victims into the Bell of Mercy and
then deleting their names from official history.

The failing seal forces the victims to relive their deaths. The Orra Echo is
not Saint Orra's surviving soul. It is a composite produced from the official
saint-story and memories stripped from the victims. Sister Mara knows the
central crime and maintained its latest renewal. Ilyra lived as Elaria Nymm,
registrar of the refugees and first unwilling anchor of the bell.

These truths never change during a run. Characters can know, suspect,
misunderstand, conceal, or lie about them only where their dossier allows.

## Dramatic spine and time budget

| Act | Minutes | Required beats | Flexible material |
|---|---:|---|---|
| I — Descent | 10–15 | protagonist stake, breach, movement, inspection, low-risk check, clock introduction | Lucan's first posture, ward-sign discovery |
| II — Drowned abbey | 30–45 | at least two NPCs, one resolution asset, moral complication, avoidable combat or hazard | ossuary/archive and chain/cistern order, Mara before or after evidence, faction timing |
| III — Final toll | 15–25 | crypt convergence, irreversible action, engine-selected ending, consequence ledger | allies, enemies, ritual assets, faction posture, clock severity |

Expected total: 60–85 minutes, leaving five minutes of margin for clarification
and interface friction while remaining inside the 60–90 minute target.

## Route topology

The breach stair opens into the drowned nave. The nave is the persistent hub.
Its western route crosses the ossuary walk to the vestry archive. Its eastern
route reaches the chain tower and the optional black cistern. The keeper's cell
becomes obvious as water or conversation exposes Mara's chalk marks. The bell
crypt can be reached through Mara's stair or the tower counterweight descent.

Every nonterminal location has a structural route to the crypt. Predicates may
change cost, timing, danger, or which exit is currently legal; no single check
is allowed to remove all forward routes.

### Route A — Names and rite

The ossuary and archive establish the erased refugee ledger, Ilyra's identity,
the complete rite, and the difference between release and resealing. Its main
resolution assets are the original ledger, a true name, Mara's confession, and
the Echo's separated voices.

### Route B — Mechanism and iron

The chain tower and cistern establish the physical bell mechanism, original
clapper, cold-iron wedge, Severin's operation, and Lucan's competing contract.
Its main assets are the clapper, wedge, faction leverage, and safe crypt descent.

Either route can reach a valid ending. Combining them improves consequences
and expands the final options.

## Factions and irreconcilable interests

- Mara prioritizes Grayhaven's survival but will not knowingly create a weapon.
- Ilyra prioritizes release and restored names; she does not owe the city
  consequence-free forgiveness.
- Lucan prioritizes survival and debt, with an unreliable loyalty to Veyra.
- Severin prioritizes durable civic power over retrospective innocence.
- The Orra Echo prioritizes whatever ritual grammar currently dominates its
  fractured identity.

A social success grants only a dossier-listed concession. No roll can make an
NPC forget knowledge, reverse an absolute refusal, transfer an unavailable
item, or accept an outcome contrary to a top-ranked goal without authored
leverage.

## The Midnight Clock

The clock has six segments. Ordinary costly failures and selected deliberate
delays advance it. At segment two, the nave changes and the keeper route becomes
visible. At segment four, Severin's expedition enters the central route. At
segment six, the final-toll ending becomes eligible and resolves unless a
previously committed intervention has already made the run terminal.

Clock effects are public and private state events. Presentation failure never
repeats an effect or advances the clock twice.

## Protagonist variation budget

The shared topology, NPCs, truth, and ending families remain fixed. Roughly
20–25% of observed material changes through unique facts, affordances, NPC
reactions, personal objectives, and ending modifiers:

- Seren recognizes civic wards and can contest military command. Their arc is
  confession versus institutional loyalty.
- Veyra bypasses mechanisms and reads Lucan. Her arc is who, if anyone, may own
  a relic purchased with erased lives.
- Cael parses ritual substitutions and can separate the Echo. His arc is truth
  as care rather than proof alone.
- Isolde carries Vale passwords and can negotiate supervised custody. Her arc
  is legitimate authority without family impunity.

No protagonist is mandatory for a major ending family.

## Resolution assets

| Asset | Source | Enables or improves |
|---|---|---|
| Complete sealing rite | archive or Mara | reseal |
| Mara's true confession | social concession with evidence | public-cost reseal, faction pressure |
| Ilyra's true name | ledger, Ilyra, or separated Echo | prepared release |
| Refugee ledger | warded archive cabinet | release, confession, Severin stand-down |
| Cold-iron wedge | black cistern | silence without release |
| Original clapper | chain tower | reseal or claim |
| Severin's supervision/stand-down | faction leverage | claim without immediate coup |
| NPC assistance | individual concession policies | lower cost or improve epilogue |

No single asset is required by every successful ending. The ledger/true-name
configuration and clapper/wedge configuration are independently reachable.

## Ending matrix

### The Mercy Renewed — reseal

Requires the complete rite, original clapper, and either Mara's confession or
a living source of Resolve. Grayhaven survives. The dead remain bound. Public
confession can turn another concealed crime into acknowledged civic penance,
but it does not erase the renewed harm.

### The Names Return — break

Requires Ilyra's assistance, her true name, and the original ledger. The dead
are released under names rather than as an anonymous catastrophe. Preparation,
clock state, and surviving NPCs determine the city's cost.

### A Borrowed Silence — silence without release

Requires the cold-iron wedge before the sixth segment. The clapper is
immobilized. The city gains time and the injustice remains unresolved.

### The Bell in Custody — claim

Requires the original clapper plus Severin's supervised agreement or stand-down.
Who lives, who holds authority, and who knows the truth determine whether the
result is an armistice, theft, or coup.

### The Final Toll — catastrophic failure

Occurs when the sixth clock segment completes or an authored defeat marks the
ending eligible. It is not a narrator-selected punishment. Its ledger reflects
which people and safeguards survived.

## Information boundaries

Facts tagged `engine_only` are never included in protagonist definitions,
visible location facts, public API projections, or narration inputs. Restricted
facts can be held only by NPCs named in `allowed_knowers`. Disclosure remains a
separate predicate; knowing a fact never implies willingness to reveal it.

Prompts and prose are not content authority. New solutions, facts, concessions,
item transfers, quest transitions, and endings require versioned data changes
that pass the static validator.

## Content completion rules

- Each ending must include an engine-evaluable predicate and at least one valid
  witness state.
- Each protagonist must appear in a valid ending witness.
- Every required location must be structurally reachable from the breach.
- Every reachable nonterminal location must retain a route to the crypt.
- Unique items have exactly one initial owner in a run.
- All references, predicate operands, and effect targets resolve at build time.
- Failure changes cost or state and cannot be the only gate to required progress.

