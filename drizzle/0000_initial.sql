CREATE TABLE "characters" (
	"id" text PRIMARY KEY NOT NULL,
	"protagonist_id" text NOT NULL,
	"might" smallint NOT NULL,
	"grace" smallint NOT NULL,
	"wits" smallint NOT NULL,
	"presence" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "characters_id_format" CHECK ("characters"."id" ~ '^char[0-9a-f]{30}$'),
	CONSTRAINT "characters_protagonist" CHECK ("characters"."protagonist_id" IN ('seren', 'veyra', 'cael', 'riona')),
	CONSTRAINT "characters_might_range" CHECK ("characters"."might" BETWEEN 1 AND 5),
	CONSTRAINT "characters_grace_range" CHECK ("characters"."grace" BETWEEN 1 AND 5),
	CONSTRAINT "characters_wits_range" CHECK ("characters"."wits" BETWEEN 1 AND 5),
	CONSTRAINT "characters_presence_range" CHECK ("characters"."presence" BETWEEN 1 AND 5),
	CONSTRAINT "characters_stat_total" CHECK ("characters"."might" + "characters"."grace" + "characters"."wits" + "characters"."presence" = 12)
);
--> statement-breakpoint
CREATE TABLE "runs" (
	"id" text PRIMARY KEY NOT NULL,
	"character_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "runs_id_format" CHECK ("runs"."id" ~ '^runs[0-9a-f]{30}$')
);
--> statement-breakpoint
ALTER TABLE "runs" ADD CONSTRAINT "runs_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;