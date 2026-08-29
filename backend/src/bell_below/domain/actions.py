"""Typed boundaries between interpretation, rules, persistence, and narration."""

from datetime import datetime
from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from bell_below.domain.ids import ActionId, ContentVersion, EventId, RunId, StableId
from bell_below.domain.models import EntityRef


class ActionFamily(StrEnum):
    MOVE = "move"
    EXAMINE = "examine"
    SPEAK = "speak"
    SOCIAL_ATTEMPT = "social_attempt"
    TAKE = "take"
    GIVE = "give"
    USE_ITEM = "use_item"
    INTERACT = "interact"
    ATTACK = "attack"
    DEFEND = "defend"
    USE_ABILITY = "use_ability"
    WAIT = "wait"
    FLEE = "flee"
    CLARIFY = "clarify"


class ActionStatus(StrEnum):
    IMPOSSIBLE = "impossible"
    ROUTINE = "routine"
    CHECKED = "checked"
    CLARIFICATION_REQUIRED = "clarification_required"
    COMBAT = "combat"


class ActionProposal(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: Literal[1] = 1
    action_id: ActionId
    run_id: RunId
    content_version: ContentVersion
    actor: EntityRef
    family: ActionFamily
    exact_submission: str = Field(min_length=1, max_length=2_000)
    targets: tuple[EntityRef, ...] = ()
    affordance_id: StableId | None = None
    confidence: float = Field(ge=0.0, le=1.0)
    submitted_at: datetime


class ClarificationOption(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    label: str = Field(min_length=1, max_length=120)
    targets: tuple[EntityRef, ...]


class ClarificationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    action_id: ActionId
    prompt: str = Field(min_length=1, max_length=240)
    options: tuple[ClarificationOption, ...] = Field(min_length=2, max_length=5)


class DiceRecord(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    roll_id: StableId
    expression: str
    dice: tuple[int, ...]
    kept_indices: tuple[int, ...]
    modifiers: dict[str, int]
    total: int
    target: int | None = None
    outcome: str

    @model_validator(mode="after")
    def validate_kept_dice(self) -> "DiceRecord":
        if any(index < 0 or index >= len(self.dice) for index in self.kept_indices):
            raise ValueError("kept die index is outside dice tuple")
        return self


class StateEvent(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: Literal[1] = 1
    event_id: EventId
    run_id: RunId
    action_id: ActionId
    sequence: int = Field(ge=1)
    event_type: str = Field(pattern=r"^[a-z][a-z0-9_.-]*$")
    public: bool
    payload: dict[str, Any]
    occurred_at: datetime


class ActionResolution(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    status: ActionStatus
    reason_code: str | None = None
    clarification: ClarificationRequest | None = None

    @model_validator(mode="after")
    def validate_clarification(self) -> "ActionResolution":
        needs_clarification = self.status is ActionStatus.CLARIFICATION_REQUIRED
        if needs_clarification != (self.clarification is not None):
            raise ValueError(
                "clarification payload must exactly match clarification-required status"
            )
        return self


class ResolvedAction(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    schema_version: Literal[1] = 1
    proposal: ActionProposal
    resolution: ActionResolution
    dice: tuple[DiceRecord, ...] = ()
    events: tuple[StateEvent, ...] = ()
    narration_fact_ids: tuple[str, ...] = ()

    @model_validator(mode="after")
    def validate_atomic_result(self) -> "ResolvedAction":
        if self.resolution.status in {
            ActionStatus.IMPOSSIBLE,
            ActionStatus.CLARIFICATION_REQUIRED,
        } and (self.dice or self.events):
            raise ValueError("impossible or ambiguous actions cannot roll or emit events")
        if any(event.action_id != self.proposal.action_id for event in self.events):
            raise ValueError("every event must be caused by the resolved proposal")
        sequences = [event.sequence for event in self.events]
        if sequences != sorted(sequences) or len(sequences) != len(set(sequences)):
            raise ValueError("event sequences must be unique and ordered")
        return self
