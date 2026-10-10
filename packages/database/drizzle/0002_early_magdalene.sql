CREATE TABLE "platform"."analytics_consents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"accepted_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "platform"."analytics_daily" (
	"day" date PRIMARY KEY NOT NULL,
	"metrics" jsonb NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform"."analytics_events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"session_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"name" varchar(40) NOT NULL,
	"received_at" timestamp with time zone NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"dimensions" jsonb NOT NULL,
	"properties" jsonb NOT NULL,
	"once_key" varchar(80)
);
--> statement-breakpoint
CREATE TABLE "platform"."analytics_sessions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"consent_id" uuid,
	"visitor_id" uuid NOT NULL,
	"entry" varchar(20) NOT NULL,
	"first_at" timestamp with time zone NOT NULL,
	"last_at" timestamp with time zone NOT NULL,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"counters" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "platform"."analytics_events" ADD CONSTRAINT "analytics_events_session_id_analytics_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "platform"."analytics_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "platform"."analytics_sessions" ADD CONSTRAINT "analytics_sessions_consent_id_analytics_consents_id_fk" FOREIGN KEY ("consent_id") REFERENCES "platform"."analytics_consents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "analytics_once_session" ON "platform"."analytics_events" USING btree ("session_id","once_key");