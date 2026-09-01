# The Bell Below check resolution

Status: accepted.

Date: 2026-08-31.

Updated: 2026-09-01 to add the luck die, broaden the difficulty catalog, and distinguish low-probability checks from infeasible actions.

## Decision

Within *The Bell Below*, uncertain, feasible, consequential actions use `d10 + stat + situational modifiers` against one of six supported difficulties:

| Difficulty | DV |
| --- | ---: |
| Trivial | 5 |
| Favorable | 7 |
| Standard | 9 |
| Challenging | 11 |
| Difficult | 13 |
| Extreme | 15 |

Effective stats range from 1 to 6. Each stat point changes the ordinary success chance by ten percentage points, so the full range changes it by fifty percentage points before probability reaches either boundary.

Advantage and disadvantage roll two d10s and keep the higher or lower. If the kept d10 is a natural 10, roll exactly one d8 luck die and add it to the total. The luck die does not roll again on an 8. A natural 1 has no extra penalty.

A natural 10 is a luck trigger, not automatic success or an automatic critical effect. The final total selects the outcome. Critical effects require a separate authored or campaign-bounded outcome predicate.

The ordinary single-die probabilities, including the luck die, are:

| DV | Stat 1 | Stat 3 | Stat 4 | Stat 6 |
| ---: | ---: | ---: | ---: | ---: |
| 5 | 70% | 90% | 100% | 100% |
| 7 | 50% | 70% | 80% | 100% |
| 9 | 30% | 50% | 60% | 80% |
| 11 | 10% | 30% | 40% | 60% |
| 13 | 8.75% | 10% | 20% | 40% |
| 15 | 6.25% | 8.75% | 10% | 20% |

The confirmation UI derives its label from the final probability after stat, modifiers, advantage or disadvantage, and the luck rule:

| Rating | Final success chance |
| --- | ---: |
| Trivial | 100% |
| Easy | 80% to less than 100% |
| Moderate | 60% to less than 80% |
| Challenging | 40% to less than 60% |
| Difficult | More than 10% to less than 40% |
| Impossible | More than 0% to 10% |

`Impossible` is therefore a player-facing warning for an extremely unlikely but possible check. `Infeasible` is a separate AI DM classification for a requested outcome that contradicts established truth or cannot be produced by the approach; it receives no roll. This distinction prevents a lucky roll from authorizing outcomes outside the fiction.

Feasibility is contextual. Fighting through a guard cordon may be an Impossible-rated check, while using Might alone to tunnel through solid ground to the keep is infeasible. The AI DM evaluates the outcome together with the method, protagonist, tools, time, and setting limits; the engine validates that proposal against the supplied authored and committed context.

`Routine` remains a no-check AI DM classification for actions that do not warrant mechanical resolution. It is not inferred from probability. Once an accepted action is classified as a check, the server rolls it even when its success chance is 100%. Such a check is labeled **Trivial**, shown as 100%, and still follows the confirmation flow.

The committed result includes the final total and margin from the relevant DV or outcome threshold. Narration may use that degree to distinguish a narrow success from an overwhelming one. A high margin does not create additional state changes, discoveries, concessions, damage, or other mechanical effects unless an authored or campaign-bounded outcome explicitly authorizes them.

Persist the kept d10, any unkept advantage or disadvantage die, the optional d8, and the random seed. The same committed state, accepted ruling, and seed must reproduce the result.

This stat catalog and resolution rule belong to the campaign package, not to the reusable engine. Another campaign may define different stats, ranges, dice, labels, or probability bands while using the same bounded adjudication, validation, commitment, persistence, and narration lifecycle.

## Why

The protagonists' allocated stats are their only mechanical choices during character creation. A d20 would make the five-point difference between an effective stat of 1 and 6 worth only twenty-five percentage points, leaving the die dominant. A d10 makes the same difference worth fifty percentage points through the ordinary range.

The one-way d8 preserves a small chance for extraordinary success beyond the normal d10 maximum without making weak characters routinely competitive with strong ones. At Might 1 against DV 15, success requires a natural 10 followed by 4–8 on the d8, for a 6.25% chance. Not exploding natural 1 avoids a failure spiral and keeps the rule focused on rare good fortune.
