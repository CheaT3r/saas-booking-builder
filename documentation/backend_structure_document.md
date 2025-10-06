# Backend Structure Document: saas-booking-builder

This document explains how the backend of the saas-booking-builder application is set up. It covers the overall design, the database, the APIs, hosting, security, and more, using plain language so that anyone can understand it.

---

## 1. Backend Architecture

**Overview**
- The backend is built using Next.js, which combines server-side rendering, client-side pages, and API routes in one framework.
- Under the hood, it runs on Node.js and TypeScript, giving us a modern JavaScript environment with extra safety checks.

**Design Patterns and Structure**
- We follow a layered approach:
  - **Routes:** Endpoints defined under `app/api/` that handle incoming HTTP requests.
  - **Controllers/Services:** Functions that process requests, apply business logic, and talk to the database.
  - **ORM Layer:** Prisma is used to map our database tables to JavaScript objects and simplify queries.

**Scalability, Maintainability, Performance**
- **Serverless or Containerized Functions:** Each API route can scale independently as demand grows.
- **Modular Code:** Splitting routes, services, and data access into separate files makes it easy to add new features or fix bugs.
- **Caching and Edge Rendering:** We use built-in Next.js caching and edge functions (on Vercel or equivalent) for faster responses.

---

## 2. Database Management

**Technology Used**
- Database type: Relational (SQL).
- Specific system: PostgreSQL.
- ORM: Prisma for schema management, migrations, and type-safe queries.

**Data Handling Practices**
- **Connection Pooling:** We use a limited number of database connections to avoid overload.
- **Migrating & Seeding:** All schema changes go through versioned migrations. Initial or test data is loaded with seed scripts.
- **Environment Variables:** Database URL and credentials are kept in environment variables, not in code.

---

## 3. Database Schema

Below is a simple overview of our main tables and how they are structured. Each user can have multiple bookings, and multi-tenant support is built in via a `Tenant` table.

**Human-Readable Table Descriptions**

- **Tenants**: Represents a customer organization or account. Fields:
  - `id` (unique identifier)
  - `name` (company or account name)
  - `created_at` (timestamp)

- **Users**: Represents individuals who sign up and log in. Fields:
  - `id` (unique identifier)
  - `tenant_id` (links to the tenant they belong to)
  - `email` (login address)
  - `password_hash` (secure password storage)
  - `role` (e.g., "admin" or "user")
  - `created_at` (timestamp)

- **Bookings**: Represents booking records created by users. Fields:
  - `id` (unique identifier)
  - `user_id` (who created the booking)
  - `title` (short description)
  - `start_time` (date and time)
  - `end_time` (date and time)
  - `details` (optional notes)
  - `created_at` (timestamp)

**SQL Schema (PostgreSQL)**

```sql
-- Tenants table
CREATE TABLE tenants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```  

---

## 4. API Design and Endpoints

We use RESTful API routes under `app/api/`. Each route handles JSON requests and responses.

**Authentication Endpoints**
- POST `/api/auth/signup`  : Create a new user account (requires email and password).  
- POST `/api/auth/signin`  : Log in (returns a secure token or cookie).  
- POST `/api/auth/signout` : End the user session.

**User & Session Endpoints**
- GET `/api/auth/me`       : Get the current user’s profile.
- PUT `/api/auth/password` : Change password (authenticated).

**Booking Endpoints**
- GET `/api/bookings`          : List all bookings for logged-in user.  
- POST `/api/bookings`         : Create a new booking.  
- GET `/api/bookings/[id]`     : Get details of a single booking.  
- PUT `/api/bookings/[id]`     : Update an existing booking.  
- DELETE `/api/bookings/[id]`  : Remove a booking.

**How It Works**
- Frontend pages send HTTP requests to these endpoints.  
- Each endpoint calls a service that:  
  1. Validates input.  
  2. Checks authentication/authorization.  
  3. Uses Prisma to query or update the database.  
  4. Returns JSON with success or error details.

---

## 5. Hosting Solutions

**Primary Hosting**
- **Vercel** (recommended for Next.js):
  - Automatically deploys on each code push.  
  - Provides global edge network for fast content delivery.  
  - Scales serverless functions on demand.

**Database Hosting**
- **AWS RDS for PostgreSQL**:
  - Managed backups, updates, and high availability.  
  - Read replicas can be added for scaling reads.

**Why This Setup?**
- **Reliability:** Cloud providers handle hardware failures and network issues.  
- **Scalability:** We only pay for what we use, and capacity can grow automatically.  
- **Cost-effectiveness:** No need to buy or maintain physical servers.

---

## 6. Infrastructure Components

- **Load Balancer / Edge Network:** Vercel’s edge functions automatically distribute traffic to the nearest region.
- **Caching:**  
  - Built-in Next.js ISR (Incremental Static Regeneration) for public pages.  
  - Redis (optional) for session or query caching if needed.
- **Content Delivery Network (CDN):** Static assets and images are served from global caches.
- **Logging & Metrics:**  
  - Vercel Analytics or third-party (Datadog, New Relic) for request performance.  
  - Application logs (Winston or built-in) stored centrally.

---

## 7. Security Measures

**Authentication & Authorization**
- Passwords are hashed with bcrypt before saving.  
- Sessions use JWTs stored in HTTP-only cookies to prevent client-side tampering.  
- Role-based checks protect sensitive routes (e.g., only admins can invite new tenants).

**Data Protection**
- All traffic is over HTTPS by default.  
- Environment variables keep secrets (DB credentials, API keys) out of code.  
- Database encryption at rest and in transit (standard on RDS).

**Best Practices**
- Input validation on every endpoint to prevent injection attacks.  
- Rate limiting on auth endpoints to block brute-force attempts.  
- Regular dependency updates and security audits.

---

## 8. Monitoring and Maintenance

**Monitoring Tools**
- **Uptime & Latency:** Vercel Insights, or external services like Pingdom.  
- **Error Tracking:** Sentry or similar to catch exceptions in API routes and pages.  
- **Metrics:** Grafana/Prometheus or cloud-native dashboards for CPU, memory, and DB stats.

**Maintenance Practices**
- Automated daily backups of the database.  
- Scheduled security patching for dependencies.  
- Versioned database migrations to evolve schema safely.  
- Routine cleanup of old logs and temporary data.

---

## 9. Conclusion and Overall Backend Summary

The saas-booking-builder backend is a modern, full-stack setup using Next.js, PostgreSQL, and Prisma. It follows best practices for:
- **Scalability:** Serverless functions and managed databases grow with usage.
- **Maintainability:** A clear separation of routes, services, and data access keeps code organized.
- **Performance:** CDN edge delivery, caching, and fast database queries.
- **Security:** Strong password handling, HTTPS, and role-based access.

This architecture ensures that the application can handle many users over time, stay secure, and remain easy to maintain. It provides a solid foundation for a multi-tenant booking SaaS and can be extended with features like payment gateways, external notifications, and advanced analytics.