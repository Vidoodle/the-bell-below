import { sql } from "drizzle-orm";
import { check, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import type { CharacterId } from "../../shared/character.js";
import type { ProtagonistId } from "../../shared/protagonist.js";
import type { RunId } from "../../shared/run.js";
import { runs } from "../runs/table.js";

export const characters = pgTable("characters", {
  id: text().primaryKey().$type<CharacterId>(),
  runId: text("run_id")
    .notNull()
    .$type<RunId>()
    .unique()
    .references(() => runs.id),
  protagonistId: text("protagonist_id").notNull().$type<ProtagonistId>(),
  might: smallint().notNull(),
  grace: smallint().notNull(),
  wits: smallint().notNull(),
  presence: smallint().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check("characters_id_format", sql`${table.id} ~ '^char[0-9a-f]{30}$'`),
  check(
    "characters_protagonist",
    sql`${table.protagonistId} IN ('seren', 'veyra', 'cael', 'riona')`,
  ),
  check("characters_might_range", sql`${table.might} BETWEEN 1 AND 5`),
  check("characters_grace_range", sql`${table.grace} BETWEEN 1 AND 5`),
  check("characters_wits_range", sql`${table.wits} BETWEEN 1 AND 5`),
  check("characters_presence_range", sql`${table.presence} BETWEEN 1 AND 5`),
  check(
    "characters_stat_total",
    sql`${table.might} + ${table.grace} + ${table.wits} + ${table.presence} = 12`,
  ),
]);
