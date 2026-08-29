"""Canonical entity references and the minimal framework-free run projection."""

from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator

from wayfarer.domain.ids import (
    ClockId,
    ContentVersion,
    EncounterId,
    EndingId,
    FactId,
    ItemId,
    LocationId,
    NpcId,
    ProtagonistId,
    QuestId,
    RunId,
    StableId,
)

EntityId = (
    ProtagonistId
    | LocationId
    | NpcId
    | ItemId
    | EncounterId
    | QuestId
    | ClockId
    | FactId
    | EndingId
)


class EntityKind(StrEnum):
    PROTAGONIST = "protagonist"
    LOCATION = "location"
    NPC = "npc"
    ITEM = "item"
    ENCOUNTER = "encounter"
    QUEST = "quest"
    CLOCK = "clock"
    FACT = "fact"
    ENDING = "ending"


class EntityRef(BaseModel):
    model_config = ConfigDict(frozen=True)

    kind: EntityKind
    entity_id: EntityId

    @model_validator(mode="after")
    def validate_kind_matches_identifier(self) -> "EntityRef":
        expected_types: dict[EntityKind, type[StableId]] = {
            EntityKind.PROTAGONIST: ProtagonistId,
            EntityKind.LOCATION: LocationId,
            EntityKind.NPC: NpcId,
            EntityKind.ITEM: ItemId,
            EntityKind.ENCOUNTER: EncounterId,
            EntityKind.QUEST: QuestId,
            EntityKind.CLOCK: ClockId,
            EntityKind.FACT: FactId,
            EntityKind.ENDING: EndingId,
        }
        if not isinstance(self.entity_id, expected_types[self.kind]):
            raise ValueError("entity kind does not match identifier type")
        return self


class RunStatus(StrEnum):
    CREATED = "created"
    ACTIVE = "active"
    DEAD = "dead"
    ENDED = "ended"


class CanonicalRunState(BaseModel):
    """The state vocabulary needed by the milestone-one rule DSL.

    The deterministic engine will later own command handling and event replay.
    This projection exists now so predicates and effects can be validated and
    exercised without importing an API, ORM, database, or model provider.
    """

    model_config = ConfigDict(extra="forbid")

    run_id: RunId
    content_version: ContentVersion
    status: RunStatus = RunStatus.ACTIVE
    protagonist_id: ProtagonistId
    protagonist_location_id: LocationId
    entity_locations: dict[str, LocationId] = Field(default_factory=dict)
    flags: dict[str, bool] = Field(default_factory=dict)
    resources: dict[str, int] = Field(default_factory=dict)
    item_owners: dict[ItemId, str] = Field(default_factory=dict)
    npc_attitudes: dict[NpcId, int] = Field(default_factory=dict)
    npc_knowledge: dict[NpcId, set[FactId]] = Field(default_factory=dict)
    discovered_facts: set[FactId] = Field(default_factory=set)
    quest_stages: dict[QuestId, str] = Field(default_factory=dict)
    clocks: dict[ClockId, int] = Field(default_factory=dict)
    encounter_states: dict[EncounterId, str] = Field(default_factory=dict)
    ending_eligibility: set[str] = Field(default_factory=set)

    @model_validator(mode="after")
    def validate_state_invariants(self) -> "CanonicalRunState":
        if any(value < 0 for value in self.resources.values()):
            raise ValueError("resources cannot be negative")
        if any(value < 0 for value in self.clocks.values()):
            raise ValueError("clock values cannot be negative")
        if self.status in {RunStatus.DEAD, RunStatus.ENDED} and not self.ending_eligibility:
            raise ValueError("terminal state must record at least one ending eligibility marker")
        return self
