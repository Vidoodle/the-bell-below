# The Bell Below

A curated gothic-fantasy RPG demo with persistent world state and an AI DM grounded by binding game rules.

## Documentation

- [Product and technical specification](docs/product-spec.md)
- [AI-assisted play design](docs/game-design/ai-assisted-play.md)
- [Engineering decisions](docs/decisions/README.md)
- [Setting lore](docs/lore/README.md)

## Development

Prerequisites: Node.js, pnpm, and Docker with Docker Compose.

```sh
pnpm install
pnpm db:setup
pnpm dev
```

`pnpm db:setup` generates a random local database password in the gitignored `.env.database.local` file, starts the repository's PostgreSQL container, and applies the committed Drizzle migrations. Development data is stored in a repository-specific Docker volume and survives ordinary server and container restarts. `pnpm dev` reads the validated local configuration explicitly; executable server startup otherwise requires `DATABASE_URL`.

The web client runs at `http://127.0.0.1:5173` and proxies `/api` requests to the local Fastify server.

Run `pnpm test` for the API and domain tests, or `pnpm build` to compile the production server and client.

### Database commands

| Command | Purpose |
| --- | --- |
| `pnpm db:start` | Start the persistent local development database. |
| `pnpm db:migrate:local` | Apply committed migrations to the repository-managed development database. |
| `pnpm db:migrate` | Apply committed migrations to an explicitly supplied `DATABASE_URL`. |
| `pnpm db:stop` | Stop the local container without deleting development data. |
| `pnpm db:reset` | Remove only this checkout's development container and database volume. Run `pnpm db:setup` afterward to recreate them. |

The repository-managed databases publish only to loopback addresses. Local credentials remain in `.env.database.local`; test credentials are generated per run. Production requires an explicit `DATABASE_URL` and never uses the local configuration.

### PostgreSQL integration test

```sh
pnpm test:integration
```

This command creates a uniquely named PostgreSQL environment with a random password and host port, applies the committed migrations, runs the real persistence test, and removes the environment even when the test fails. Its database uses ephemeral storage, so concurrent test runs do not share state or cleanup targets.

To use an existing disposable test database instead, set `TEST_DATABASE_URL` and `CONFIRM_EXTERNAL_TEST_DATABASE=1`. Its database name must end with `_test`, and its normalized host, port, and database name must differ from `DATABASE_URL`. The confirmation is deliberately required because the test applies migrations. The same command is suitable for CI runners with Docker available; the repository does not yet have a broader CI workflow to extend.
