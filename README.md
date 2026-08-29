# The Bell Below

This repository is being rebuilt around **The Bell Below**, a 60–90 minute
authored gothic-fantasy RPG. The engine owns reality; language models will
eventually interpret intent and render dialogue, but they will not control
state or outcomes.

The current milestone contains the headless, versioned content contracts and
adventure source data. It deliberately has no FastAPI, database, frontend, or
LLM dependency.

## Validate the content

From the repository root, using Python 3.12 with Pydantic 2 installed:

```powershell
$env:PYTHONPATH = "backend/src"
python -m bell_below.adventure.validation content/the-bell-below/1.0.0/manifest.json
python -m unittest discover -s backend/tests -v
```

The validator emits a human-readable report by default. Pass `--json` for a
machine-readable report suitable for CI.

## Source layout

- `backend/src/bell_below/domain`: framework-independent identifiers and action/event contracts.
- `backend/src/bell_below/adventure`: predicate/effect DSL, schemas, loader, and static validation.
- `content/the-bell-below/1.0.0`: version-pinned authored adventure data and bible.
- `backend/tests`: contract, validator, reachability, and secret-boundary tests.

The canonical demo requirements and architecture are documented in
[`docs/product-spec.md`](docs/product-spec.md).
