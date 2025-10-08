import 'dotenv/config';
import { Pool } from 'pg';

async function main() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🔧 Fixing table schemas...\n');

  try {
    // Drop tables in correct order (respect foreign keys)
    console.log('🗑️  Dropping existing tables...');
    await pool.query(`
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS clients CASCADE;
      DROP TABLE IF EXISTS services CASCADE;
      DROP TABLE IF EXISTS staff CASCADE;
      DROP TABLE IF EXISTS subscriptions CASCADE;
      DROP TABLE IF EXISTS businesses CASCADE;
      DROP TABLE IF EXISTS user_roles CASCADE;
    `);
    console.log('✅ Tables dropped!\n');

    // Recreate with correct schema
    console.log('📦 Recreating tables with correct schema...');
    
    await pool.query(`
      CREATE TABLE businesses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        owner_id text NOT NULL,
        name varchar(256) NOT NULL,
        slug varchar(256) NOT NULL UNIQUE,
        tagline varchar(256),
        description text,
        logo_url varchar(256),
        cover_image_url varchar(256),
        address varchar(256),
        phone varchar(50),
        email varchar(256),
        website varchar(256),
        primary_color varchar(7) DEFAULT '#3b82f6',
        accent_color varchar(7) DEFAULT '#8b5cf6',
        working_hours jsonb DEFAULT '{"monday":{"open":"09:00","close":"18:00","closed":false},"tuesday":{"open":"09:00","close":"18:00","closed":false},"wednesday":{"open":"09:00","close":"18:00","closed":false},"thursday":{"open":"09:00","close":"18:00","closed":false},"friday":{"open":"09:00","close":"18:00","closed":false},"saturday":{"open":"10:00","close":"16:00","closed":false},"sunday":{"open":"","close":"","closed":true}}'::jsonb,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE services (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name varchar(256) NOT NULL,
        description text,
        duration integer NOT NULL,
        price integer NOT NULL,
        category varchar(100),
        image_url varchar(256),
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE staff (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        name varchar(256) NOT NULL,
        email varchar(256) UNIQUE,
        phone varchar(50),
        avatar_url varchar(256),
        bio text,
        specialty varchar(256),
        working_hours jsonb,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE clients (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        user_id uuid,
        name varchar(256) NOT NULL,
        email varchar(256),
        phone varchar(50),
        notes text,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
        service_id uuid NOT NULL REFERENCES services(id),
        staff_id uuid REFERENCES staff(id),
        start_time timestamp NOT NULL,
        end_time timestamp NOT NULL,
        status varchar(50) DEFAULT 'pending' NOT NULL,
        notes text,
        price_at_booking integer NOT NULL,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE subscriptions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
        package_id uuid NOT NULL REFERENCES packages(id),
        status varchar(50) DEFAULT 'active' NOT NULL,
        start_date timestamp NOT NULL,
        end_date timestamp,
        auto_renew boolean DEFAULT true,
        payment_method varchar(100),
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );

      CREATE TABLE user_roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        user_id text NOT NULL UNIQUE,
        role varchar(50) DEFAULT 'business_owner' NOT NULL,
        permissions jsonb,
        created_at timestamp DEFAULT now() NOT NULL,
        updated_at timestamp DEFAULT now() NOT NULL
      );
    `);

    console.log('✅ Tables recreated!\n');
    console.log('🎉 Schema fix complete!');
  } catch (error: any) {
    console.error('❌ Fix failed!');
    console.error(error.message);
  } finally {
    await pool.end();
  }
}

main();



