"""Versioned Pydantic contracts for all authored adventure content."""

from __future__ import annotations

from enum import StrEnum
from pathlib import PurePosixPath
from typing import Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator

from wayfarer.adventure.dsl import Effect, Predicate
from wayfarer.domain.ids import (
    AbilityId,
    AffordanceId,
    ClockId,
    ContentVersion,
    EncounterId,
    EndingId,
    FactId,
    ItemId,
    LocationId,
    NpcId,
    ObjectiveId,
    ProtagonistId,
    QuestId,
)


class ContentModel(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)


class FactAudience(StrEnum):
    PLAYER_DISCOVERABLE = "player_discoverable"
    NPC_RESTRICTED = "npc_restricted"
    ENGINE_ONLY = "engine_only"


class FactDefinition(ContentModel):
    id: FactId
    truth: str = Field(min_length=1)
    audience: FactAudience
    allowed_knowers: tuple[NpcId, ...] = ()
    discoverable_at: tuple[LocationId, ...] = ()


class ItemDefinition(ContentModel):
    id: ItemId
    name: str
    description: str
    tags: frozenset[str] = frozenset()
    unique: bool = True
    initial_owner: str


class AttributeBlock(ContentModel):
    might: int = Field(ge=0, le=3)
    grace: int = Field(ge=0, le=3)
    wits: int = Field(ge=0, le=3)
    presence: int = Field(ge=0, le=3)


class ProtagonistDefinition(ContentModel):
    id: ProtagonistId
    name: str
    epithet: str
    pronouns: str
    summary: str
    personal_stake: str
    attributes: AttributeBlock
    max_hp: int = Field(gt=0, le=30)
    guard: int = Field(ge=8, le=20)
    spirit: int = Field(ge=8, le=20)
    resolve: int = Field(ge=1, le=6)
    trained_disciplines: tuple[str, str]
    signature_ability_id: AbilityId
    signature_ability: str
    passive_trait: str
    weapon_profile: str
    starting_items: tuple[ItemId, ...]
    known_facts: tuple[FactId, ...]
    personal_objective_id: ObjectiveId
    personal_objective: str
    unique_affordances: tuple[AffordanceId, ...]
    ending_modifiers: tuple[str, ...]
    narration_rule: str = "Narrate this protagonist exclusively in third person."


class OutcomeBranch(ContentModel):
    summary: str
    effects: tuple[Effect, ...] = ()
    narration_fact_ids: tuple[FactId, ...] = ()


class OutcomeTable(ContentModel):
    critical_success: OutcomeBranch | None = None
    success: OutcomeBranch
    failure: OutcomeBranch
    critical_failure: OutcomeBranch | None = None


class AffordanceDefinition(ContentModel):
    id: AffordanceId
    label: str
    action_family: str
    predicate: Predicate
    check_attribute: str | None = None
    difficulty: int | None = Field(default=None, ge=9, le=18)
    outcomes: OutcomeTable | None = None

    @model_validator(mode="after")
    def validate_check_shape(self) -> Self:
        if (self.check_attribute is None) != (self.difficulty is None):
            raise ValueError("check attribute and difficulty must be set together")
        if self.difficulty is not None and self.outcomes is None:
            raise ValueError("a checked affordance requires authored outcomes")
        return self


class ExitDefinition(ContentModel):
    to: LocationId
    label: str
    predicate: Predicate
    one_way: bool = False


class LocationDefinition(ContentModel):
    id: LocationId
    name: str
    act: Literal[1, 2, 3]
    summary: str
    visible_facts: tuple[FactId, ...] = ()
    exits: tuple[ExitDefinition, ...]
    affordances: tuple[AffordanceDefinition, ...] = ()
    item_ids: tuple[ItemId, ...] = ()
    initial_npc_ids: tuple[NpcId, ...] = ()
    persistent_variables: tuple[str, ...] = ()
    terminal_location: bool = False


class KnowledgeRecordDefinition(ContentModel):
    fact_id: FactId
    stance: Literal["knows_true", "believes_false", "suspects"]
    confidence: float = Field(ge=0.0, le=1.0)
    source: str
    disclosure_predicate: Predicate


class ConcessionDefinition(ContentModel):
    id: str
    description: str
    predicate: Predicate
    difficulty: int | None = Field(default=None, ge=9, le=18)
    success_effects: tuple[Effect, ...] = ()
    absolute_refusal: bool = False

    @model_validator(mode="after")
    def validate_refusal(self) -> Self:
        if self.absolute_refusal and (self.difficulty is not None or self.success_effects):
            raise ValueError("an absolute refusal cannot have a roll or success effects")
        return self


class NpcDefinition(ContentModel):
    id: NpcId
    name: str
    role: str
    initial_location_id: LocationId
    goals_ranked: tuple[str, ...] = Field(min_length=1)
    fears: tuple[str, ...]
    loyalties: tuple[str, ...]
    voice: str
    boundaries: tuple[str, ...]
    initial_attitude: int = Field(ge=-5, le=5)
    knowledge: tuple[KnowledgeRecordDefinition, ...]
    false_beliefs: tuple[str, ...] = ()
    concessions: tuple[ConcessionDefinition, ...]
    tactical_policy: str
    departure_and_defeat: str


class ClockEventDefinition(ContentModel):
    threshold: int = Field(ge=1)
    title: str
    public_summary: str
    effects: tuple[Effect, ...]


class ClockDefinition(ContentModel):
    id: ClockId
    name: str
    maximum: int = Field(gt=0)
    initial: int = Field(ge=0)
    events: tuple[ClockEventDefinition, ...]

    @model_validator(mode="after")
    def validate_thresholds(self) -> Self:
        thresholds = [event.threshold for event in self.events]
        if thresholds != sorted(set(thresholds)):
            raise ValueError("clock thresholds must be unique and increasing")
        if thresholds and thresholds[-1] > self.maximum:
            raise ValueError("clock event exceeds clock maximum")
        return self


class QuestStageDefinition(ContentModel):
    id: str
    title: str
    transition_predicate: Predicate


class QuestDefinition(ContentModel):
    id: QuestId
    title: str
    initial_stage: str
    stages: tuple[QuestStageDefinition, ...]

    @model_validator(mode="after")
    def validate_initial_stage(self) -> Self:
        stage_ids = {stage.id for stage in self.stages}
        if self.initial_stage not in stage_ids:
            raise ValueError("quest initial stage is not defined")
        return self


class EncounterDefinition(ContentModel):
    id: EncounterId
    name: str
    location_id: LocationId
    optional: bool
    zones: tuple[str, ...] = Field(min_length=2, max_length=4)
    activation_predicate: Predicate
    alternate_resolution_predicates: tuple[Predicate, ...] = ()


class EndingWitness(ContentModel):
    name: str
    protagonist_id: ProtagonistId
    location_id: LocationId
    flags: dict[str, bool] = Field(default_factory=dict)
    resources: dict[str, int] = Field(default_factory=dict)
    item_owners: dict[ItemId, str] = Field(default_factory=dict)
    npc_attitudes: dict[NpcId, int] = Field(default_factory=dict)
    npc_knowledge: dict[NpcId, set[FactId]] = Field(default_factory=dict)
    discovered_facts: set[FactId] = Field(default_factory=set)
    quest_stages: dict[QuestId, str] = Field(default_factory=dict)
    clocks: dict[ClockId, int] = Field(default_factory=dict)
    encounter_states: dict[EncounterId, str] = Field(default_factory=dict)
    eligible_endings: set[EndingId] = Field(default_factory=set)


class EndingDefinition(ContentModel):
    id: EndingId
    name: str
    family: str
    predicate: Predicate
    consequence_ledger: tuple[str, ...]
    terminal_effects: tuple[Effect, ...]
    hidden_epilogue_facts: tuple[FactId, ...] = ()
    witnesses: tuple[EndingWitness, ...] = Field(min_length=1)


class AdventureMetadata(ContentModel):
    id: str
    title: str
    content_version: ContentVersion
    schema_version: Literal[1] = 1
    target_minutes_min: int = Field(ge=30)
    target_minutes_max: int = Field(le=180)
    start_location_id: LocationId
    finale_location_id: LocationId
    required_reachable_locations: tuple[LocationId, ...]

    @model_validator(mode="after")
    def validate_playtime(self) -> Self:
        if self.target_minutes_min > self.target_minutes_max:
            raise ValueError("minimum playtime exceeds maximum playtime")
        return self


class AdventureDefinition(ContentModel):
    metadata: AdventureMetadata
    facts: tuple[FactDefinition, ...]
    items: tuple[ItemDefinition, ...]
    protagonists: tuple[ProtagonistDefinition, ...]
    locations: tuple[LocationDefinition, ...]
    npcs: tuple[NpcDefinition, ...]
    clocks: tuple[ClockDefinition, ...]
    quests: tuple[QuestDefinition, ...]
    encounters: tuple[EncounterDefinition, ...]
    endings: tuple[EndingDefinition, ...]

    @model_validator(mode="after")
    def validate_unique_collection_ids(self) -> Self:
        collections = {
            "fact": [str(entry.id) for entry in self.facts],
            "item": [str(entry.id) for entry in self.items],
            "protagonist": [str(entry.id) for entry in self.protagonists],
            "location": [str(entry.id) for entry in self.locations],
            "npc": [str(entry.id) for entry in self.npcs],
            "clock": [str(entry.id) for entry in self.clocks],
            "quest": [str(entry.id) for entry in self.quests],
            "encounter": [str(entry.id) for entry in self.encounters],
            "ending": [str(entry.id) for entry in self.endings],
        }
        for label, identifiers in collections.items():
            if len(identifiers) != len(set(identifiers)):
                raise ValueError(f"duplicate {label} identifier")
        return self


class AdventureManifest(ContentModel):
    schema_version: Literal[1] = 1
    content_version: ContentVersion
    metadata: PurePosixPath
    facts: PurePosixPath
    items: PurePosixPath
    protagonists: PurePosixPath
    locations: PurePosixPath
    npcs: PurePosixPath
    clocks: PurePosixPath
    quests: PurePosixPath
    encounters: PurePosixPath
    endings: PurePosixPath
