# The Bell Below

A curated gothic-fantasy RPG demo with persistent world state and an AI DM grounded by binding game rules.

## Documentation

- [Product and technical specification](docs/product-spec.md)

## Development

```sh
pnpm install
pnpm dev
```

The web client runs at `http://127.0.0.1:5173` and proxies `/api` requests to the local Fastify server.

Run `pnpm test` for the API and domain tests, or `pnpm build` to compile the production server and client.
