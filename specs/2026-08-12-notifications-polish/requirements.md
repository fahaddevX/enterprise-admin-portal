# Requirements — Notifications + Polish (Phases 7 & 8)

## Scope

Phase 7 adds in-app notifications so operators know immediately when an import or CRM sync completes or fails — without having to watch the status table. Phase 8 raises the overall quality bar: empty states, consistent error display, loading skeletons, and visual uniformity across every page.

---

## Phase 7 — In-app Notifications

### Notification triggers

| Event | When | Message |
|---|---|---|
| `IMPORT_COMPLETED` | Import row processing finishes successfully | `"Import of <filename> completed — <n> rows"` |
| `IMPORT_FAILED` | Import row processing fails | `"Import of <filename> failed"` |
| `SYNC_COMPLETED` | Worker sets SyncRecord to SYNCED | `"CRM sync for <filename> completed"` |
| `SYNC_FAILED` | Worker sets SyncRecord to FAILED | `"CRM sync for <filename> failed"` |

Notifications are created server-side (in the API route and worker) so they are durable and visible across tabs/sessions.

### Notification bell

- Rendered in the nav bar on every page
- Shows an unread count badge (red pill); hidden when count is 0
- Clicking opens a dropdown listing the 20 most recent notifications with event label and timestamp
- "Mark all read" button in the dropdown calls `POST /api/notifications/read-all`
- The bell polls `GET /api/notifications` every 3 seconds (same interval as the status table)

### Toast

- A toast slides in from the top-right when a new notification is detected by the bell's poller
- Auto-dismisses after 4 seconds
- Stacks up to 3 at a time; oldest drops out when a fourth arrives
- Colour: green for completed events, red for failed events

### API surface

| Method | Path | Description |
|---|---|---|
| GET | `/api/notifications` | `{ notifications: Notification[], unreadCount: number }` — 20 most recent |
| POST | `/api/notifications/read-all` | Mark all notifications read; return `{ updated: number }` |

---

## Phase 8 — Polish

### Empty states

- Every list or table that can be empty shows a clear message with a contextual call to action (e.g. "No imports yet — upload a CSV to get started")
- No blank sections or invisible placeholders

### Error states

- All inline errors use the same visual pattern: `rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4 text-sm`
- Error messages are human-readable and actionable where possible
- A root error boundary in `app/layout.tsx` prevents blank-page crashes from unhandled exceptions

### Loading skeletons

- A reusable `<Skeleton>` component replaces ad-hoc loading placeholders
- Used in the status table on first load and in the notification bell dropdown

### Visual consistency

- All pages share the same container width (`max-w-5xl mx-auto p-8`), heading style, and subtext style
- Badge colours verified for sufficient contrast in both light and dark mode
- Button hover/focus/disabled states are consistent

---

## Key decisions

| Decision | Choice | Reason |
|---|---|---|
| Notification persistence | Prisma `Notification` table | Survives page refresh and multi-tab; enables history dropdown |
| Toast delivery | Polling-based (bell detects new records) | Consistent with existing polling approach; no SSE/WebSocket added |
| Toast dismissal | Auto after 4 s, max 3 stacked | Non-blocking; matches common admin UI convention |
| Polish scope | All four areas (empty, error, skeleton, consistency) | Final phase — close all remaining rough edges before ship |

## Out of scope

- Push notifications (browser Notification API)
- Email or external alerting
- Per-user notification preferences or read tracking per user (single-operator app)
- Notification pagination beyond the 20 most recent
