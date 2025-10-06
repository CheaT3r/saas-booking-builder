# SaaS Booking Platform Backend

A multi-tenant SaaS booking platform backend built with NestJS and PostgreSQL.

## Features

- **Multi-tenant architecture** with automatic subdomain routing
- **JWT-based authentication** with role-based access control
- **Booking system** with availability management
- **Service management** with pricing and duration
- **Staff management** with schedules and specializations
- **Tenant management** with automatic provisioning
- **Payment integration** ready (Stripe)

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: Class-validator & Class-transformer
- **Deployment**: Railway ready

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Configure your database connection in `.env`.

4. Run in development:
```bash
npm run start:dev
```

## API Endpoints

### Authentication
- `POST /auth/register-tenant` - Register new tenant
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile

### Tenants
- `GET /tenants` - List all tenants (Super Admin)
- `GET /tenants/:id` - Get tenant by ID
- `PATCH /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Deactivate tenant

### Services
- `GET /services` - List services
- `POST /services` - Create service
- `GET /services/:id` - Get service by ID
- `PATCH /services/:id` - Update service
- `DELETE /services/:id` - Deactivate service

### Staff
- `GET /staff` - List staff members
- `POST /staff` - Create staff member
- `GET /staff/:id` - Get staff member by ID
- `PATCH /staff/:id` - Update staff member
- `DELETE /staff/:id` - Deactivate staff member

### Bookings
- `GET /bookings` - List bookings with filters
- `POST /bookings` - Create booking
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id` - Update booking
- `DELETE /bookings/:id` - Cancel booking
- `GET /bookings/available-slots/:serviceId/:staffId/:date` - Get available time slots
- `POST /bookings/cancel/:token` - Cancel booking by token

## Database Schema

### Core Entities
- **Tenant**: Business information and settings
- **User**: Authentication and role management
- **Service**: Services offered by the business
- **Staff**: Staff members and their schedules
- **Booking**: Appointment reservations

## Multi-Tenant Architecture

The platform uses subdomain-based multi-tenancy:
- Each business gets a unique subdomain (e.g., `business.platform.com`)
- All data is isolated by tenant ID
- Middleware automatically extracts tenant from subdomain
- All queries are scoped to the current tenant

## Deployment on Railway

1. Push your code to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy

Environment Variables needed:
```
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3001
```

## Security Features

- Password hashing with bcrypt
- JWT tokens with expiration
- Role-based access control
- Tenant data isolation
- Input validation and sanitization
- CORS configuration