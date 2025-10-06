# Project Requirements Document (PRD)

## 1. Project Overview

**saas-booking-builder** is a Software-as-a-Service platform that lets businesses and individuals create, customize, and manage booking workflows without writing code. Built on Next.js with React and TypeScript, it provides user authentication, a personalized dashboard, and an API-driven backend. Users can sign up, log in, and immediately begin designing calendars, forms, and booking rules that fit their specific needs.

The goal of this project is to remove the technical barrier for small to medium enterprises to offer online booking services. By combining server-side rendering (SSR), static site generation (SSG), and API routes in Next.js, the platform aims to be fast, secure, and easy to extend. Key success criteria include secure user authentication, a responsive booking builder interface, and reliable data persistence.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (MVP)
- Email/password user registration and login (sign-up, sign-in pages).
- Session management with HTTP-only cookies or JWTs via Next.js API routes.
- User dashboard with:
  - A consistent layout (sidebar, header).
  - Booking builder UI (create/edit bookings, set time slots).
  - Data persistence stub (initially `data.json`, pluggable to a real database).
- Theming and styling:
  - Global CSS (`globals.css`).
  - Dashboard-specific CSS (`theme.css`).
- Next.js App Router structure (`app/layout.tsx`, per-route layouts).
- API endpoints for authentication and booking management.
- TypeScript types and interfaces for components and API payloads.
- Basic error handling and input validation on both client and server.

### Out-of-Scope (Phase 2+)
- Third-party integrations (payment gateways, calendar sync).
- Social login or OAuth (Google, Facebook).
- Analytics and reporting dashboards.
- Multi-language or localization support.
- Mobile-native apps (iOS/Android).
- Custom domain management per tenant.
- Advanced notification system (email/SMS reminders).

## 3. User Flow

A new visitor lands on the public site and clicks **Sign Up**. They fill out the registration form with email and password. Upon submission, the frontend calls the `/api/auth/signup` endpoint. The server validates input, hashes the password, creates a user record, issues a session cookie, and redirects the user to their dashboard.

Inside the dashboard, the user sees a sidebar with navigation links (e.g., **My Bookings**, **Settings**, **Logout**) and a main content area showing an empty booking list. The user clicks **Create Booking**, fills in details (name, description, time slots), and saves. The frontend sends this data to `/api/bookings`, which stores it. The updated booking appears in the list. The user can edit or delete bookings. Logging out clears the session and redirects to the sign-in page.

## 4. Core Features

- **Authentication & Authorization**: Secure sign-up, sign-in, session management, and protected routes in the dashboard.
- **Dashboard Layout**: Persistent header/sidebar, responsive design, theming support.
- **Booking Builder UI**: Form-based interface to create/edit booking entries, configure time slots, and view a calendar preview.
- **API Routes**: Next.js backend endpoints for `/api/auth/*` and `/api/bookings/*` handling CRUD operations, validation, and error responses.
- **Data Persistence Layer**: Initial mock data in `data.json`, designed to swap with a real database (e.g., PostgreSQL + ORM).
- **Global & Themed Styling**: `globals.css` for core styles, `theme.css` under dashboard for custom theming.
- **Type Safety**: Shared TypeScript types/interfaces for API requests, database models, and React props.
- **Error Handling**: Consistent HTTP status codes, user-friendly error messages on forms, try/catch blocks in API routes.

## 5. Tech Stack & Tools

- **Frontend Framework**: Next.js (App Router) + React + TypeScript.
- **Backend/API**: Next.js API routes (`app/api/.../route.ts`).
- **Styling**: CSS (global and module-level), with scope for future Tailwind or CSS-in-JS.
- **Database (Future)**: PostgreSQL or MySQL with Prisma ORM, or MongoDB with Mongoose.
- **Authentication Library**: Custom JWT + bcrypt OR NextAuth.js (extensible).
- **State & Data Fetching**: React hooks with `fetch`, optional React Query for caching.
- **Developer Tools**: VS Code, ESLint, Prettier, TypeScript extensions.
- **Deployment**: Vercel (Next.js optimized) or any Node.js hosting.

## 6. Non-Functional Requirements

- **Performance**: 
  - First Contentful Paint (FCP) under 1s for dashboard.
  - API endpoints should respond within 200ms under normal load.
- **Security**:
  - HTTPS everywhere, secure cookies (HttpOnly, SameSite).
  - CSRF protection for state-changing endpoints.
  - Passwords hashed with bcrypt (or Argon2).
  - Input validation/sanitization to prevent injection.
- **Scalability**: Code organized for easy horizontal scaling (stateless APIs, CDN for static assets).
- **Usability & Accessibility**:
  - WCAG 2.1 AA compliance (semantic HTML, keyboard navigation).
  - Responsive layout for desktop/tablet/mobile.
- **Compliance**: GDPR-ready (user data export/deletion endpoints planned).

## 7. Constraints & Assumptions

- **Next.js Version**: Must use v13+ App Router.
- **Environment Variables**: Required for database URL, JWT secret, cookie settings.
- **Mock Data**: Using `data.json` until a real DB is connected. Assumes a future migration strategy.
- **Single-Tenant MVP**: No multi-domain or strict tenant isolation beyond user IDs.
- **No AI Integration**: Out of scope for MVP; future phases may add AI-based scheduling suggestions.

## 8. Known Issues & Potential Pitfalls

- **JSON vs. Database**: Relying on `data.json` can lead to data loss or concurrency issues. Mitigation: plan an early switch to a real database with migration scripts.
- **Time Zone Handling**: Without standardization, users in different time zones may see incorrect slot times. Mitigation: store times in UTC, localize on the client.
- **API Rate Limits**: Public endpoints may be abused. Mitigation: add rate limiting (e.g., `express-rate-limit`) or Vercel Edge rules.
- **Session Invalidation**: JWT-based sessions require careful revocation. Mitigation: use rotating refresh tokens or a server-side session store.
- **Styling Collisions**: Global CSS might conflict. Mitigation: adopt CSS modules or a CSS-in-JS solution in later phases.
- **Error Feedback**: Generic error messages can confuse users. Mitigation: implement clear, field-level validation and error summaries.


*This document serves as the single source of truth for the AI model and development team to build, test, and evolve the saas-booking-builder platform without ambiguity.*