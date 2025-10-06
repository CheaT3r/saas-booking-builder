# Frontend Guidelines for saas-booking-builder

This document outlines the frontend setup for the **saas-booking-builder** project. It covers architecture, design rules, styling, state management, routing, performance, testing, and more. Anyone reading this—regardless of technical background—should understand how our frontend works and why it’s organized this way.

## 1. Frontend Architecture

**What we use:**
- **Next.js (App Router)** for combining server‐side rendering (SSR), static site generation (SSG), and API routes in one framework.  
- **React with TypeScript** for building UI components with strong typing and better error checking.
- **CSS** with a mix of global styles and component-level styles (via CSS modules or BEM methodology).

**How it fits together:**
1. The **`app/`** folder in Next.js drives routing and layouts:  
   - `app/layout.tsx` wraps every page with shared headers, footers, and global CSS.  
   - Sub‐folders (e.g., `sign-in`, `dashboard`) each have their own `page.tsx` and optional `layout.tsx` to apply specific layouts or themes.  
2. **API routes** live under `app/api/` to handle authentication and data operations.  

**Supports:**
- **Scalability:** Modular pages and API routes let us extend features (new pages, new endpoints) without tangled code.  
- **Maintainability:** TypeScript types and consistent file structure make onboarding and refactoring straightforward.  
- **Performance:** Built-in Next.js optimizations (SSR, SSG, image optimizations) plus code splitting keep load times low.

---

## 2. Design Principles

1. **Usability**  
   - Simple, clear navigation and forms with concise labels and helpful error messages.  
   - Primary actions (e.g., "Sign Up", "Create Booking") are easy to spot.
2. **Accessibility**  
   - Use semantic HTML (`<button>`, `<nav>`, `<header>`).  
   - Ensure sufficient color contrast and keyboard navigability.  
   - Add ARIA labels where needed (e.g., custom controls).
3. **Responsiveness**  
   - Layouts adapt fluidly from mobile screens to desktop.  
   - Use CSS flexbox or grid and relative units (%, rem) for flexible sizing.
4. **Consistency**  
   - Uniform spacing, typography, and color across all pages.  
   - Common components (buttons, inputs) share the same style rules.

These principles guide every UI decision: from form placement on the sign-up page to the structure of the dashboard.

---

## 3. Styling and Theming

### 3.1 Styling Approach
- **Global CSS (`globals.css`):** Base rules for typography, body background, anchor styles.  
- **Component-level styles:** Either CSS modules (`Component.module.css`) or BEM naming in plain `.css` files to avoid class-name clashes.
- **Methodology:** BEM (Block__Element--Modifier) makes it easy to see relationships between elements and overrides.

### 3.2 Theming
- **Default theme:** Light mode with the color palette below.  
- **Dashboard overrides:** `theme.css` in `/dashboard/` applies custom header colors, sidebar backgrounds, and card styles.  
- Future work: support a dark mode by extending the CSS variables.

### 3.3 Visual Style
- **Modern flat design** with soft shadows and rounded corners (border-radius: 4px).  
- Clean, minimal look—no heavy gradients or skeuomorphic details.

### 3.4 Color Palette
| Name            | Purpose            | Hex     |
| --------------- | ------------------ | ------- |
| Primary Blue    | Buttons, Links     | #4F46E5 |
| Secondary Gray  | Text secondary     | #6B7280 |
| Accent Green    | Success states     | #10B981 |
| Background      | App background     | #F9FAFB |
| Text Primary    | Main text          | #111827 |
| Danger Red      | Errors, Warnings   | #EF4444 |

### 3.5 Typography
- **Font Family:** “Inter”, system-ui, sans-serif.  
- **Base font-size:** 16px (1rem).  
- **Line-height:** 1.5 for body text, 1.2 for headings.

---

## 4. Component Structure

1. **`/components/` directory** holds shared, reusable UI pieces (e.g., `Button`, `Input`, `Card`, `NavBar`).  
2. **Atomic approach:**
   - **Atoms:** Basic elements (buttons, inputs).  
   - **Molecules:** Combinations of atoms (form group, card header).  
   - **Organisms:** Sections of UI (dashboard toolbar, booking list).  
3. **Why component-based?**  
   - Encourages reuse, reducing duplication.  
   - Simplifies testing by isolating units.  
   - Speeds up new feature development by composing existing pieces.

---

## 5. State Management

**Client vs. Server state:**
- **Server state (data from API):** Use **React Query** (or SWR) to fetch, cache, and sync data from `/api` routes.  
- **Client state (UI state):**  
  - Local component state with `useState` for simple toggles and forms.  
  - **Context API** for global UI concerns (e.g., user session, theme settings).

**Benefits:**
- React Query avoids manual loading and error handling boilerplate, keeps data fresh.  
- Context API shares data (like current user) without prop drilling.  

---

## 6. Routing and Navigation

- **File-system routing:** Next.js automatically maps files under `app/` to URLs.  
- **Layouts:**  
  - `app/layout.tsx` wraps all pages with global header/navigation/footer.  
  - Nested `layout.tsx` (e.g., under `dashboard/`) defines sub-navigation and sidebars.
- **Link component:** Use `next/link` to navigate without full page reloads.  
- **Protected routes:** Wrap dashboard pages in an authentication check. If the user isn’t signed in, redirect to `/sign-in`.

---

## 7. Performance Optimization

1. **Code Splitting & Lazy Loading**  
   - Next.js splits each page into its own bundle.  
   - Use `next/dynamic` for heavy components (e.g., calendar) to load on demand.
2. **Image Optimization**  
   - Use `next/image` for automatic resizing and WebP support.  
   - Store images in `/public/` and reference them with the Image component.
3. **Static Generation**  
   - Use `getStaticProps` or `app` folder’s `generateStaticParams` for pages that don’t change often.  
4. **Caching**  
   - Leverage `Cache-Control` headers on API responses and static assets.  
5. **Minification & Tree Shaking** (built into Next.js) to reduce bundle sizes.

---

## 8. Testing and Quality Assurance

1. **Unit Tests**  
   - **Jest + React Testing Library** for isolated component tests.  
   - Test props, rendering, and user events (e.g., clicking a button).
2. **Integration Tests**  
   - Test component interactions with mocked API calls.  
   - Verify that form submission triggers the correct API route.
3. **End-to-End (E2E) Tests**  
   - **Cypress** or **Playwright** to simulate user flows: sign‐up → sign‐in → dashboard workflows.
4. **Linters & Formatters**  
   - **ESLint** with the Next.js config for code style and error detection.  
   - **Prettier** to enforce consistent formatting.  
5. **Accessibility Checks**  
   - Automated checks with **axe** or **jest-axe**.  
   - Manual keyboard and screen reader testing.

---

## 9. Conclusion and Overall Frontend Summary

The **saas-booking-builder** frontend leverages Next.js and React with TypeScript for a fast, scalable, and maintainable codebase. We adopt clear design principles—usability, accessibility, responsiveness, consistency—and back them up with a modern flat style and a well-defined color palette. Component-based architecture, coupled with React Query and Context API, keeps state management clear and efficient. Next.js routing, performance optimizations, and a comprehensive testing setup ensure we deliver a reliable, user-friendly experience.

By following these guidelines, the team can build new features, onboard new developers, and maintain high quality as the SaaS grows. If you have questions or suggestions, please share them in our code review or developer Slack channel.