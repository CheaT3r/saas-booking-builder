import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Businesses Table (Tenants)
export const businesses = pgTable('businesses', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: text('owner_id').notNull(), // Link to auth.users (better-auth uses text IDs)
  name: varchar('name', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(), // For public booking page URL
  tagline: varchar('tagline', { length: 256 }),
  description: text('description'),
  logoUrl: varchar('logo_url', { length: 256 }),
  coverImageUrl: varchar('cover_image_url', { length: 256 }),
  address: varchar('address', { length: 256 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 256 }),
  website: varchar('website', { length: 256 }),
  primaryColor: varchar('primary_color', { length: 7 }).default('#3b82f6'), // Tailwind blue-500
  accentColor: varchar('accent_color', { length: 7 }).default('#8b5cf6'), // Tailwind purple-500
  workingHours: jsonb('working_hours').$type<{
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  }>().default({
    monday: { open: "09:00", close: "18:00", closed: false },
    tuesday: { open: "09:00", close: "18:00", closed: false },
    wednesday: { open: "09:00", close: "18:00", closed: false },
    thursday: { open: "09:00", close: "18:00", closed: false },
    friday: { open: "09:00", close: "18:00", closed: false },
    saturday: { open: "10:00", close: "16:00", closed: false },
    sunday: { open: "", close: "", closed: true },
  }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Services Table
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
  duration: integer('duration').notNull(), // in minutes
  price: integer('price').notNull(), // in cents
  category: varchar('category', { length: 100 }),
  imageUrl: varchar('image_url', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Staff Table
export const staff = pgTable('staff', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  userId: text('user_id'), // Link to auth.user - when staff member has platform account with business_employee role
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).unique(),
  phone: varchar('phone', { length: 50 }),
  avatarUrl: varchar('avatar_url', { length: 256 }),
  bio: text('bio'),
  specialty: varchar('specialty', { length: 256 }),
  workingHours: jsonb('working_hours').$type<{
    monday: { start: string; end: string; off: boolean };
    tuesday: { start: string; end: string; off: boolean };
    wednesday: { start: string; end: string; off: boolean };
    thursday: { start: string; end: string; off: boolean };
    friday: { start: string; end: string; off: boolean };
    saturday: { start: string; end: string; off: boolean };
    sunday: { start: string; end: string; off: boolean };
  }>(), // Can be overridden per staff
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Clients Table
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  userId: uuid('user_id'), // Optional: if client is also a platform user
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }),
  phone: varchar('phone', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Bookings Table
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').notNull().references(() => services.id),
  staffId: uuid('staff_id').references(() => staff.id), // Optional: if a specific staff is chosen
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'confirmed', 'cancelled', 'completed'
  notes: text('notes'),
  priceAtBooking: integer('price_at_booking').notNull(), // Price at the time of booking
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subscriptions Table
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessId: uuid('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  packageId: uuid('package_id'), // References packages from admin schema
  status: varchar('status', { length: 50 }).default('active').notNull(), // 'active', 'cancelled', 'expired', 'trial'
  billingCycle: varchar('billing_cycle', { length: 50 }).default('monthly').notNull(), // 'monthly', 'annually'
  amount: integer('amount').notNull(), // in cents
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'), // Null for active subscriptions, set when cancelled/expired
  nextBillingDate: timestamp('next_billing_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const businessesRelations = relations(businesses, ({ many }) => ({
  services: many(services),
  staff: many(staff),
  clients: many(clients),
  bookings: many(bookings),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  business: one(businesses, {
    fields: [services.businessId],
    references: [businesses.id],
  }),
  bookings: many(bookings),
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  business: one(businesses, {
    fields: [staff.businessId],
    references: [businesses.id],
  }),
  bookings: many(bookings),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  business: one(businesses, {
    fields: [clients.businessId],
    references: [businesses.id],
  }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  business: one(businesses, {
    fields: [bookings.businessId],
    references: [businesses.id],
  }),
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  service: one(services, {
    fields: [bookings.serviceId],
    references: [services.id],
  }),
  staff: one(staff, {
    fields: [bookings.staffId],
    references: [staff.id],
  }),
}));
