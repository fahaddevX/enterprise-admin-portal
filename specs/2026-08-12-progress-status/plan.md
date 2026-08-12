# Phase 6 — Progress Status Page: Plan

## Task Group 1: Status API endpoint

- Add `GET /api/status` route that queries all imports with their latest SyncRecord
- Return JSON array: each item includes `import` fields (id, filename, status, totalRows, processedRows, failedRows, createdAt) and `syncRecord` (status, crmId, createdAt) or `null`
- Order by import `createdAt` descending

## Task Group 2: Status page UI

- Create `app/status/page.tsx` as a Server Component that renders a heading and the `<StatusTable>` client component
- Add a nav link to `/status` in `app/layout.tsx`

## Task Group 3: StatusTable client component

- Create `components/StatusTable.tsx` as a `"use client"` component
- On mount, fetch `/api/status` and render a table with columns: Filename, Import Status, Rows (processed/total), CRM Status, CRM ID, Started
- Poll every 3 seconds with `setInterval` — call `clearInterval` on unmount
- Show a status badge (colored pill) for Import Status and CRM Status values
- While loading show a skeleton/placeholder row; on fetch error show an inline error message

## Task Group 4: Lint, build, and browser verification

- Run `pnpm lint` — must exit 0
- Run `pnpm build` — must compile clean
- Start dev server, upload a CSV, trigger sync via POST `/api/sync/:importId`, watch the status table update through PENDING → SYNCING → SYNCED without a page refresh
- Capture a screenshot as proof
