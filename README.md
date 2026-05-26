# Dexa HR Admin — Frontend

Admin web application for company HR management, built with React + TypeScript + Vite as part of the Dexa Technical Test.

## Features

- **Authentication** — Login/logout with JWT stored in localStorage. Auto-redirects to login on token expiry (401).
- **Employee Management** — Full CRUD: paginated employee list with search, create, edit, photo upload, and delete.
- **Attendance Monitoring** — Attendance table for all employees with date range and name filters, including check-in/check-out status.
- **Push Notifications (FCM)** — Real-time notifications via Firebase Cloud Messaging. Device token is automatically registered and subscribed to the `update_data` topic on login.

## Tech Stack

| Category | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 + DaisyUI 5 |
| HTTP Client | Axios |
| Notifications | Firebase Cloud Messaging (FCM) |

## Project Structure

```
src/
├── config/
│   ├── axios.tsx        # Axios instance with JWT & 401 interceptors
│   └── firebase.ts      # Firebase initialization & VAPID key
├── hooks/
│   └── useFirebaseMessaging.ts  # FCM custom hook
├── layout/
│   └── base_layout.tsx  # Main layout with navbar & footer
├── pages/
│   ├── Login.tsx
│   ├── Attendance.tsx
│   └── employee/
│       ├── List.tsx
│       ├── Create.tsx
│       └── Edit.tsx
├── service/             # API call layer
│   ├── auth.ts
│   ├── employee.ts
│   ├── attendance.ts
│   └── notification.ts
└── components/          # Reusable components
    ├── data_table.tsx
    ├── pagination.tsx
    ├── notification_bell.tsx
    ├── notification_toast.tsx
    ├── confirm_modal.tsx
    ├── alert.tsx
    ├── navbar.tsx
    └── footer.tsx
```

## Prerequisites

- Node.js >= 18
- pnpm
- Backend API running at `http://localhost:3000`

## Installation & Running

```bash
# Clone repository
git clone <repo-url>
cd dexa_technical_test_frontend_admin

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

App will be available at `http://localhost:5173`.

## Available Commands

```bash
pnpm dev       # Development server with HMR
pnpm build     # Production build (type-check + vite build)
pnpm preview   # Preview production build
pnpm lint      # Run ESLint
```

## Configuration

### API Base URL

Update the base URL in [src/config/axios.tsx](src/config/axios.tsx):

```ts
baseURL: "http://localhost:3000/api/v1/"
```

### Firebase (FCM)

Firebase config lives in [src/config/firebase.ts](src/config/firebase.ts). Replace the config values with your own Firebase project credentials if needed, including the `VAPID_KEY` for Web Push.

The FCM Service Worker is at [public/firebase-messaging-sw.js](public/firebase-messaging-sw.js).

## Routes

| Path | Page |
|---|---|
| `/` | Login |
| `/dashboard/employee` | Employee List |
| `/dashboard/employee/create` | Create Employee |
| `/dashboard/employee/:id/edit` | Edit Employee |
| `/dashboard/attendance` | Attendance Monitoring |

All `/dashboard/*` routes are protected by JWT authentication.
