CREATE TABLE IF NOT EXISTS "analysis_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"mood" text,
	"summary" text,
	"color" text,
	"negative" boolean,
	"entry_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analysis_table" ADD CONSTRAINT "analysis_table_entry_id_journal_entry_table_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."journal_entry_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "entry_id_unique_idx" ON "analysis_table" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_idx" ON "journal_entry_table" USING btree ("user_id");