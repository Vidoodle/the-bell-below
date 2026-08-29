# Milestone 1 completion audit

Milestone: **1 — Content contracts and adventure bible**  
Linear scope: `VID-12` through `VID-20`

## Evidence by issue

| Issue | Requirement | Implementation evidence | Verification evidence |
|---|---|---|---|
| VID-12 | Canonical entities, IDs, invariants | `domain/ids.py`, `domain/models.py` | ID-prefix, type distinction, resource and terminal-state tests |
| VID-13 | Proposed/resolved action and event contracts | `domain/actions.py` | JSON round-trip, atomic impossible-action, event-order tests |
| VID-14 | Predicate/effect/outcome DSL | `adventure/dsl.py`, outcome models in `schema.py` | composition, ordered copy-on-write effects, illegal mutation tests |
| VID-15 | Versioned schema and loader | `adventure/schema.py`, `adventure/loader.py`, versioned manifest | valid load, duplicate-ID, mismatch/error-path validation |
| VID-16 | Bible, hidden truth, ending matrix | `adventure-bible.md`, `facts.json`, `endings.json` | playtime gate and valid witness state per ending |
| VID-17 | Four protagonist packs | `protagonists.json` | exact-count, unique-affordance, item ownership, per-protagonist ending witness checks |
| VID-18 | Location graph, objects, items, clock | `locations.json`, `items.json`, `clocks.json` | eight-location reachability, reverse finale reachability, soft-lock and ownership tests |
| VID-19 | NPC dossiers and disclosure policy | `npcs.json` | five-NPC count, placement, fact authorization, forbidden-concession schema checks |
| VID-20 | Static validation and reachability | `adventure/validation.py` | source-aware dangling ref, duplicate ownership, secret leak, unauthorized knowledge, soft lock, false ending witness fixtures |

## Current verified results

```text
ruff format --check: 15 files already formatted
ruff check: All checks passed
mypy --strict: Success, 11 source files
pytest: 23 passed
content validator: content.the-bell-below.1.0.0, zero issues
```

## Scope boundary

This milestone intentionally stops before event persistence, dice, checks,
combat execution, APIs, UI, and model calls. Those systems consume these
contracts in later milestones; none is smuggled into the content layer.

## Repository publication status

The implementation is complete and verified in the local milestone worktree.
Publication to `Vidoodle/wayfarer-roleplay` still requires that the connected
GitHub integration be granted access to the private repository, or that this
worktree be opened as a saved Codex project with a functional Git remote.
