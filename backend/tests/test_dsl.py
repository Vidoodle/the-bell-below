from __future__ import annotations

import unittest

from wayfarer.adventure.dsl import (
    AdjustResource,
    AllOf,
    AtLocation,
    FactDiscovered,
    HasItem,
    Not,
    SetFlag,
    TransferItem,
    apply_effects,
    evaluate,
)
from wayfarer.domain.ids import ContentVersion, FactId, ItemId, LocationId, ProtagonistId, RunId
from wayfarer.domain.models import CanonicalRunState


def make_state() -> CanonicalRunState:
    protagonist_id = ProtagonistId("protagonist.veyra-sable")
    return CanonicalRunState(
        run_id=RunId("run.dsl-test"),
        content_version=ContentVersion("content.the-bell-below.1.0.0"),
        protagonist_id=protagonist_id,
        protagonist_location_id=LocationId("location.vestry-archive"),
        resources={"resolve": 2},
        item_owners={ItemId("item.refugee-ledger"): "location.vestry-archive"},
        discovered_facts={FactId("fact.history.erased-refugees")},
    )


class PredicateTests(unittest.TestCase):
    def test_nested_predicate_is_deterministic(self) -> None:
        state = make_state()
        predicate = AllOf(
            predicates=(
                AtLocation(location_id=LocationId("location.vestry-archive")),
                FactDiscovered(fact_id=FactId("fact.history.erased-refugees")),
                Not(predicate=HasItem(item_id=ItemId("item.refugee-ledger"), owner="protagonist")),
            )
        )

        self.assertTrue(evaluate(predicate, state))
        self.assertTrue(evaluate(predicate, state))


class EffectTests(unittest.TestCase):
    def test_effects_apply_in_order_without_mutating_input(self) -> None:
        state = make_state()
        updated = apply_effects(
            state,
            (
                TransferItem(item_id=ItemId("item.refugee-ledger"), new_owner="protagonist"),
                AdjustResource(resource="resolve", amount=-1),
                SetFlag(flag="archive.ledger_taken", value=True),
            ),
        )

        self.assertEqual(state.resources["resolve"], 2)
        self.assertEqual(updated.resources["resolve"], 1)
        self.assertEqual(
            updated.item_owners[ItemId("item.refugee-ledger")],
            "protagonist.veyra-sable",
        )
        self.assertTrue(updated.flags["archive.ledger_taken"])

    def test_effect_cannot_overdraw_resource(self) -> None:
        with self.assertRaisesRegex(ValueError, "negative"):
            apply_effects(make_state(), (AdjustResource(resource="resolve", amount=-3),))

    def test_effect_cannot_transfer_unknown_item(self) -> None:
        with self.assertRaisesRegex(ValueError, "unknown item"):
            apply_effects(
                make_state(),
                (TransferItem(item_id=ItemId("item.missing"), new_owner="protagonist"),),
            )


if __name__ == "__main__":
    unittest.main()
