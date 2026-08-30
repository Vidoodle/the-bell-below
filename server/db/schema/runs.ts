import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { CharacterId } from "../../../shared/character.js";
import type { RunId } from "../../../shared/run.js";
import { characters } from "./characters.js";

export const runs = pgTable("runs", {
  id: text().primaryKey().$type<RunId>(),
  characterId: text("character_id")
    .notNull()
    .$type<CharacterId>()
    .references(() => characters.id),
  prologueCompletedAt: timestamp("prologue_completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check("runs_id_format", sql`${table.id} ~ '^runs[0-9a-f]{30}$'`),
]);
