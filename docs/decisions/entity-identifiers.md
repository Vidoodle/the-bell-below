# Entity identifiers

Status: accepted.

## Decision

Persisted entities use typed string IDs consisting of a four-character entity prefix followed by 30 lowercase random hexadecimal characters.

Current examples are `runs` for runs and `char` for characters. TypeScript brands prevent IDs for different entity types from being interchanged accidentally, and PostgreSQL constraints enforce their stored format.

## Why

The prefix makes IDs recognizable in logs, URLs, and debugging, while the random suffix allows IDs to be generated without a database round trip.
