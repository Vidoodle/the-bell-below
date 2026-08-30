ALTER TABLE "runs" DROP CONSTRAINT "runs_character_id_characters_id_fk";
--> statement-breakpoint
ALTER TABLE "characters" ADD COLUMN "run_id" text;--> statement-breakpoint
UPDATE "characters"
SET "run_id" = "runs"."id"
FROM "runs"
WHERE "runs"."character_id" = "characters"."id";--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "run_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_run_id_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runs" DROP COLUMN "character_id";--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_run_id_unique" UNIQUE("run_id");
