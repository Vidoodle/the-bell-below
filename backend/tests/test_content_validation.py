from __future__ import annotations

import copy
import json
import tempfile
import unittest
from pathlib import Path

from pydantic import ValidationError
from wayfarer.adventure.loader import AdventureLoadError, load_adventure
from wayfarer.adventure.schema import AdventureDefinition
from wayfarer.adventure.validation import validate_adventure

REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
MANIFEST = REPOSITORY_ROOT / "content" / "the-bell-below" / "1.0.0" / "manifest.json"


class AuthoredContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.adventure = load_adventure(MANIFEST)

    def mutate(self) -> dict[str, object]:
        return copy.deepcopy(self.adventure.model_dump(mode="json"))

    def test_authored_content_loads_and_validates(self) -> None:
        report = validate_adventure(self.adventure)

        self.assertTrue(report.valid, report.model_dump_json(indent=2))
        self.assertEqual(len(self.adventure.protagonists), 4)
        self.assertEqual(len(self.adventure.locations), 8)
        self.assertEqual(len(self.adventure.npcs), 5)
        self.assertEqual(len(self.adventure.endings), 5)

    def test_duplicate_identifier_is_a_schema_error(self) -> None:
        document = self.mutate()
        facts = document["facts"]
        assert isinstance(facts, list)
        facts.append(copy.deepcopy(facts[0]))

        with self.assertRaises(ValidationError):
            AdventureDefinition.model_validate(document)

    def test_dangling_location_reference_is_detected(self) -> None:
        document = self.mutate()
        document["locations"][0]["exits"][0]["to"] = "location.missing"
        report = validate_adventure(AdventureDefinition.model_validate(document))

        issue = next(issue for issue in report.issues if issue.code == "unknown_exit")
        self.assertEqual(issue.source_file, "locations.json")

    def test_manifest_cannot_escape_its_content_directory(self) -> None:
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        manifest["metadata"] = "../metadata.json"
        with tempfile.TemporaryDirectory() as directory:
            manifest_path = Path(directory) / "manifest.json"
            manifest_path.write_text(json.dumps(manifest), encoding="utf-8")

            with self.assertRaisesRegex(AdventureLoadError, "escapes content directory"):
                load_adventure(manifest_path)

    def test_manifest_and_metadata_versions_must_match(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for path in MANIFEST.parent.iterdir():
                if path.suffix == ".json":
                    (root / path.name).write_bytes(path.read_bytes())
            metadata_path = root / "metadata.json"
            metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
            metadata["content_version"] = "content.the-bell-below.1.0.1"
            metadata_path.write_text(json.dumps(metadata), encoding="utf-8")

            with self.assertRaisesRegex(AdventureLoadError, "does not match"):
                load_adventure(root / "manifest.json")

    def test_soft_lock_is_detected(self) -> None:
        document = self.mutate()
        chain = next(
            location
            for location in document["locations"]
            if location["id"] == "location.chain-tower"
        )
        chain["exits"] = [
            {
                "to": "location.black-cistern",
                "label": "Descend",
                "predicate": {"kind": "always", "value": True},
                "one_way": False,
            }
        ]
        report = validate_adventure(AdventureDefinition.model_validate(document))

        self.assertIn("soft_lock", {issue.code for issue in report.issues})

    def test_duplicate_item_ownership_is_detected(self) -> None:
        document = self.mutate()
        duplicate_item = document["protagonists"][0]["starting_items"][0]
        document["protagonists"][1]["starting_items"].append(duplicate_item)
        report = validate_adventure(AdventureDefinition.model_validate(document))

        self.assertIn("duplicate_ownership", {issue.code for issue in report.issues})

    def test_engine_only_fact_leak_is_detected(self) -> None:
        document = self.mutate()
        document["protagonists"][0]["known_facts"].append("fact.truth.death-diversion")
        report = validate_adventure(AdventureDefinition.model_validate(document))

        self.assertIn("secret_leak", {issue.code for issue in report.issues})

    def test_unauthorized_npc_knowledge_is_detected(self) -> None:
        document = self.mutate()
        lucan = next(npc for npc in document["npcs"] if npc["id"] == "npc.lucan-vey")
        lucan["knowledge"].append(
            {
                "fact_id": "fact.truth.death-diversion",
                "stance": "knows_true",
                "confidence": 1.0,
                "source": "test leak",
                "disclosure_predicate": {"kind": "always", "value": True},
            }
        )
        report = validate_adventure(AdventureDefinition.model_validate(document))

        self.assertIn("unauthorized_knowledge", {issue.code for issue in report.issues})

    def test_false_ending_witness_is_detected(self) -> None:
        document = self.mutate()
        final_toll = next(
            ending for ending in document["endings"] if ending["id"] == "ending.final-toll"
        )
        final_toll["witnesses"][0]["clocks"]["clock.midnight"] = 5
        final_toll["witnesses"][0]["eligible_endings"] = []
        report = validate_adventure(AdventureDefinition.model_validate(document))

        self.assertIn("unreachable_ending", {issue.code for issue in report.issues})

    def test_every_protagonist_and_ending_family_has_a_witness(self) -> None:
        protagonists = {
            str(witness.protagonist_id)
            for ending in self.adventure.endings
            for witness in ending.witnesses
        }
        families = {ending.family for ending in self.adventure.endings}

        self.assertEqual(
            protagonists,
            {str(protagonist.id) for protagonist in self.adventure.protagonists},
        )
        self.assertEqual(
            families,
            {"reseal", "break", "silence_without_release", "claim", "catastrophic_failure"},
        )


if __name__ == "__main__":
    unittest.main()
