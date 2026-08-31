# Frontend application structure

Status: accepted.

## Decision

The browser application uses React, TypeScript, and Vite.

`src/App.tsx` owns top-level application flow. Screens live under `src/screens/`, HTTP clients under `src/api/`, and authored client-visible copy under `src/content/`. Components should not accumulate unrelated application flow, network access, and content in one file.

## Why

The game moves through distinct screens and needs explicit state transitions. Keeping rendering, transport, and copy separate makes those transitions easier to change and test without introducing a larger frontend framework.
