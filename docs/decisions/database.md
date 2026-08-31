# Database

Status: accepted.

## Decision

PostgreSQL is the persistent store for canonical run state. Executable server startup requires `DATABASE_URL`; the explicit development command supplies the repository-managed database described in [Local PostgreSQL workflows](local-postgresql-workflows.md).

The in-memory implementation is an interchangeable adapter used for unit tests and dependency injection. It is not production persistence. Authored adventure definitions remain in server-side source files; they are not copied into PostgreSQL merely to make them queryable.

## Why

Runs contain related, durable state that benefits from transactions, constraints, and explicit relationships. PostgreSQL provides those guarantees and leaves room for later querying and operational tooling without forcing the game domain into document-shaped records.
