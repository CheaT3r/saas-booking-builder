import 'dotenv/config';
import { Pool } from 'pg';

const tablesToCreate = [
  {
    name: 'packages',
    sql: `CREATE TABLE IF NOT EXISTS "packages" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" varchar(256) NOT NULL,
      "description" text,
      "price_monthly" integer NOT NULL,
      "price_annually" integer,
      "features" jsonb DEFAULT '[]'::jsonb,
      "max_users" integer,
      "max_bookings" integer,
      "api_access" boolean DEFAULT false,
      "custom_branding" boolean DEFAULT false,
      "priority_support" boolean DEFAULT false,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'businesses',
    sql: `CREATE TABLE IF NOT EXISTS "businesses" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "owner_id" text NOT NULL,
      "name" varchar(256) NOT NULL,
      "slug" varchar(256) NOT NULL UNIQUE,
      "tagline" varchar(256),
      "description" text,
      "logo_url" varchar(256),
      "cover_image_url" varchar(256),
      "address" varchar(256),
      "phone" varchar(50),
      "email" varchar(256),
      "website" varchar(256),
      "primary_color" varchar(7) DEFAULT '#3b82f6',
      "accent_color" varchar(7) DEFAULT '#8b5cf6',
      "working_hours" jsonb DEFAULT '{"monday":{"open":"09:00","close":"18:00","closed":false},"tuesday":{"open":"09:00","close":"18:00","closed":false},"wednesday":{"open":"09:00","close":"18:00","closed":false},"thursday":{"open":"09:00","close":"18:00","closed":false},"friday":{"open":"09:00","close":"18:00","closed":false},"saturday":{"open":"10:00","close":"16:00","closed":false},"sunday":{"open":"","close":"","closed":true}}'::jsonb,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'services',
    sql: `CREATE TABLE IF NOT EXISTS "services" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL,
      "name" varchar(256) NOT NULL,
      "description" text,
      "duration" integer NOT NULL,
      "price" integer NOT NULL,
      "category" varchar(100),
      "image_url" varchar(256),
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'staff',
    sql: `CREATE TABLE IF NOT EXISTS "staff" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL,
      "name" varchar(256) NOT NULL,
      "email" varchar(256) UNIQUE,
      "phone" varchar(50),
      "avatar_url" varchar(256),
      "bio" text,
      "specialty" varchar(256),
      "working_hours" jsonb,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'clients',
    sql: `CREATE TABLE IF NOT EXISTS "clients" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL,
      "user_id" uuid,
      "name" varchar(256) NOT NULL,
      "email" varchar(256),
      "phone" varchar(50),
      "notes" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'bookings',
    sql: `CREATE TABLE IF NOT EXISTS "bookings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL,
      "client_id" uuid NOT NULL,
      "service_id" uuid NOT NULL,
      "staff_id" uuid,
      "start_time" timestamp NOT NULL,
      "end_time" timestamp NOT NULL,
      "status" varchar(50) DEFAULT 'pending' NOT NULL,
      "notes" text,
      "price_at_booking" integer NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'subscriptions',
    sql: `CREATE TABLE IF NOT EXISTS "subscriptions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "business_id" uuid NOT NULL,
      "package_id" uuid NOT NULL,
      "status" varchar(50) DEFAULT 'active' NOT NULL,
      "start_date" timestamp NOT NULL,
      "end_date" timestamp,
      "auto_renew" boolean DEFAULT true,
      "payment_method" varchar(100),
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'api_keys',
    sql: `CREATE TABLE IF NOT EXISTS "api_keys" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" varchar(256) NOT NULL,
      "key" varchar(512) NOT NULL,
      "provider" varchar(100) NOT NULL,
      "environment" varchar(50) DEFAULT 'development' NOT NULL,
      "is_active" boolean DEFAULT true,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'admin_settings',
    sql: `CREATE TABLE IF NOT EXISTS "admin_settings" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "setting_name" varchar(256) NOT NULL UNIQUE,
      "setting_value" text,
      "data_type" varchar(50) DEFAULT 'string',
      "description" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'admin_logs',
    sql: `CREATE TABLE IF NOT EXISTS "admin_logs" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "admin_id" uuid,
      "action" varchar(256) NOT NULL,
      "entity_type" varchar(100),
      "entity_id" uuid,
      "details" jsonb,
      "ip_address" varchar(50),
      "timestamp" timestamp DEFAULT now() NOT NULL
    );`
  },
  {
    name: 'user_roles',
    sql: `CREATE TABLE IF NOT EXISTS "user_roles" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" text NOT NULL UNIQUE,
      "role" varchar(50) DEFAULT 'business_owner' NOT NULL,
      "permissions" jsonb,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );`
  },
];

const foreignKeys = [
  'ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_business_id_businesses_id_fk";',
  'ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "subscriptions" DROP CONSTRAINT IF EXISTS "subscriptions_package_id_packages_id_fk";',
  'ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_package_id_packages_id_fk" FOREIGN KEY ("package_id") REFERENCES "public"."packages"("id") ON DELETE no action ON UPDATE no action;',
  'ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_business_id_businesses_id_fk";',
  'ALTER TABLE "bookings" ADD CONSTRAINT "bookings_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_client_id_clients_id_fk";',
  'ALTER TABLE "bookings" ADD CONSTRAINT "bookings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_service_id_services_id_fk";',
  'ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;',
  'ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_staff_id_staff_id_fk";',
  'ALTER TABLE "bookings" ADD CONSTRAINT "bookings_staff_id_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;',
  'ALTER TABLE "clients" DROP CONSTRAINT IF EXISTS "clients_business_id_businesses_id_fk";',
  'ALTER TABLE "clients" ADD CONSTRAINT "clients_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "services_business_id_businesses_id_fk";',
  'ALTER TABLE "services" ADD CONSTRAINT "services_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;',
  'ALTER TABLE "staff" DROP CONSTRAINT IF EXISTS "staff_business_id_businesses_id_fk";',
  'ALTER TABLE "staff" ADD CONSTRAINT "staff_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;',
];

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('⏳ Setting up database tables...\n');

  try {
    // Create tables
    for (const table of tablesToCreate) {
      try {
        await pool.query(table.sql);
        console.log(`✅ Table "${table.name}" created or already exists`);
      } catch (error: any) {
        console.error(`❌ Error creating table "${table.name}":`, error.message);
      }
    }

    console.log('\n⏳ Adding foreign key constraints...\n');

    // Add foreign keys
    for (const fk of foreignKeys) {
      try {
        await pool.query(fk);
      } catch (error: any) {
        // Silently handle FK errors - they might already exist
      }
    }

    console.log('✅ Foreign key constraints added!');
    console.log('\n🎉 Database setup complete!');
  } catch (error: any) {
    console.error('❌ Setup failed!');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();

