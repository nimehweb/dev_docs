CREATE TABLE "note_favorites" (
	"user_id" uuid NOT NULL,
	"note_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "note_favorites_user_id_note_id_pk" PRIMARY KEY("user_id","note_id")
);
--> statement-breakpoint
CREATE TABLE "notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"blocks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notes_status_check" CHECK ("notes"."status" IN ('draft', 'published'))
);
--> statement-breakpoint
ALTER TABLE "note_favorites" ADD CONSTRAINT "note_favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_favorites" ADD CONSTRAINT "note_favorites_note_id_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "note_favorites_user_id_idx" ON "note_favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "note_favorites_note_id_idx" ON "note_favorites" USING btree ("note_id");--> statement-breakpoint
CREATE INDEX "notes_user_id_created_at_idx" ON "notes" USING btree ("user_id","created_at");