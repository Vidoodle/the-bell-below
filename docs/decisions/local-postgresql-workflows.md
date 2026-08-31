# Local PostgreSQL workflows

Status: accepted.

## Decision

Docker Compose defines two PostgreSQL services:

- `postgres-dev` uses a generated password, stores local development data in a checkout-specific named volume, and binds to loopback port 5432. Its validated configuration is kept in the gitignored `.env.database.local` file.
- `postgres-test` receives a fresh password, unique Compose project name, and dynamically allocated loopback port for every integration-test invocation. Its data is ephemeral and the entire test project is removed afterward.

Executable server and ordinary Drizzle migration commands always require `DATABASE_URL`. The explicit development and local-migration commands load the validated repository-managed URL. This keeps deployment configuration fail-closed rather than inferring development from the absence of a production flag.

An explicitly supplied `TEST_DATABASE_URL` may replace the managed test container only when its database name ends in `_test`, it differs from `DATABASE_URL`, and the caller sets `CONFIRM_EXTERNAL_TEST_DATABASE=1` to acknowledge that migrations will be applied.

## Why

The game and its persistence test should run from a fresh checkout without developers or agents inventing connection strings or maintaining shared databases. Persistent development storage supports ordinary work, while generated credentials and uniquely scoped ephemeral tests avoid passwordless access, cross-run interference, and broad cleanup. Keeping server configuration explicit prevents local conveniences from becoming deployment defaults.
