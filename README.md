# The Bell Below

A curated gothic-fantasy RPG demo with persistent world state and an AI DM grounded by binding game rules.

## Documentation

- [Product and technical specification](docs/product-spec.md)
- [AI-assisted play design](docs/game-design/ai-assisted-play.md)
- [Engineering decisions](docs/decisions/README.md)
- [Setting lore](docs/lore/README.md)

## Development

```sh
pnpm install
pnpm dev
```

The backend reads its PostgreSQL connection string from the `DATABASE_URL` environment variable. Keep that value outside the repository. Before starting the server against a new database, run `pnpm db:migrate` to apply the committed migrations.

The web client runs at `http://127.0.0.1:5173` and proxies `/api` requests to the local Fastify server.

Run `pnpm test` for the API and domain tests, or `pnpm build` to compile the production server and client.

Set `TEST_DATABASE_URL` and run `pnpm test:integration` to verify PostgreSQL persistence across a server restart. The command fails when the variable is missing. Use a disposable test database because the test applies the committed migrations and temporarily inserts a character and run.
