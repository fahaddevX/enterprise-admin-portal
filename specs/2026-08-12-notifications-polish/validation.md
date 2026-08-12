# Validation — Notifications + Polish (Phases 7 & 8)

## Definition of done

All of the following must pass before merging.

---

## Phase 7 — In-app Notifications

### 1. Notification creation

- Upload a CSV → import completes → a `Notification` record with event `IMPORT_COMPLETED` appears in the database
- Trigger CRM sync → worker completes → a `SYNC_COMPLETED` notification appears

### 2. API correctness

- `GET /api/notifications` returns HTTP 200 with `{ notifications: [...], unreadCount: N }`
- `POST /api/notifications/read-all` returns `{ updated: N }` and subsequent GET returns `unreadCount: 0`

### 3. Bell UI

- Bell icon visible in nav on every page
- Unread badge shows the correct count; disappears after "Mark all read"
- Dropdown lists the 20 most recent notifications with event labels and timestamps
- Dropdown closes and badge resets after clicking "Mark all read"

### 4. Toast UI

- Upload a CSV and navigate to any page — a toast appears at top-right within 3 seconds of the import completing
- Toast is green for completed events, red for failed events
- Toast auto-dismisses after 4 seconds without user interaction

### 5. Screenshot proof

- Screenshot showing the notification bell with a non-zero unread badge
- Screenshot showing a toast in the top-right corner

---

## Phase 8 — Polish

### 6. Empty states

- Navigate to `/status` before uploading any CSV → friendly empty-state message with a link to `/imports` renders (no blank space)

### 7. Error states

- Trigger an upload error (e.g. non-CSV file) → consistent red error card appears
- All error surfaces match the same `border-red-200 bg-red-50` visual pattern

### 8. Loading skeletons

- Hard-refresh `/status` → animated skeleton rows appear briefly before data loads (not blank space or "Loading…" text)

### 9. Visual consistency

- `/imports` and `/status` pages use the same container width, heading style, and background
- Dark mode: all badge pills and buttons have sufficient contrast

### 10. Build and lint

- `pnpm lint` exits 0
- `pnpm build` compiles all routes cleanly (including `/api/notifications` and `/api/notifications/read-all`)
