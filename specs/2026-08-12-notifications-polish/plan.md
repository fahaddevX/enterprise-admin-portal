# Plan — Notifications + Polish (Phases 7 & 8)

Numbered task groups in execution order. Complete each before moving to the next.

## Phase 7 — In-app Notifications

### 1. Prisma migration — Notification model

- Add `NotificationEvent` enum: `IMPORT_COMPLETED`, `IMPORT_FAILED`, `SYNC_COMPLETED`, `SYNC_FAILED`
- Add `Notification` model: `id`, `event` (NotificationEvent), `message` (String), `read` (Boolean default false), `createdAt`
- Generate and run migration

### 2. Notification creation on the server

- In `app/api/imports/route.ts`: after setting import status to `COMPLETED` or `FAILED`, create a `Notification` record with a human-readable message (e.g. `"Import of users.csv completed — 150 rows"`)
- In `workers/sync.ts`: after setting `SyncRecord.status = SYNCED`, create `SYNC_COMPLETED` notification; after setting `FAILED`, create `SYNC_FAILED` notification

### 3. Notifications API

- `GET /api/notifications` — return the 20 most recent notifications ordered by `createdAt` desc; include `unreadCount` in the response envelope
- `POST /api/notifications/read-all` — mark all notifications `read = true`, return `{ updated: number }`

### 4. Toast component

- `components/ToastStack.tsx` — fixed top-right stack, auto-dismisses after 4 s, max 3 visible at once
- Export a `useToast()` hook backed by React context so any component can fire a toast
- `app/layout.tsx` wraps children in `<ToastProvider>` so the hook works app-wide

### 5. NotificationBell component

- `components/NotificationBell.tsx` — client component that polls `GET /api/notifications` every 3 s
- Compares the newest notification `id` to a ref tracking the last-seen id; fires a toast for each newly appeared notification
- Renders a bell icon (inline SVG) with a red badge showing unread count (hidden when 0)
- Clicking the bell opens a dropdown list of the 20 most recent notifications with timestamps; a "Mark all read" button calls `POST /api/notifications/read-all` and refreshes the list
- Wire into the nav in `app/layout.tsx`

---

## Phase 8 — Polish

### 6. Empty states

- `/imports` (ImportUploadForm): add an import history section below the form showing past imports from `GET /api/status`; if none, render a friendly empty-state message
- `/status` page: the existing "no imports yet" message already links to `/imports` — upgrade it with an icon and clearer copy

### 7. Error states

- Standardise all inline error UI to the same `rounded-lg border border-red-200 bg-red-50 p-4` pattern (already used in ImportUploadForm — audit and align remaining surfaces)
- Add a top-level error boundary in `app/layout.tsx` so unhandled errors show a graceful fallback instead of a blank page

### 8. Loading skeletons

- Extract a reusable `<Skeleton>` component (`components/Skeleton.tsx`) — a single animated `div` with configurable width/height
- Replace the ad-hoc skeleton in `StatusTable` with `<Skeleton>` instances
- Add skeleton state to `NotificationBell` dropdown while the first fetch is in flight

### 9. Visual consistency

- Unify page chrome: all pages use the same `max-w-5xl mx-auto p-8` container and `bg-zinc-50 dark:bg-zinc-900` background
- Headings: `text-2xl font-semibold tracking-tight` everywhere
- Subtext: `text-sm text-zinc-500 dark:text-zinc-400 mb-8`
- Review dark-mode contrast on all badge colours and button states

### 10. Lint, build, and browser verification

- `pnpm lint` must exit 0
- `pnpm build` must compile all routes cleanly
- Screenshots: toast appearing after CSV import completes, bell icon with unread badge, polished `/imports` and `/status` pages in both light and dark mode
