import { sql } from "drizzle-orm";
import { check, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import type { RunId } from "../../shared/run.js";
import type { SceneId } from "../adventure/scenes/model.js";

export const runs = pgTable("runs", {
  id: text().primaryKey().$type<RunId>(),
  prologueCompletedAt: timestamp("prologue_completed_at", { withTimezone: true }),
  currentSceneId: text("current_scene_id").$type<SceneId>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  check("runs_id_format", sql`${table.id} ~ '^runs[0-9a-f]{30}$'`),
]);
