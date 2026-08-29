"""Static integrity, secrecy, reachability, and ending-witness validation."""

from __future__ import annotations

import argparse
import json
import re
from collections import deque
from collections.abc import Iterable
from enum import StrEnum
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from bell_below.adventure.dsl import (
    AdvanceClock,
    AllOf,
    AnyOf,
    AtLocation,
    ClockAtLeast,
    DiscoverFact,
    Effect,
    EncounterStateIs,
    EndingEligible,
    FactDiscovered,
    GrantNpcKnowledge,
    HasItem,
    MarkEndingEligible,
    MoveEntity,
    Not,
    NpcAttitudeAtLeast,
    NpcKnows,
    Predicate,
    QuestStageIs,
    SetEncounterState,
    SetNpcAttitude,
    SetQuestStage,
    TransferItem,
    evaluate,
)
from bell_below.adventure.loader import AdventureLoadError, load_adventure
from bell_below.adventure.schema import AdventureDefinition, FactAudience
from bell_below.domain.ids import ContentVersion, RunId
from bell_below.domain.models import CanonicalRunState


class Severity(StrEnum):
    ERROR = "error"
    WARNING = "warning"


class ValidationIssue(BaseModel):
    model_config = ConfigDict(frozen=True)

    severity: Severity
    code: str
    source_file: str
    path: str
    message: str


class ValidationReport(BaseModel):
    model_config = ConfigDict(frozen=True)

    content_version: str
    issues: tuple[ValidationIssue, ...]

    @property
    def valid(self) -> bool:
        return not any(issue.severity is Severity.ERROR for issue in self.issues)

    @property
    def error_count(self) -> int:
        return sum(issue.severity is Severity.ERROR for issue in self.issues)

    @property
    def warning_count(self) -> int:
        return sum(issue.severity is Severity.WARNING for issue in self.issues)


def _predicate_references(predicate: Predicate) -> Iterable[tuple[str, str]]:
    if isinstance(predicate, AllOf | AnyOf):
        for child in predicate.predicates:
            yield from _predicate_references(child)
    elif isinstance(predicate, Not):
        yield from _predicate_references(predicate.predicate)
    elif isinstance(predicate, HasItem):
        yield "item", str(predicate.item_id)
        if predicate.owner != "protagonist" and "." in predicate.owner:
            owner_kind = predicate.owner.split(".", 1)[0]
            if owner_kind in {"npc", "location", "protagonist"}:
                yield owner_kind, predicate.owner
    elif isinstance(predicate, NpcAttitudeAtLeast):
        yield "npc", str(predicate.npc_id)
    elif isinstance(predicate, NpcKnows):
        yield "npc", str(predicate.npc_id)
        yield "fact", str(predicate.fact_id)
    elif isinstance(predicate, FactDiscovered):
        yield "fact", str(predicate.fact_id)
    elif isinstance(predicate, AtLocation):
        yield "location", str(predicate.location_id)
        if predicate.entity != "protagonist" and predicate.entity.startswith("npc."):
            yield "npc", predicate.entity
    elif isinstance(predicate, QuestStageIs):
        yield "quest", str(predicate.quest_id)
        yield "quest_stage", f"{predicate.quest_id}:{predicate.stage}"
    elif isinstance(predicate, ClockAtLeast):
        yield "clock", str(predicate.clock_id)
    elif isinstance(predicate, EncounterStateIs):
        yield "encounter", str(predicate.encounter_id)
    elif isinstance(predicate, EndingEligible):
        yield "ending", str(predicate.ending_id)


def _effect_references(effect: Effect) -> Iterable[tuple[str, str]]:
    if isinstance(effect, TransferItem):
        yield "item", str(effect.item_id)
        if effect.new_owner != "protagonist" and "." in effect.new_owner:
            owner_kind = effect.new_owner.split(".", 1)[0]
            if owner_kind in {"npc", "location", "protagonist"}:
                yield owner_kind, effect.new_owner
    elif isinstance(effect, SetNpcAttitude):
        yield "npc", str(effect.npc_id)
    elif isinstance(effect, GrantNpcKnowledge):
        yield "npc", str(effect.npc_id)
        yield "fact", str(effect.fact_id)
    elif isinstance(effect, DiscoverFact):
        yield "fact", str(effect.fact_id)
    elif isinstance(effect, MoveEntity):
        yield "location", str(effect.location_id)
        if effect.entity != "protagonist" and effect.entity.startswith("npc."):
            yield "npc", effect.entity
    elif isinstance(effect, SetQuestStage):
        yield "quest", str(effect.quest_id)
        yield "quest_stage", f"{effect.quest_id}:{effect.stage}"
    elif isinstance(effect, AdvanceClock):
        yield "clock", str(effect.clock_id)
    elif isinstance(effect, SetEncounterState):
        yield "encounter", str(effect.encounter_id)
    elif isinstance(effect, MarkEndingEligible):
        yield "ending", str(effect.ending_id)


def _all_rule_nodes(
    adventure: AdventureDefinition,
) -> Iterable[tuple[str, Predicate, tuple[Effect, ...]]]:
    for location in adventure.locations:
        for index, exit_definition in enumerate(location.exits):
            yield f"locations.{location.id}.exits[{index}]", exit_definition.predicate, ()
        for affordance in location.affordances:
            effects: list[Effect] = []
            if affordance.outcomes is not None:
                branches = (
                    affordance.outcomes.critical_success,
                    affordance.outcomes.success,
                    affordance.outcomes.failure,
                    affordance.outcomes.critical_failure,
                )
                effects.extend(
                    effect for branch in branches if branch is not None for effect in branch.effects
                )
            yield (
                f"locations.{location.id}.affordances.{affordance.id}",
                affordance.predicate,
                tuple(effects),
            )
    for npc in adventure.npcs:
        for record in npc.knowledge:
            yield f"npcs.{npc.id}.knowledge.{record.fact_id}", record.disclosure_predicate, ()
        for concession in npc.concessions:
            yield (
                f"npcs.{npc.id}.concessions.{concession.id}",
                concession.predicate,
                concession.success_effects,
            )
    for clock in adventure.clocks:
        for event in clock.events:
            yield f"clocks.{clock.id}.events.{event.threshold}", _always(), event.effects
    for quest in adventure.quests:
        for stage in quest.stages:
            yield f"quests.{quest.id}.stages.{stage.id}", stage.transition_predicate, ()
    for encounter in adventure.encounters:
        yield f"encounters.{encounter.id}", encounter.activation_predicate, ()
        for index, predicate in enumerate(encounter.alternate_resolution_predicates):
            yield f"encounters.{encounter.id}.alternates[{index}]", predicate, ()
    for ending in adventure.endings:
        yield f"endings.{ending.id}", ending.predicate, ending.terminal_effects


def _always() -> Predicate:
    from bell_below.adventure.dsl import Always

    return Always()


def _add(
    issues: list[ValidationIssue],
    code: str,
    path: str,
    message: str,
    severity: Severity = Severity.ERROR,
) -> None:
    section = path.split(".", 1)[0].split("[", 1)[0]
    source_files = {
        "metadata": "metadata.json",
        "facts": "facts.json",
        "items": "items.json",
        "protagonists": "protagonists.json",
        "locations": "locations.json",
        "npcs": "npcs.json",
        "clocks": "clocks.json",
        "quests": "quests.json",
        "encounters": "encounters.json",
        "endings": "endings.json",
    }
    issues.append(
        ValidationIssue(
            severity=severity,
            code=code,
            source_file=source_files.get(section, "manifest.json"),
            path=path,
            message=message,
        )
    )


def _reference_sets(adventure: AdventureDefinition) -> dict[str, set[str]]:
    quest_stages = {
        f"{quest.id}:{stage.id}" for quest in adventure.quests for stage in quest.stages
    }
    return {
        "fact": {str(item.id) for item in adventure.facts},
        "item": {str(item.id) for item in adventure.items},
        "protagonist": {str(item.id) for item in adventure.protagonists},
        "location": {str(item.id) for item in adventure.locations},
        "npc": {str(item.id) for item in adventure.npcs},
        "clock": {str(item.id) for item in adventure.clocks},
        "quest": {str(item.id) for item in adventure.quests},
        "quest_stage": quest_stages,
        "encounter": {str(item.id) for item in adventure.encounters},
        "ending": {str(item.id) for item in adventure.endings},
        "affordance": {
            str(affordance.id)
            for location in adventure.locations
            for affordance in location.affordances
        },
    }


def _validate_references(adventure: AdventureDefinition, issues: list[ValidationIssue]) -> None:
    references = _reference_sets(adventure)
    for path, predicate, effects in _all_rule_nodes(adventure):
        for kind, identifier in _predicate_references(predicate):
            if identifier not in references[kind]:
                _add(issues, "unknown_reference", path, f"unknown {kind} '{identifier}'")
        for effect in effects:
            for kind, identifier in _effect_references(effect):
                if identifier not in references[kind]:
                    _add(issues, "unknown_reference", path, f"unknown {kind} '{identifier}'")

    location_ids = references["location"]
    npc_ids = references["npc"]
    item_ids = references["item"]
    fact_ids = references["fact"]
    for location in adventure.locations:
        for exit_definition in location.exits:
            if str(exit_definition.to) not in location_ids:
                _add(
                    issues,
                    "unknown_exit",
                    f"locations.{location.id}.exits",
                    f"exit targets unknown location '{exit_definition.to}'",
                )
        for item_id in location.item_ids:
            if str(item_id) not in item_ids:
                _add(issues, "unknown_item", f"locations.{location.id}.items", str(item_id))
        for npc_id in location.initial_npc_ids:
            if str(npc_id) not in npc_ids:
                _add(issues, "unknown_npc", f"locations.{location.id}.npcs", str(npc_id))
        for fact_id in location.visible_facts:
            if str(fact_id) not in fact_ids:
                _add(issues, "unknown_fact", f"locations.{location.id}.facts", str(fact_id))
    for protagonist in adventure.protagonists:
        for affordance_id in protagonist.unique_affordances:
            if str(affordance_id) not in references["affordance"]:
                _add(
                    issues,
                    "unknown_affordance",
                    f"protagonists.{protagonist.id}.unique_affordances",
                    str(affordance_id),
                )


def _validate_ownership(adventure: AdventureDefinition, issues: list[ValidationIssue]) -> None:
    location_ids = {str(location.id) for location in adventure.locations}
    npc_ids = {str(npc.id) for npc in adventure.npcs}
    protagonist_ids = {str(protagonist.id) for protagonist in adventure.protagonists}
    item_by_id = {item.id: item for item in adventure.items}
    item_by_text = {str(item.id): item for item in adventure.items}
    declared_starts: dict[str, set[str]] = {}
    declared_locations: dict[str, set[str]] = {}
    for protagonist in adventure.protagonists:
        for item_id in protagonist.starting_items:
            declared_starts.setdefault(str(item_id), set()).add(str(protagonist.id))
            if item_id not in item_by_id:
                _add(
                    issues,
                    "unknown_item",
                    f"protagonists.{protagonist.id}.starting_items",
                    str(item_id),
                )
    for item in adventure.items:
        owner = item.initial_owner
        valid = owner == "unplaced" or owner in location_ids | npc_ids | protagonist_ids
        if not valid:
            _add(issues, "invalid_owner", f"items.{item.id}.initial_owner", owner)
        starts = declared_starts.get(str(item.id), set())
        if len(starts) > 1 and item.unique:
            _add(
                issues,
                "duplicate_ownership",
                f"items.{item.id}",
                f"unique item is assigned to multiple protagonists: {sorted(starts)}",
            )
        if starts and owner not in starts:
            _add(
                issues,
                "ownership_mismatch",
                f"items.{item.id}.initial_owner",
                f"owner '{owner}' does not match protagonist assignment {sorted(starts)}",
            )
    for location in adventure.locations:
        for item_id in location.item_ids:
            declared_locations.setdefault(str(item_id), set()).add(str(location.id))
    for item_key, locations in declared_locations.items():
        if len(locations) > 1:
            _add(
                issues,
                "duplicate_ownership",
                f"items.{item_key}",
                f"item is placed in multiple locations: {sorted(locations)}",
            )
        definition = item_by_text.get(item_key)
        if definition is not None and definition.initial_owner not in locations:
            _add(
                issues,
                "ownership_mismatch",
                f"items.{item_key}.initial_owner",
                (
                    f"owner '{definition.initial_owner}' does not match "
                    f"location placement {sorted(locations)}"
                ),
            )


def _validate_secret_boundaries(
    adventure: AdventureDefinition, issues: list[ValidationIssue]
) -> None:
    fact_by_id = {fact.id: fact for fact in adventure.facts}
    npc_ids = {npc.id for npc in adventure.npcs}
    for fact_definition in adventure.facts:
        for npc_id in fact_definition.allowed_knowers:
            if npc_id not in npc_ids:
                _add(
                    issues,
                    "unknown_npc",
                    f"facts.{fact_definition.id}.allowed_knowers",
                    str(npc_id),
                )
        if fact_definition.audience is FactAudience.ENGINE_ONLY and fact_definition.discoverable_at:
            _add(
                issues,
                "engine_fact_discoverable",
                f"facts.{fact_definition.id}.discoverable_at",
                "engine-only fact cannot have player discovery locations",
            )
    for protagonist in adventure.protagonists:
        for fact_id in protagonist.known_facts:
            known_fact = fact_by_id.get(fact_id)
            if known_fact is None:
                _add(
                    issues,
                    "unknown_fact",
                    f"protagonists.{protagonist.id}.known_facts",
                    str(fact_id),
                )
            elif known_fact.audience is FactAudience.ENGINE_ONLY:
                _add(
                    issues,
                    "secret_leak",
                    f"protagonists.{protagonist.id}.known_facts",
                    f"engine-only fact '{fact_id}' is assigned to a protagonist",
                )
        lower_rule = protagonist.narration_rule.lower()
        if "third person" not in lower_rule or re.search(r"\b(you|your|yours)\b", lower_rule):
            _add(
                issues,
                "perspective_rule",
                f"protagonists.{protagonist.id}.narration_rule",
                "narration rule must require third person without second-person address",
            )
    for location in adventure.locations:
        for fact_id in location.visible_facts:
            visible_fact = fact_by_id.get(fact_id)
            if (
                visible_fact is not None
                and visible_fact.audience is not FactAudience.PLAYER_DISCOVERABLE
            ):
                _add(
                    issues,
                    "secret_leak",
                    f"locations.{location.id}.visible_facts",
                    f"non-public fact '{fact_id}' is directly visible",
                )
    for npc in adventure.npcs:
        for knowledge in npc.knowledge:
            npc_fact = fact_by_id.get(knowledge.fact_id)
            if npc_fact is None:
                _add(issues, "unknown_fact", f"npcs.{npc.id}.knowledge", str(knowledge.fact_id))
                continue
            if (
                npc_fact.audience is not FactAudience.PLAYER_DISCOVERABLE
                and npc.id not in npc_fact.allowed_knowers
            ):
                _add(
                    issues,
                    "unauthorized_knowledge",
                    f"npcs.{npc.id}.knowledge.{knowledge.fact_id}",
                    "NPC is not in the fact's allowed-knower set",
                )


def _reachable(graph: dict[str, set[str]], start: str) -> set[str]:
    seen = {start}
    pending: deque[str] = deque([start])
    while pending:
        current = pending.popleft()
        for neighbor in graph.get(current, set()) - seen:
            seen.add(neighbor)
            pending.append(neighbor)
    return seen


def _validate_location_graph(adventure: AdventureDefinition, issues: list[ValidationIssue]) -> None:
    graph = {
        str(location.id): {str(exit_definition.to) for exit_definition in location.exits}
        for location in adventure.locations
    }
    start = str(adventure.metadata.start_location_id)
    finale = str(adventure.metadata.finale_location_id)
    if start not in graph:
        _add(issues, "unknown_start", "metadata.start_location_id", start)
        return
    if finale not in graph:
        _add(issues, "unknown_finale", "metadata.finale_location_id", finale)
        return
    reachable = _reachable(graph, start)
    for required_location_id in adventure.metadata.required_reachable_locations:
        if str(required_location_id) not in reachable:
            _add(
                issues,
                "unreachable_location",
                "metadata.required_reachable_locations",
                str(required_location_id),
            )
    reverse: dict[str, set[str]] = {node: set() for node in graph}
    for source, destinations in graph.items():
        for destination in destinations:
            reverse.setdefault(destination, set()).add(source)
    can_reach_finale = _reachable(reverse, finale)
    terminal = {str(location.id) for location in adventure.locations if location.terminal_location}
    for reachable_location_id in reachable - terminal:
        if reachable_location_id not in can_reach_finale:
            _add(
                issues,
                "soft_lock",
                f"locations.{reachable_location_id}",
                "reachable nonterminal location cannot reach the finale",
            )


def _validate_npc_placement(adventure: AdventureDefinition, issues: list[ValidationIssue]) -> None:
    location_by_id = {location.id: location for location in adventure.locations}
    for npc in adventure.npcs:
        location = location_by_id.get(npc.initial_location_id)
        if location is None:
            _add(
                issues,
                "unknown_location",
                f"npcs.{npc.id}.initial_location_id",
                str(npc.initial_location_id),
            )
        elif npc.id not in location.initial_npc_ids:
            _add(
                issues,
                "occupancy_mismatch",
                f"npcs.{npc.id}.initial_location_id",
                f"location '{location.id}' does not list this NPC as an initial occupant",
            )


def _witness_state(
    adventure: AdventureDefinition, ending_index: int, witness_index: int
) -> CanonicalRunState:
    ending = adventure.endings[ending_index]
    witness = ending.witnesses[witness_index]
    return CanonicalRunState(
        run_id=RunId("run.validation"),
        content_version=ContentVersion(str(adventure.metadata.content_version)),
        protagonist_id=witness.protagonist_id,
        protagonist_location_id=witness.location_id,
        flags=witness.flags,
        resources=witness.resources,
        item_owners=witness.item_owners,
        npc_attitudes=witness.npc_attitudes,
        npc_knowledge=witness.npc_knowledge,
        discovered_facts=witness.discovered_facts,
        quest_stages=witness.quest_stages,
        clocks=witness.clocks,
        encounter_states=witness.encounter_states,
        ending_eligibility={str(item) for item in witness.eligible_endings},
    )


def _validate_endings(adventure: AdventureDefinition, issues: list[ValidationIssue]) -> None:
    witnessed_protagonists: set[str] = set()
    for ending_index, ending in enumerate(adventure.endings):
        valid_witness = False
        for witness_index, witness in enumerate(ending.witnesses):
            witnessed_protagonists.add(str(witness.protagonist_id))
            try:
                state = _witness_state(adventure, ending_index, witness_index)
            except ValueError as error:
                _add(
                    issues,
                    "invalid_ending_witness",
                    f"endings.{ending.id}.witnesses[{witness_index}]",
                    str(error),
                )
                continue
            if evaluate(ending.predicate, state):
                valid_witness = True
            else:
                _add(
                    issues,
                    "unreachable_ending",
                    f"endings.{ending.id}.witnesses[{witness_index}]",
                    f"witness '{witness.name}' does not satisfy the ending predicate",
                )
        if not valid_witness:
            _add(
                issues,
                "unreachable_ending",
                f"endings.{ending.id}",
                "ending has no valid witness state",
            )
    for protagonist in adventure.protagonists:
        if str(protagonist.id) not in witnessed_protagonists:
            _add(
                issues,
                "protagonist_no_ending",
                f"protagonists.{protagonist.id}",
                "protagonist appears in no ending witness",
            )


def validate_adventure(adventure: AdventureDefinition) -> ValidationReport:
    """Run all static validators and return a stable machine-readable report."""

    issues: list[ValidationIssue] = []
    if len(adventure.protagonists) != 4:
        _add(
            issues,
            "protagonist_count",
            "protagonists",
            (
                "The Bell Below requires exactly four protagonists; "
                f"found {len(adventure.protagonists)}"
            ),
        )
    if not (
        60 <= adventure.metadata.target_minutes_min <= adventure.metadata.target_minutes_max <= 90
    ):
        _add(
            issues,
            "playtime_budget",
            "metadata",
            "target playtime must fit the 60–90 minute demo budget",
        )
    _validate_references(adventure, issues)
    _validate_ownership(adventure, issues)
    _validate_secret_boundaries(adventure, issues)
    _validate_location_graph(adventure, issues)
    _validate_npc_placement(adventure, issues)
    _validate_endings(adventure, issues)
    return ValidationReport(
        content_version=str(adventure.metadata.content_version), issues=tuple(issues)
    )


def _format_human(report: ValidationReport) -> str:
    lines = [
        f"Content {report.content_version}: {'VALID' if report.valid else 'INVALID'}",
        f"Errors: {report.error_count}; warnings: {report.warning_count}",
    ]
    lines.extend(
        f"[{issue.severity.upper()}] {issue.code} at {issue.path}: {issue.message}"
        for issue in report.issues
    )
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate versioned Bell Below adventure content")
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--json", action="store_true", dest="as_json")
    arguments = parser.parse_args(argv)
    try:
        adventure = load_adventure(arguments.manifest)
    except AdventureLoadError as error:
        if arguments.as_json:
            print(json.dumps({"valid": False, "load_error": str(error)}, indent=2))
        else:
            print(f"LOAD ERROR: {error}")
        return 2
    report = validate_adventure(adventure)
    if arguments.as_json:
        print(report.model_dump_json(indent=2))
    else:
        print(_format_human(report))
    return 0 if report.valid else 1


if __name__ == "__main__":
    raise SystemExit(main())
