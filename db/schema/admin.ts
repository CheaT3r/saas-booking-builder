import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { businesses } from './business';

// Packages Table (Subscription Plans)
export const packages = pgTable('packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  priceMonthly: integer('price_monthly').notNull(), // in cents
  priceAnnually: integer('price_annually'), // in cents
  features: jsonb('features').$type<string[]>().default([]), // List of features included
  maxUsers: integer('max_users'),
  maxBookings: integer('max_bookings'), // e.g., per month
  apiAccess: boolean('api_access').default(false),
  customBranding: boolean('custom_branding').default(false),
  prioritySupport: boolean('priority_support').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// API Keys Table (for integrations like Stripe, SendGrid, etc.)
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  key: varchar('key', { length: 512 }).notNull(), // Encrypted API key
  provider: varchar('provider', { length: 100 }).notNull(), // e.g., 'stripe', 'sendgrid', 'sms_gateway'
  environment: varchar('environment', { length: 50 }).default('development').notNull(), // 'development', 'production'
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Admin Settings Table (Global settings for the SaaS platform)
export const adminSettings = pgTable('admin_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  settingName: varchar('setting_name', { length: 256 }).unique().notNull(),
  settingValue: text('setting_value'), // Stored as JSON string or plain text
  dataType: varchar('data_type', { length: 50 }).default('string'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Admin Logs Table
export const adminLogs = pgTable('admin_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  adminId: uuid('admin_id'), // Link to an admin user if applicable
  action: varchar('action', { length: 256 }).notNull(), // e.g., 'created_package', 'modified_business_plan'
  entityType: varchar('entity_type', { length: 100 }), // e.g., 'package', 'business', 'apiKey'
  entityId: uuid('entity_id'),
  details: jsonb('details'), // JSON object with old/new values
  ipAddress: varchar('ip_address', { length: 50 }),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// User Roles Table (for role-based access control)
// NOTE: userId is no longer unique to allow multiple roles per user (e.g., employee at multiple businesses)
export const userRoles = pgTable('user_roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Link to auth.user (better-auth uses text IDs)
  businessId: uuid('business_id'), // Only for business_employee role - links to specific business
  role: varchar('role', { length: 50 }).default('business_owner').notNull(), // 'super_admin', 'business_owner', 'business_employee'
  permissions: jsonb('permissions').$type<string[]>(), // Array of permission strings like ['view_bookings', 'manage_own_schedule']
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations - subscriptions are defined in business.ts schema
