# Phase 6 — Progress Status Page: Validation

## Definition of done

Phase 6 is complete when all of the following pass:

### 1. API correctness

- `GET /api/status` returns HTTP 200 with a JSON array
- Each element contains import fields and a `syncRecord` object (or `null` when no sync has been triggered)
- A newly uploaded import appears in the list with `syncRecord: null`
- After triggering sync, the same record shows `syncRecord.status` updating through `PENDING → SYNCING → SYNCED`

### 2. UI correctness

- `/status` page loads without errors
- The table renders columns: Filename, Import Status, Rows, CRM Status, CRM ID, Started
- Status values render as colored badge pills (not raw text)
- The table updates automatically — the CRM status transitions from PENDING to SYNCING to SYNCED are visible without a manual page refresh

### 3. Live update screenshot

- Start the dev server and the CRM sync worker (`pnpm worker:dev`)
- Upload a CSV via the import page
- Trigger sync via `POST /api/sync/:importId`
- Navigate to `/status` and observe the status column update in real time
- A browser screenshot shows the SYNCED state with a crmId populated

### 4. Build and lint

- `pnpm lint` exits 0 with no errors
- `pnpm build` compiles all routes cleanly (including the new `/status` and `/api/status` routes)
