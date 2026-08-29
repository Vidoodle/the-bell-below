"""A deterministic, serializable predicate and effect language for authored content."""

from __future__ import annotations

from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field

from bell_below.domain.ids import (
    ClockId,
    EncounterId,
    EndingId,
    FactId,
    ItemId,
    LocationId,
    NpcId,
    QuestId,
)
from bell_below.domain.models import CanonicalRunState


class DslNode(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class Always(DslNode):
    kind: Literal["always"] = "always"
    value: bool = True


class FlagIs(DslNode):
    kind: Literal["flag_is"] = "flag_is"
    flag: str
    value: bool = True


class ResourceAtLeast(DslNode):
    kind: Literal["resource_at_least"] = "resource_at_least"
    resource: str
    amount: int = Field(ge=0)


class HasItem(DslNode):
    kind: Literal["has_item"] = "has_item"
    item_id: ItemId
    owner: str = "protagonist"


class NpcAttitudeAtLeast(DslNode):
    kind: Literal["npc_attitude_at_least"] = "npc_attitude_at_least"
    npc_id: NpcId
    amount: int = Field(ge=-5, le=5)


class NpcKnows(DslNode):
    kind: Literal["npc_knows"] = "npc_knows"
    npc_id: NpcId
    fact_id: FactId


class FactDiscovered(DslNode):
    kind: Literal["fact_discovered"] = "fact_discovered"
    fact_id: FactId


class AtLocation(DslNode):
    kind: Literal["at_location"] = "at_location"
    entity: str = "protagonist"
    location_id: LocationId


class QuestStageIs(DslNode):
    kind: Literal["quest_stage_is"] = "quest_stage_is"
    quest_id: QuestId
    stage: str


class ClockAtLeast(DslNode):
    kind: Literal["clock_at_least"] = "clock_at_least"
    clock_id: ClockId
    amount: int = Field(ge=0)


class EncounterStateIs(DslNode):
    kind: Literal["encounter_state_is"] = "encounter_state_is"
    encounter_id: EncounterId
    state: str


class EndingEligible(DslNode):
    kind: Literal["ending_eligible"] = "ending_eligible"
    ending_id: EndingId


class AllOf(DslNode):
    kind: Literal["all"] = "all"
    predicates: tuple[Predicate, ...] = Field(min_length=1)


class AnyOf(DslNode):
    kind: Literal["any"] = "any"
    predicates: tuple[Predicate, ...] = Field(min_length=1)


class Not(DslNode):
    kind: Literal["not"] = "not"
    predicate: Predicate


type Predicate = Annotated[
    Always
    | FlagIs
    | ResourceAtLeast
    | HasItem
    | NpcAttitudeAtLeast
    | NpcKnows
    | FactDiscovered
    | AtLocation
    | QuestStageIs
    | ClockAtLeast
    | EncounterStateIs
    | EndingEligible
    | AllOf
    | AnyOf
    | Not,
    Field(discriminator="kind"),
]


class SetFlag(DslNode):
    kind: Literal["set_flag"] = "set_flag"
    flag: str
    value: bool = True


class AdjustResource(DslNode):
    kind: Literal["adjust_resource"] = "adjust_resource"
    resource: str
    amount: int


class TransferItem(DslNode):
    kind: Literal["transfer_item"] = "transfer_item"
    item_id: ItemId
    new_owner: str


class SetNpcAttitude(DslNode):
    kind: Literal["set_npc_attitude"] = "set_npc_attitude"
    npc_id: NpcId
    amount: int = Field(ge=-5, le=5)


class GrantNpcKnowledge(DslNode):
    kind: Literal["grant_npc_knowledge"] = "grant_npc_knowledge"
    npc_id: NpcId
    fact_id: FactId


class DiscoverFact(DslNode):
    kind: Literal["discover_fact"] = "discover_fact"
    fact_id: FactId


class MoveEntity(DslNode):
    kind: Literal["move_entity"] = "move_entity"
    entity: str
    location_id: LocationId


class SetQuestStage(DslNode):
    kind: Literal["set_quest_stage"] = "set_quest_stage"
    quest_id: QuestId
    stage: str


class AdvanceClock(DslNode):
    kind: Literal["advance_clock"] = "advance_clock"
    clock_id: ClockId
    amount: int = Field(gt=0)


class SetEncounterState(DslNode):
    kind: Literal["set_encounter_state"] = "set_encounter_state"
    encounter_id: EncounterId
    state: str


class MarkEndingEligible(DslNode):
    kind: Literal["mark_ending_eligible"] = "mark_ending_eligible"
    ending_id: EndingId


type Effect = Annotated[
    SetFlag
    | AdjustResource
    | TransferItem
    | SetNpcAttitude
    | GrantNpcKnowledge
    | DiscoverFact
    | MoveEntity
    | SetQuestStage
    | AdvanceClock
    | SetEncounterState
    | MarkEndingEligible,
    Field(discriminator="kind"),
]


def evaluate(predicate: Predicate, state: CanonicalRunState) -> bool:
    """Evaluate a predicate without mutation or external calls."""

    match predicate:
        case Always(value=value):
            return value
        case FlagIs(flag=flag, value=value):
            return state.flags.get(flag, False) is value
        case ResourceAtLeast(resource=resource, amount=amount):
            return state.resources.get(resource, 0) >= amount
        case HasItem(item_id=item_id, owner=owner):
            expected = str(state.protagonist_id) if owner == "protagonist" else owner
            return state.item_owners.get(item_id) == expected
        case NpcAttitudeAtLeast(npc_id=npc_id, amount=amount):
            return state.npc_attitudes.get(npc_id, 0) >= amount
        case NpcKnows(npc_id=npc_id, fact_id=fact_id):
            return fact_id in state.npc_knowledge.get(npc_id, set())
        case FactDiscovered(fact_id=fact_id):
            return fact_id in state.discovered_facts
        case AtLocation(entity=entity, location_id=location_id):
            if entity == "protagonist":
                return state.protagonist_location_id == location_id
            return state.entity_locations.get(entity) == location_id
        case QuestStageIs(quest_id=quest_id, stage=stage):
            return state.quest_stages.get(quest_id) == stage
        case ClockAtLeast(clock_id=clock_id, amount=amount):
            return state.clocks.get(clock_id, 0) >= amount
        case EncounterStateIs(encounter_id=encounter_id, state=encounter_state):
            return state.encounter_states.get(encounter_id) == encounter_state
        case EndingEligible(ending_id=ending_id):
            return str(ending_id) in state.ending_eligibility
        case AllOf(predicates=predicates):
            return all(evaluate(child, state) for child in predicates)
        case AnyOf(predicates=predicates):
            return any(evaluate(child, state) for child in predicates)
        case Not(predicate=child):
            return not evaluate(child, state)


def apply_effects(state: CanonicalRunState, effects: tuple[Effect, ...]) -> CanonicalRunState:
    """Apply ordered effects to a copy, then revalidate all state invariants."""

    updated = state.model_copy(deep=True)
    for effect in effects:
        match effect:
            case SetFlag(flag=flag, value=value):
                updated.flags[flag] = value
            case AdjustResource(resource=resource, amount=amount):
                next_value = updated.resources.get(resource, 0) + amount
                if next_value < 0:
                    raise ValueError(f"effect would make resource '{resource}' negative")
                updated.resources[resource] = next_value
            case TransferItem(item_id=item_id, new_owner=new_owner):
                if item_id not in updated.item_owners:
                    raise ValueError(f"cannot transfer unknown item instance '{item_id}'")
                updated.item_owners[item_id] = (
                    str(updated.protagonist_id) if new_owner == "protagonist" else new_owner
                )
            case SetNpcAttitude(npc_id=npc_id, amount=amount):
                updated.npc_attitudes[npc_id] = amount
            case GrantNpcKnowledge(npc_id=npc_id, fact_id=fact_id):
                updated.npc_knowledge.setdefault(npc_id, set()).add(fact_id)
            case DiscoverFact(fact_id=fact_id):
                updated.discovered_facts.add(fact_id)
            case MoveEntity(entity=entity, location_id=location_id):
                if entity == "protagonist":
                    updated.protagonist_location_id = location_id
                else:
                    updated.entity_locations[entity] = location_id
            case SetQuestStage(quest_id=quest_id, stage=stage):
                updated.quest_stages[quest_id] = stage
            case AdvanceClock(clock_id=clock_id, amount=amount):
                updated.clocks[clock_id] = updated.clocks.get(clock_id, 0) + amount
            case SetEncounterState(encounter_id=encounter_id, state=encounter_state):
                updated.encounter_states[encounter_id] = encounter_state
            case MarkEndingEligible(ending_id=ending_id):
                updated.ending_eligibility.add(str(ending_id))
    return CanonicalRunState.model_validate(updated.model_dump(mode="python"))


AllOf.model_rebuild()
AnyOf.model_rebuild()
Not.model_rebuild()
