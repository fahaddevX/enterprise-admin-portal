# Validation — CRM Sync

This phase is considered complete and mergeable when all of the following are true.

## Checklist

### Infrastructure
- [ ] `redis-cli ping` returns `PONG` (Redis is reachable)
- [ ] `REDIS_URL` is present in `.env.local` and documented in `.env.example`
- [ ] `pnpm worker:dev` starts the BullMQ worker without errors

### API — trigger endpoint
- [ ] `POST /api/sync/:importId` with a valid COMPLETED import returns `202` and a `SyncRecord` with `status: "PENDING"`
- [ ] `POST /api/sync/:importId` with an unknown import ID returns `404`
- [ ] `POST /api/sync/:importId` with an import that is not `COMPLETED` returns `409`

### API — status endpoint
- [ ] `GET /api/sync/:importId` returns `404` when no SyncRecord exists for that import
- [ ] `GET /api/sync/:importId` returns the most recent `SyncRecord` as JSON after a job is enqueued

### Worker
- [ ] Worker picks up the enqueued job and sets `SyncRecord.status = SYNCING`
- [ ] Worker calls the mock CRM and writes the returned `crmId` to `SyncRecord`
- [ ] `GET /api/sync/:importId` after job completion shows `status: "SYNCED"` and a non-null `crmId`
- [ ] Worker output logs the simulated CRM call

### Project health
- [ ] `pnpm build` exits 0 — no TypeScript errors
- [ ] `pnpm lint` exits 0
- [ ] `GET /api/health` still returns `{"status":"ok","db":"connected"}`

## Not Required to Merge

- Real CRM HTTP calls
- Per-user sync records
- Retry configuration beyond BullMQ defaults
- UI for sync history or status (Phase 6)
- Auth on sync endpoints
