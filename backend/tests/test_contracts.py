from __future__ import annotations

import unittest
from datetime import UTC, datetime

from pydantic import ValidationError
from wayfarer.domain.actions import (
    ActionFamily,
    ActionProposal,
    ActionResolution,
    ActionStatus,
    ResolvedAction,
    StateEvent,
)
from wayfarer.domain.ids import (
    ActionId,
    ContentVersion,
    EventId,
    LocationId,
    ProtagonistId,
    RunId,
)
from wayfarer.domain.models import CanonicalRunState, EntityKind, EntityRef, RunStatus


class IdentifierTests(unittest.TestCase):
    def test_identifier_types_are_not_interchangeable_at_runtime(self) -> None:
        location_id = LocationId("location.drowned-nave")
        protagonist_id = ProtagonistId("protagonist.seren-holt")

        self.assertNotEqual(type(location_id), type(protagonist_id))
        self.assertEqual(str(location_id), "location.drowned-nave")

    def test_identifier_prefix_is_enforced(self) -> None:
        with self.assertRaises(ValidationError):
            LocationId("npc.sister-mara")


class ActionContractTests(unittest.TestCase):
    def setUp(self) -> None:
        self.proposal = ActionProposal(
            action_id=ActionId("action.0001"),
            run_id=RunId("run.0001"),
            content_version=ContentVersion("content.the-bell-below.1.0.0"),
            actor=EntityRef(
                kind=EntityKind.PROTAGONIST,
                entity_id=ProtagonistId("protagonist.seren-holt"),
            ),
            family=ActionFamily.EXAMINE,
            exact_submission="Seren studies the broken ward.",
            confidence=1.0,
            submitted_at=datetime(2026, 8, 29, tzinfo=UTC),
        )

    def test_action_round_trip_preserves_typed_contract(self) -> None:
        encoded = self.proposal.model_dump_json()
        decoded = ActionProposal.model_validate_json(encoded)

        self.assertEqual(decoded, self.proposal)
        self.assertIsInstance(decoded.action_id, ActionId)

    def test_impossible_action_cannot_emit_state_events(self) -> None:
        event = StateEvent(
            event_id=EventId("event.0001"),
            run_id=self.proposal.run_id,
            action_id=self.proposal.action_id,
            sequence=1,
            event_type="flag.changed",
            public=True,
            payload={"flag": "door.open"},
            occurred_at=datetime(2026, 8, 29, tzinfo=UTC),
        )
        with self.assertRaises(ValidationError):
            ResolvedAction(
                proposal=self.proposal,
                resolution=ActionResolution(
                    status=ActionStatus.IMPOSSIBLE,
                    reason_code="missing_key",
                ),
                events=(event,),
            )

    def test_event_sequence_must_be_unique_and_ordered(self) -> None:
        events = tuple(
            StateEvent(
                event_id=EventId(f"event.000{index}"),
                run_id=self.proposal.run_id,
                action_id=self.proposal.action_id,
                sequence=sequence,
                event_type="test.event",
                public=True,
                payload={},
                occurred_at=datetime(2026, 8, 29, tzinfo=UTC),
            )
            for index, sequence in ((1, 2), (2, 1))
        )
        with self.assertRaises(ValidationError):
            ResolvedAction(
                proposal=self.proposal,
                resolution=ActionResolution(status=ActionStatus.ROUTINE),
                events=events,
            )


class CanonicalStateTests(unittest.TestCase):
    def test_negative_resource_is_rejected(self) -> None:
        with self.assertRaises(ValidationError):
            CanonicalRunState(
                run_id=RunId("run.0001"),
                content_version=ContentVersion("content.the-bell-below.1.0.0"),
                protagonist_id=ProtagonistId("protagonist.seren-holt"),
                protagonist_location_id=LocationId("location.breach-stair"),
                resources={"resolve": -1},
            )

    def test_terminal_state_requires_ending_marker(self) -> None:
        with self.assertRaises(ValidationError):
            CanonicalRunState(
                run_id=RunId("run.0001"),
                content_version=ContentVersion("content.the-bell-below.1.0.0"),
                status=RunStatus.DEAD,
                protagonist_id=ProtagonistId("protagonist.seren-holt"),
                protagonist_location_id=LocationId("location.bell-crypt"),
            )


if __name__ == "__main__":
    unittest.main()
