# Database access and migrations

Status: accepted.

## Decision

The server uses Drizzle for typed table definitions and ordinary database queries. Drizzle Kit generates and applies committed, versioned migrations. The `pg` pool owns PostgreSQL connections.

Tables are never created or altered during application startup. Raw SQL is reserved for database constraints, migrations that require data movement, or queries Drizzle cannot express clearly.

Domain code accesses storage through narrow reader and writer interfaces. Drizzle records are translated into domain models rather than becoming the domain model themselves.

## Why

This provides type-safe SQL and explicit schemas without adopting a heavyweight Active Record ORM. Versioned migrations make database changes reviewable and repeatable.
