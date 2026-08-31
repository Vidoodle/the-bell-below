import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import type { RunId } from "../../shared/run.js";
import { runs } from "../runs/table.js";

export const runSceneStates = pgTable("run_scene_states", {
  runId: text("run_id")
    .notNull()
    .$type<RunId>()
    .references(() => runs.id, { onDelete: "cascade" }),
  sceneId: text("scene_id").notNull(),
  phaseId: text("phase_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.runId, table.sceneId] }),
]);
