# saas-booking-builder App Flow Document

## Onboarding and Sign-In/Sign-Up

When a new user first navigates to the saas-booking-builder URL, they land on the public sign-in page. The header and footer are provided by the root layout, which applies global styles and the main site navigation. If the user does not have an account yet, they click the "Sign Up" link on this page. The sign-up process asks for a valid email address and a secure password. After filling in the form and submitting it, the app sends a request to the `/api/auth` endpoint. If registration succeeds, the new user is automatically authenticated and redirected to their dashboard. If an error occurs, such as an already registered email or weak password, a clear message appears above the form fields.

Returning users use the same sign-in page to enter their credentials. When they submit the sign-in form, the app verifies their email and password through the `/api/auth` API route. A successful login sets a secure, HTTP-only session cookie and then routes the user to the dashboard. If the credentials are invalid, an inline error message explains whether the email is unknown or the password is incorrect. Currently, password recovery is not implemented, so a user without access to their password will need to contact support for help.

Once signed in, the navigation bar at the top includes a profile icon. Clicking this icon reveals a "Sign Out" button. When the user selects "Sign Out," the session cookie is cleared by an API call, and the user is sent back to the sign-in page.

## Main Dashboard or Home Page

After signing in, the user lands on the dashboard home page, which is wrapped by the dashboard layout. This layout adds a themed sidebar on the left and a header bar at the top. The sidebar lists main sections such as "My Bookings," "Create New Workflow," and "Settings." The header displays the application logo, a search field, and the profile icon on the right.

The central area of the dashboard home page shows a welcome message and a summary panel that can display quick stats or recent activity once connected to real data. Initially, it pulls mock booking data from `dashboard/data.json` until a database is integrated. The theme stylesheet for the dashboard ensures consistent colors and spacing for all widgets and tables.

Navigation between pages is straightforward. Clicking "My Bookings" refreshes the center area to list existing workflows. Choosing "Create New Workflow" takes the user to the booking builder interface within the dashboard layout. Selecting "Settings" opens the account management section in the same sidebar context. The user always sees the sidebar and header so they can move between these main areas at any time.

## Detailed Feature Flows and Page Transitions

### Creating a New Booking Workflow

When the user clicks "Create New Workflow" in the sidebar, the dashboard layout remains in place and the content area transitions to a step-by-step builder. In the first step, the user chooses a template or starts from scratch. They click "Next" to configure time slots, service types, and availability rules. Each step is rendered as a React component in TypeScript and behind the scenes it may send interim save requests to an API route like `/api/bookings`. After reviewing a live preview, the user clicks "Publish," which finalizes the workflow and triggers a POST request to the booking management endpoint.

### Managing Existing Booking Workflows

From the "My Bookings" section, the user sees a list of active and draft workflows. Each workflow row includes an "Edit" button that routes to an edit page under the same dashboard route, so the sidebar and header stay visible. On that page, the user updates details and clicks "Save Changes," sending a PUT request to `/api/bookings/{id}`. There is also a "Delete" button that asks for confirmation; if confirmed, a DELETE request removes the workflow and the list refreshes.

### Profile Editing and Sign-Out

Clicking the profile icon in the header opens a dropdown where the user selects "Account Settings." This navigates to a settings page where personal details such as name, email, and password can be updated. Submitting changes sends data to `/api/users/update`. After a successful update, a brief success banner appears and the user can click the logo or "Dashboard Home" link to return to the main dashboard. The sign-out action in this dropdown immediately clears the session and redirects to the sign-in page.

## Settings and Account Management

The Settings section lives within the dashboard layout and replaces the main content area when selected. It is divided into tabs for "Profile," "Notifications," and "Billing." On the Profile tab, the user can change their name and password. The Notifications tab lets the user toggle email or SMS alerts for booking events. Any change triggers a PATCH request to an endpoint under `/api/users/settings`. If the user has subscription features enabled, the Billing tab shows their current plan, next billing date, and a button to upgrade or cancel. That button opens a secure payment form powered by a third-party gateway and communicates with a `/api/billing` route. After adjusting settings, the user clicks "Save" and sees confirmation before navigating away.

Returning to the dashboard from Settings is as simple as clicking the "Dashboard Home" link in the sidebar or the logo in the header. The user always retains the same navigation frame.

## Error States and Alternate Paths

If a user submits a form with invalid data or misses a required field, a red inline error message appears under the relevant input. In the event of a network failure during an API call, a banner appears at the top of the content area explaining that the action could not be completed and offering a retry button. If the user tries to access the dashboard while not authenticated, the root layout automatically redirects them to the sign-in page.

For any undefined route under the app, Next.js serves a default 404 page styled with global CSS. If the API returns a server error, such as a 500 status, the frontend displays a generic error screen with an apology and a link to retry or return to the dashboard home.

## Conclusion and Overall App Journey

A new user begins by visiting the public sign-in page and choosing to register. After creating an account, they arrive at their personalized dashboard where they can build, manage, and review booking workflows. From the dashboard, they seamlessly navigate between creating workflows, editing existing ones, and updating account settings. Every action communicates with the backend through Next.js API routes, handling errors gracefully and guiding the user back on track. Signing out is a single click away in the profile dropdown. Throughout the experience, consistent layouts and styling ensure the user always knows where they are and how to move forward, from initial sign-up to everyday booking management.