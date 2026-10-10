CREATE TYPE "platform"."contact_category" AS ENUM('web', 'product', 'automation', 'data', 'other');--> statement-breakpoint
CREATE TYPE "platform"."contact_event_type" AS ENUM('RECEIVED', 'NOTIFICATION_SENT', 'NOTIFICATION_FAILED');--> statement-breakpoint
CREATE TYPE "platform"."contact_locale" AS ENUM('es', 'en');--> statement-breakpoint
CREATE TYPE "platform"."contact_status" AS ENUM('NEW', 'READ', 'RESPONDED', 'ARCHIVED', 'SPAM');--> statement-breakpoint
CREATE TYPE "platform"."notification_status" AS ENUM('PENDING', 'SENT', 'FAILED');--> statement-breakpoint
CREATE TABLE "platform"."contact_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"type" "platform"."contact_event_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform"."contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(254) NOT NULL,
	"company" varchar(160),
	"project_type" "platform"."contact_category",
	"message" text NOT NULL,
	"locale" "platform"."contact_locale" NOT NULL,
	"status" "platform"."contact_status" DEFAULT 'NEW' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_interaction_at" timestamp with time zone DEFAULT now() NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"privacy_notice_version" varchar(40) NOT NULL,
	"notification_status" "platform"."notification_status" DEFAULT 'PENDING' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "platform"."contact_events" ADD CONSTRAINT "contact_events_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "platform"."contacts"("id") ON DELETE no action ON UPDATE no action;