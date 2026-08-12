# Plan — CRM Sync

Numbered task groups in execution order. Complete each group before moving to the next.

1. **Redis connectivity**
   - Verify Redis is running locally (`redis-cli ping`)
   - Confirm `REDIS_URL` is present in `.env.example` and `.env.local`

2. **Install BullMQ and ioredis**
   - Add `bullmq` and `ioredis` via pnpm
   - Both ship their own TypeScript types — no `@types/` packages needed

3. **Queue singleton (`lib/queue.ts`)**
   - Export a shared `Queue` instance named `crmSyncQueue` backed by `REDIS_URL`
   - Export a shared `connection` (ioredis) so the worker reuses the same config

4. **Mock CRM client (`lib/crm.ts`)**
   - Export `syncToCrm(importId: string): Promise<{ crmId: string }>`
   - Simulate a 200 ms network delay, then return `{ crmId: "crm_<nanoid>" }`
   - Log the simulated call so it is visible in the worker process output

5. **BullMQ worker (`workers/sync.ts`)**
   - Instantiate a `Worker` that processes jobs from `crmSyncQueue`
   - Job payload: `{ importId: string; syncRecordId: string }`
   - On pickup: set `SyncRecord.status = SYNCING`
   - Call `syncToCrm`, write the returned `crmId` and set `status = SYNCED`
   - On any error: set `status = FAILED`
   - Add a `worker:dev` script to `package.json`: `tsx workers/sync.ts`

6. **Trigger endpoint (`POST /api/sync/[importId]`)**
   - Verify the Import exists and has `status = COMPLETED`; return 404 / 409 otherwise
   - Create a `SyncRecord` with `status = PENDING`
   - Enqueue a job on `crmSyncQueue` with `{ importId, syncRecordId }`
   - Return `202` with the new `SyncRecord`

7. **Status endpoint (`GET /api/sync/[importId]`)**
   - Look up the most recent `SyncRecord` for the given `importId`
   - Return `404` if none exists, otherwise return the `SyncRecord` as JSON

8. **End-to-end verification**
   - Run `pnpm worker:dev` in a second terminal
   - Upload a CSV via `/imports`, note the returned `importId`
   - `POST /api/sync/:importId` → confirm 202 and `status: PENDING`
   - `GET /api/sync/:importId` → confirm `status: SYNCED` and `crmId` populated

9. **UI trigger (added in Phase 6)**
   - The `/status` progress table shows a "Sync to CRM" button on rows where
     `import.status === COMPLETED` and no SyncRecord exists yet
   - Clicking calls `POST /api/sync/[importId]`, disables the button while in
     flight (shows "Syncing…"), then refreshes the table immediately on completion
   - Implemented in `components/StatusTable.tsx` alongside the polling loop
