CREATE TABLE "run_scene_states" (
	"run_id" text NOT NULL,
	"scene_id" text NOT NULL,
	"phase_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "run_scene_states_run_id_scene_id_pk" PRIMARY KEY("run_id","scene_id")
);
--> statement-breakpoint
ALTER TABLE "runs" ADD COLUMN "current_scene_id" text;--> statement-breakpoint
ALTER TABLE "run_scene_states" ADD CONSTRAINT "run_scene_states_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
INSERT INTO "run_scene_states" (
	"run_id",
	"scene_id",
	"phase_id",
	"created_at",
	"updated_at"
)
SELECT
	"id",
	'guarded-entrance',
	'guarded',
	"prologue_completed_at",
	"prologue_completed_at"
FROM "runs"
WHERE "prologue_completed_at" IS NOT NULL;--> statement-breakpoint
UPDATE "runs"
SET "current_scene_id" = 'guarded-entrance'
WHERE "prologue_completed_at" IS NOT NULL;
