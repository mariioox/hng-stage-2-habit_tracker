# Habit Tracker PWA - Stage 3 Implementation

## 📌 Project Overview

A high-performance, mobile-first Habit Tracker Progressive Web App (PWA) built with **Next.js**. This project was developed as a technical translation task focusing on deterministic logic, local persistence, and comprehensive test coverage (100% logic coverage achieved).

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd stage_3_habit_tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

_Note: This project uses localStorage for persistence as per Section 3 requirements. No external database or `.env` file is required for core functionality._

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🧪 Testing Suite

This project implements a three-tier testing strategy as mandated by the Stage 3 Specification.

| Command                    | Type            | Description                                                 |
| :------------------------- | :-------------- | :---------------------------------------------------------- |
| `npm run test:unit`        | **Unit**        | Verifies logic in `src/lib` (Streaks, Slugs, Validators).   |
| `npm run test:integration` | **Integration** | Verifies `HabitModal` behavior using React Testing Library. |
| `npm run test:e2e`         | **E2E**         | Runs Playwright flows (Login, Habit Creation, Persistence). |
| `npm test`                 | **Full Audit**  | Runs all the above commands in sequence.                    |

---

## 🛠 Technical Implementation Details

### Local Persistence Structure (Section 7)

Data is persisted using the browser's `localStorage` API.

- **Key:** `habit-tracker-habits`
- **Format:** An array of `Habit` objects.
- **Deterministic Logic:** Each habit tracks completions via an array of ISO-8601 strings (`YYYY-MM-DD`). This allows for time-zone agnostic streak calculations.

### PWA Support (Section 8)

- **Manifest:** `public/manifest.json` defines the standalone display mode, theme colors, and icons for OS-level installation.
- **Service Worker:** A custom service worker (`public/sw.js`) implements a "Cache First" strategy for the app shell, ensuring the UI loads instantly even when offline.

### Test-to-Behavior Mapping (Section 19)

- `tests/unit/streaks.test.ts`: Validates the **Section 11.1** contract for consecutive day calculations and gap detection.
- `tests/unit/validators.test.ts`: Ensures input sanitization and length constraints follow **Section 11.2**.
- `tests/unit/slug.test.ts`: Confirms that habit names are safely converted to IDs for testing selectors (**Section 10**).
- `tests/integration/habit-form.test.tsx`: Exercises the UI to ensure error states and success callbacks trigger correctly (**Section 16.2**).

### ⚖️ Trade-offs & Limitations

- **Storage Strategy:** By using `localStorage`, we achieve the required deterministic behavior without network latency, but data is bound to a single browser/device.
- **State Management:** React `useState` and `useEffect` were used over complex stores (like Redux) to keep the "Brain" of the app in `src/lib` easily testable and decoupled from the UI.

```

---
```
