"""Strongly typed stable identifiers used by content and run state."""

from typing import ClassVar, Self

from pydantic import ConfigDict, RootModel, model_validator


class StableId(RootModel[str]):
    """A frozen, validated identifier with a type-distinct subclass per entity."""

    model_config = ConfigDict(frozen=True)
    prefix: ClassVar[str | None] = None

    @model_validator(mode="after")
    def validate_stable_id(self) -> Self:
        value = self.root
        if not value or len(value) > 96:
            raise ValueError("identifier must contain between 1 and 96 characters")
        if not value[0].isalnum():
            raise ValueError("identifier must begin with an alphanumeric character")
        if any(not (character.isalnum() or character in "._-") for character in value):
            raise ValueError("identifier contains an unsupported character")
        if self.prefix is not None and not value.startswith(f"{self.prefix}."):
            raise ValueError(f"identifier must begin with '{self.prefix}.'")
        return self

    def __str__(self) -> str:
        return self.root


class RunId(StableId):
    prefix = "run"


class ActionId(StableId):
    prefix = "action"


class EventId(StableId):
    prefix = "event"


class ProtagonistId(StableId):
    prefix = "protagonist"


class LocationId(StableId):
    prefix = "location"


class NpcId(StableId):
    prefix = "npc"


class ItemId(StableId):
    prefix = "item"


class EncounterId(StableId):
    prefix = "encounter"


class QuestId(StableId):
    prefix = "quest"


class ClockId(StableId):
    prefix = "clock"


class ConditionId(StableId):
    prefix = "condition"


class EndingId(StableId):
    prefix = "ending"


class FactId(StableId):
    prefix = "fact"


class AbilityId(StableId):
    prefix = "ability"


class AffordanceId(StableId):
    prefix = "affordance"


class ObjectiveId(StableId):
    prefix = "objective"


class ContentVersion(StableId):
    prefix = "content"
