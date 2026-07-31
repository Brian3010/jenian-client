# Jenian Client

The Next.js frontend for **Jenian**, a workplace productivity application covering shift management, pay estimation, and structured end-of-day reporting.

- **Live application:** https://jenian-client.vercel.app
- **Backend repository:** `<PLACEHOLDER: link to the ASP.NET Core backend repository>`
- This repository contains **only the frontend**. The ASP.NET Core API, database, payroll rules, and infrastructure live in the backend repository above.

## Overview

Jenian was built to help retail/warehouse shift workers track their pay cycles, log shifts, estimate gross pay, and submit structured night-shift reports that are forwarded to a Telegram bot. It is also a full-stack portfolio project demonstrating a Next.js App Router frontend backed by an ASP.NET Core API.

## Live Demo

The application is deployed at https://jenian-client.vercel.app.

Use the "Try demo account" option on the sign-in page to explore the app without creating an account.

## Screenshots

<!-- TODO: Add screenshots of the dashboard, shift calculator, night report form, and mobile layout. No screenshots currently exist in this repository. -->

## Features

- Email/password sign-in and invite-gated registration (requires a secret token issued by the backend), plus a one-click demo account
- Session-protected private routes (dashboard, shift calculator, night report, settings)
- Dashboard with a Telegram integration status card and a shift calculator summary card
- Pay-cycle setup flow for first-time users
- Shift creation, editing, and deletion in an interactive calculator
- Duplicating a shift to the next day
- Bulk saving of shift changes (new, edited, and deleted shifts) in a single request
- Backend-calculated estimated gross pay and daily pay summaries, refreshed after saving
- Multi-step, end-of-day ("night report") form with section-by-section validation
- Report draft auto-saved to `localStorage` and restored on reload
- Delivery screenshot upload (multiple files) or manual delivery entry
- Telegram account linking with a generated link token
- Backend cold-start detection with a wake-up/loading screen and retry option
- Responsive layout with a collapsible sidebar on desktop and a bottom navigation bar on mobile

## Tech Stack

Based on `package.json`:

- **Next.js** (App Router) `^16.2.9`
- **React** `^19.2.7`
- **TypeScript** `^5`
- **Tailwind CSS** `^4`
- **shadcn/ui** conventions on top of **Radix UI** primitives (`radix-ui`, `@radix-ui/react-*`), configured via `components.json`
- **React Hook Form** `^7.69.0` with `@hookform/resolvers`
- **Zod** `^4.2.1` for schema validation
- **Lucide React** for icons
- **jose** for JWT verification of the session cookie
- **Luxon** for date/time handling
- Deployed on **Vercel**

## Frontend Architecture

The app uses the Next.js App Router with route groups to separate public and authenticated areas, and organizes business logic by feature (domain) rather than by page.

```
app/
  (public)/          # Sign-in, register, demo account, refresh — unauthenticated
  (private)/         # Dashboard, shift calculator, night report, settings — session required
  api/                # Route Handlers acting as the backend-for-frontend layer
    auth/              # login, register, refresh, logout, clear-session
    private/           # shift bulks, pay-cycle setup, eod-report, telegram link-token
    demo-account/      # demo login setup
    health/            # backend wake/health check
  layout.tsx, error.tsx, global-error.tsx, loading.tsx

components/
  ui/                 # shadcn/ui-style primitives (button, card, dialog, sidebar, ...)
  layout/             # AppSidebar, NavBottomBar, Header-related layout components
  errors/             # RouteErrorFallback used by error boundaries
  providers/          # Notification context/toaster
  BackendHealthWakeGate.tsx, BackendHealthCheckGate.tsx

features/
  auth/               # schemas, client/server services, context, components
  shift/               # pay-cycle + shift calculator: reducer, schemas, services, components
  cwh/                 # end-of-day report: schemas, constants, services, components
  telegram/            # Telegram linking: services, components
  weather/             # date/weather display

hooks/                # useMobile, useCopyToClipboard
lib/
  api/                 # client-api / server-api response parsing, error types
  auth/                 # session.ts (JWT verification), aspnet.ts (backend fetch), cookie-headers.ts
  utils/, AppError.ts

proxy.ts               # Edge middleware: route protection and public/private path rules
```

Route pages under `(private)` and `(public)` are Server Components by default (e.g. `dashboard/page.tsx`, `shift-calculator/page.tsx` call `requireSession` and fetch initial data on the server). Interactive pieces — forms, the shift calculator, the report wizard — are Client Components (`'use client'`) inside `features/*/components`. Server-only code (session verification, backend fetch helpers) is marked with the `server-only` package.

## Backend-for-Frontend Pattern

The frontend never calls the ASP.NET Core API directly from the browser. Instead:

```
Browser / Client Component
  → Next.js Route Handler (app/api/**)
  → ASP.NET Core API (BACKEND_URL)
  → Next.js Route Handler response
  → UI update
```

Route Handlers under `app/api/` (e.g. `auth/login`, `auth/refresh`, `private/shift/bulks`, `private/cwh/eod-report`) forward requests to the backend, read/attach cookies, and return a normalized response. Server-side calls to the backend (`lib/auth/aspnet.ts`) also attach the access token as an `Authorization: Bearer` header and transparently refresh it on a 401 before retrying once. This pattern is used because, based on the implementation:

- Cookie forwarding is centralized: Route Handlers read the incoming cookie header and re-append the backend's `Set-Cookie` headers on the response (see `login/route.ts`, `refresh/route.ts`).
- The backend base URL (`BACKEND_URL`) is only referenced in server-side code, so it never needs to be sent to the browser.
- API responses are normalized into a consistent `ApiResponse`/`ServerResult` shape (`lib/api/api-types.ts`, `lib/api/server-api.ts`, `lib/api/client-api.ts`) before reaching client code.
- Browser code only ever calls same-origin `/api/...` routes, not the ASP.NET Core API host directly.

## Authentication and Session Flow

- **Sign-in** (`app/(public)/auth/sign-in`) posts credentials to `/api/auth/login`, which forwards them to the ASP.NET Core `/api/Auth/login` endpoint and relays its `Set-Cookie` headers back to the browser.
- Sessions rely on three cookies read on the Next.js server: `accessToken` and `refreshToken`, set by the backend's `Set-Cookie` response, and `deviceId`, which is generated by the `/api/auth/login` Route Handler itself (`crypto.randomUUID()`) and reused on subsequent logins (`lib/auth/session.ts`, `proxy.ts`).
- **`accessToken`** is a JWT verified server-side with `jose` using `JWT_SECRET`, `JWT_ISSUER`, and `JWT_AUDIENCE` (`lib/auth/session.ts`). Verification is cached per request with React's `cache()`.
- **Protected pages** call `requireSession(returnTo)` in their Server Component, which redirects to `/refresh?returnTo=...` if the access token is missing/expired, or clears cookies and redirects to sign-in if the token is invalid.
- **`proxy.ts`** (Edge middleware) checks for the presence of `refreshToken` + `deviceId` cookies to gate private pages and protected API routes, and redirects authenticated users away from public auth pages.
- **Token refresh** happens in two places: the `/refresh` page calls `/api/auth/refresh` and redirects back on success (or to sign-in on failure); separately, `aspnetFetch` (`lib/auth/aspnet.ts`) transparently refreshes and retries once for server-side backend calls made on behalf of an expired session, without a page redirect.
- **Logout** (`/api/auth/logout`) calls the backend logout endpoint and always clears the local auth cookies regardless of the backend result.
- Final authentication and authorization decisions (validity of credentials, refresh tokens, and issued claims) are made by the ASP.NET Core backend; the Next.js layer only verifies the access-token JWT and manages cookies/redirects.

```
Sign-in → /api/auth/login → backend sets cookies
Private page → requireSession() → valid? render : redirect to /refresh or /auth/sign-in
/refresh → /api/auth/refresh → backend issues new access token → redirect back
Logout → /api/auth/logout → backend logout + clear cookies → redirect
```

## Main User Workflows

### Shift Calculator

1. The page loads pay-cycle metadata for the signed-in user on the server.
2. First-time users without pay-cycle settings are routed to a pay-cycle setup form (`PayCycleSetupForm.tsx`).
3. Once a cycle exists, shifts for that cycle are loaded and rendered client-side via a reducer (`shiftCalculator.reducer.ts`) that tracks draft vs. saved shifts, including which shift IDs were deleted.
4. Add, edit, delete, and duplicate-to-next-day actions only update local reducer state until the user saves.
5. "Save" sends the full set of draft shifts, deleted IDs, and the cycle range in one bulk request to `/api/private/shift/bulks`.
6. The response replaces local state with the backend's saved shifts and refreshes the displayed daily summaries and estimated gross pay — payroll math is performed by the ASP.NET Core backend, not duplicated as trusted business logic in the frontend.

### Night Report

The end-of-day report (`create-report/page.tsx`) is a multi-step form (`react-hook-form` + Zod) covering deliveries, stock update, night tasks, aisle facing, cleaning, and a general check. Users can upload delivery screenshots (validated for type/size) or enter delivery counts manually; uploaded images are resized/compressed client-side before submission (`features/cwh/services/cwh.client.ts`). Progress is auto-saved to `localStorage` and restored if the user reloads the page. On submit, the form data is flattened and sent as `FormData` to `/api/private/cwh/eod-report`, which forwards it to the backend; the completed report is delivered to the user via a linked Telegram bot.

### Demo Account

The sign-in page offers a "Try demo account" link that calls `/api/demo-account/setup`, which requests a demo login from the backend and applies the returned session cookies, then redirects into the dashboard — no credentials are entered by the user.

## Forms and Validation

- **React Hook Form** is used throughout (sign-in, register, pay-cycle setup, shift add/edit, night report).
- **`FormProvider`**/`useFormContext` share form state between the shift add/edit modal (`shiftModal.tsx`) and its field components (`ShiftFormFields.tsx`).
- **Zod schemas** (`features/*/schemas.ts`) define validation rules and are wired in via `@hookform/resolvers/zod`.
- Inline field errors are rendered next to inputs from `formState.errors`.
- Form-level/server errors (e.g. invalid credentials, failed submissions) are surfaced as banner text or via a notification toaster (`NotificationContext`/`NotificationToaster`).
- File uploads (night report screenshots) are validated with a Zod `refine`/`preprocess` pipeline and submitted using `FormData`.
- Pending/success states are handled with local `isLoading`/`isSaving` flags that disable buttons and show a spinner (e.g. `Spinner`, `LoaderCircle`) during submission.

## Loading, Error and Backend Startup Handling

- **Route-segment loading UI**: `loading.tsx` files (e.g. `(private)/loading.tsx`) provide the App Router's built-in loading state while a route segment's data is being fetched on the server.
- **Client request pending states**: buttons and forms show inline spinners/disabled states while a `fetch` to a Route Handler is in flight.
- **Error boundaries**: `error.tsx` (root and per-route, e.g. `dashboard/error.tsx`, `shift-calculator/error.tsx`) and `global-error.tsx` all render a shared `RouteErrorFallback` component, which lets each route customize title/description while reusing common fallback UI.
- **Backend/network errors**: `BackendHealthWakeGate` calls `/api/health/wake` on app load to detect and wait out a scaled-to-zero backend, showing rotating "starting up" messages and a manual retry button if the backend stays unreachable. `BackendHealthCheckGate` reads a short-lived `backendReady` cookie to skip this check on repeat visits within the same session window.

## Responsive Design and UI

- The private layout renders a collapsible sidebar (`AppSidebar`, `components/ui/sidebar.tsx`) on larger screens and a bottom navigation bar (`NavBottomBar`) on mobile, following a mobile-first Tailwind CSS approach (`md:` breakpoints throughout layouts and pages).
- UI primitives (buttons, cards, dialogs, sheets, dropdown menus, tooltips, form fields) follow shadcn/ui conventions on top of Radix UI, giving consistent, reusable building blocks across features.
- Radix primitives provide accessible dialogs, tooltips, and navigation menus out of the box; loading/error states use `role="alert"`/`role="status"` and `aria-live` attributes (see `BackendHealthWakeGate.tsx`).

## Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Landing/portfolio page | Public |
| `/auth/sign-in` | Sign in, includes demo account link | Public |
| `/auth/register` | Registration, requires a backend-issued secret token | Public |
| `/demo-account` | Sets up and signs into a demo session | Public |
| `/refresh` | Refreshes the access token, then redirects | Public |
| `/dashboard` | Telegram status + shift calculator summary | Private |
| `/chemist-warehouse/shift-calculator` | Pay-cycle setup and shift calculator | Private |
| `/chemist-warehouse/create-report` | Multi-step end-of-day report form | Private |
| `/settings` | Account settings and logout | Private |

## Running Locally

**Prerequisites:** Node.js and npm (this repository uses `package-lock.json`), and access to a running instance of the Jenian backend API.

```bash
# 1. Clone
git clone <PLACEHOLDER: this repository's clone URL>
cd jenian-client

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env.local   # create .env.example if it does not exist, then fill in values

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build

# 6. Start the production build
npm start
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BACKEND_URL` | Yes | Base URL of the ASP.NET Core backend API, used server-side by Route Handlers (login, refresh, demo account, shift, report, telegram, health checks). |
| `JWT_SECRET` | Yes | Secret used to verify the `accessToken` JWT server-side (`lib/auth/session.ts`). |
| `JWT_ISSUER` | Yes | Expected `iss` claim when verifying the access token. |
| `JWT_AUDIENCE` | Yes | Expected `aud` claim when verifying the access token. |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL of this frontend app, used to build the redirect target in `/api/auth/clear-session`. Exposed to the browser via the `NEXT_PUBLIC_` prefix. |

`NEXT_PUBLIC_*` variables are bundled into client-side JavaScript and are visible to anyone using the app. Do not put secrets (`JWT_SECRET`, backend credentials, etc.) behind a `NEXT_PUBLIC_` prefix.

No `.env.example` file currently exists in this repository; create one locally with the keys above (without real values) if you need a template.

## Deployment

The app is deployed on Vercel at https://jenian-client.vercel.app. `vercel.json` restricts automatic deployments to the `main` and `master` branches (`git.deploymentEnabled`), so other branches do not trigger a Vercel deployment. Backend hosting (Azure/Docker) is documented in the backend repository, not here.

## Testing and Quality Checks

`package.json` defines the following scripts:

- `npm run lint` — ESLint (`eslint.config.mjs`, using `eslint-config-next`)
- `npm run build` — Next.js production build, which also runs type checking

There are no unit or end-to-end test scripts or test files in this repository at this time.

## Known Limitations

- The backend runs on cost-saving infrastructure that scales to zero, so the first request after inactivity can take up to ~45 seconds; the app handles this with an explicit wake-up screen rather than hiding the delay.
- Estimated gross pay and daily summaries reflect the values last returned by the backend after a save — they are not recomputed live in the frontend as shifts are edited.
- There is no automated test suite (unit or end-to-end) for the frontend yet.
- The demo account does not deliver Telegram reports; live Telegram delivery requires a real linked account.

## Related Repository

The ASP.NET Core backend — including the API, database, payroll calculation rules, and Docker/Azure deployment — is documented in its own repository: `<PLACEHOLDER: backend repository URL>`.

## Author

Built by [Brian3010](https://github.com/Brian3010) ([LinkedIn](https://www.linkedin.com/in/brian-nguyen-411483196/)), as referenced on the app's landing page.
