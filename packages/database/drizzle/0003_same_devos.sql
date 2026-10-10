CREATE TYPE "platform"."admin_audit_code" AS ENUM('LOGIN_OK', 'LOGIN_FAILED', 'RATE_LIMIT', 'LOGOUT', 'ACCOUNT_CREATED', 'PASSWORD_CHANGED', 'SESSIONS_REVOKED');--> statement-breakpoint
CREATE TABLE "platform"."admin_audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" "platform"."admin_audit_code" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform"."admin_sessions" (
	"digest" varchar(64) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"csrf" varchar(64) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform"."admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"singleton" boolean DEFAULT true NOT NULL,
	"identifier" varchar(100) NOT NULL,
	"password_hash" text NOT NULL,
	"credential_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_singleton_unique" UNIQUE("singleton"),
	CONSTRAINT "admin_singleton_true" CHECK ("platform"."admin_users"."singleton" = true)
);
--> statement-breakpoint
ALTER TABLE "platform"."admin_sessions" ADD CONSTRAINT "admin_sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "platform"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "admin_audit_retention" ON "platform"."admin_audit" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "admin_sessions_expiry" ON "platform"."admin_sessions" USING btree ("expires_at");