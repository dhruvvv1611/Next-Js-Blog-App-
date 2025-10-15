ALTER TABLE "accounts" ADD COLUMN "provider_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "provided_id";