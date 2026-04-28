# Habit Tracker PWA

A mobile-first, offline-capable Progressive Web App built for tracking daily habits with deterministic streak calculation and local persistence.

## 1. Project Overview

This application is a technical implementation of the Stage 3 Habit Tracker specification. It allows users to manage habits, track streaks, and maintain data across sessions using local-only persistence. The project emphasizes testability, accessibility, and PWA reliability.

## 2. Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mariioox/hng-stage-3-habit_tracker
   cd hng-stage_3_habit_tracker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## 3. Run Instructions

- **Development Mode:**

  ```bash
  npm run dev
  ```

  Open [http://localhost:3000] to view the app.

- **Production Build:**
  ```bash
  npm run build
  npm run start
  ```

## 4. Test Instructions

The project includes a full test suite as required by the specification.

- **Run all tests (Unit, Integration, E2E):**
  ```bash
  npm test
  ```
- **Run Unit Tests with Coverage:**
  ```bash
  npm run test:unit
  ```
- **Run E2E Tests (Playwright):**
  ```bash
  npm run test:e2e
  ```

## 5. Local Persistence Structure

Data is stored deterministically in the browser's `localStorage` using the following key schema:

- `habit-tracker-users`: An array of user objects containing `id`, `email`, and hashed `password`.
- `habit-tracker-session`: The current active user session object (`userId`, `email`).
- `habit-tracker-habits`: An array of all habits. Each habit includes a `userId` for ownership and a `completions` array (ISO date strings) for streak calculation.

## 6. PWA Implementation

- **Service Worker:** Implemented in `public/sw.js` using a "Network-First, falling back to Cache" strategy for reliability.
- **App Shell:** Key routes (`/`, `/login`, `/dashboard`) are cached during the SW `install` phase to ensure the app loads offline.
- **Manifest:** A `manifest.json` defines brand colors, icons (`192x192`, `512x512`), and standalone display mode for a native feel.

## 7. Trade-offs and Limitations

- **Local-Only:** Since no remote database is used, data is scoped to a single browser and device. Clearing site data will wipe all user habits.
- **Security:** `localStorage` is used for sessions to satisfy the "No External Auth" requirement; in a production environment with a backend, HttpOnly cookies would be preferred.

## 8. Test Mapping (Requirement 16.3 & 19)

The following table maps the required test files to the behaviors they verify:

| Test File             | Verified Behavior                                                                                          |
| :-------------------- | :--------------------------------------------------------------------------------------------------------- |
| `app.spec.ts`         | **E2E Flow:** Splash screen timing, Auth redirection, Habit CRUD, Persistence, and Offline PWA loading.    |
| `auth-flow.test.tsx`  | **Integration:** Validates form handling, error message display, and session creation logic.               |
| `habit-form.test.tsx` | **Integration:** Ensures habit creation/editing modals correctly update the local state.                   |
| `streaks.test.ts`     | **Unit:** Verifies deterministic streak math (consecutive days, resets on gaps, and future date handling). |
| `slug.test.ts`        | **Unit:** Confirms URL-safe, lowercase, and symbol-free slug generation for habit IDs.                     |
| `validators.test.ts`  | **Unit:** Validates habit name constraints (length, whitespace, and required fields).                      |
