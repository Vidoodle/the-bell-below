"""Safe, source-aware loading for split, versioned adventure JSON files."""

from __future__ import annotations

import json
from pathlib import Path, PurePosixPath
from typing import cast

from pydantic import BaseModel, ValidationError

from wayfarer.adventure.schema import (
    AdventureDefinition,
    AdventureManifest,
    AdventureMetadata,
    ClockDefinition,
    EncounterDefinition,
    EndingDefinition,
    FactDefinition,
    ItemDefinition,
    LocationDefinition,
    NpcDefinition,
    ProtagonistDefinition,
    QuestDefinition,
)


class AdventureLoadError(ValueError):
    """Raised when versioned content cannot be loaded safely or validated."""


def _read_json(path: Path) -> object:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as error:
        raise AdventureLoadError(f"missing content file: {path}") from error
    except json.JSONDecodeError as error:
        raise AdventureLoadError(
            f"invalid JSON in {path}:{error.lineno}:{error.colno}: {error.msg}"
        ) from error


def _resolve_content_path(base: Path, relative: PurePosixPath) -> Path:
    candidate = (base / Path(*relative.parts)).resolve()
    if base.resolve() not in candidate.parents:
        raise AdventureLoadError(f"manifest path escapes content directory: {relative}")
    return candidate


def _load_model[ModelT: BaseModel](path: Path, model_type: type[ModelT]) -> ModelT:
    try:
        return model_type.model_validate(_read_json(path))
    except ValidationError as error:
        raise AdventureLoadError(f"schema error in {path}:\n{error}") from error


def _load_list[ModelT: BaseModel](path: Path, model_type: type[ModelT]) -> tuple[ModelT, ...]:
    try:
        raw = _read_json(path)
        if not isinstance(raw, list):
            raise AdventureLoadError(f"expected a JSON array in {path}")
        return tuple(model_type.model_validate(cast(object, item)) for item in raw)
    except ValidationError as error:
        raise AdventureLoadError(f"schema error in {path}:\n{error}") from error


def load_adventure(manifest_path: str | Path) -> AdventureDefinition:
    """Load and fully schema-validate one pinned content version."""

    manifest_file = Path(manifest_path).resolve()
    manifest = _load_model(manifest_file, AdventureManifest)
    base = manifest_file.parent
    adventure = AdventureDefinition(
        metadata=_load_model(_resolve_content_path(base, manifest.metadata), AdventureMetadata),
        facts=_load_list(_resolve_content_path(base, manifest.facts), FactDefinition),
        items=_load_list(_resolve_content_path(base, manifest.items), ItemDefinition),
        protagonists=_load_list(
            _resolve_content_path(base, manifest.protagonists), ProtagonistDefinition
        ),
        locations=_load_list(_resolve_content_path(base, manifest.locations), LocationDefinition),
        npcs=_load_list(_resolve_content_path(base, manifest.npcs), NpcDefinition),
        clocks=_load_list(_resolve_content_path(base, manifest.clocks), ClockDefinition),
        quests=_load_list(_resolve_content_path(base, manifest.quests), QuestDefinition),
        encounters=_load_list(
            _resolve_content_path(base, manifest.encounters), EncounterDefinition
        ),
        endings=_load_list(_resolve_content_path(base, manifest.endings), EndingDefinition),
    )
    if adventure.metadata.content_version != manifest.content_version:
        raise AdventureLoadError(
            "manifest content version does not match adventure metadata version"
        )
    return adventure
