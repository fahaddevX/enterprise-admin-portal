# Requirements — CRM Sync

## Scope

Introduce a BullMQ-backed sync pipeline that an operator triggers manually. A `POST /api/sync/:importId` endpoint enqueues a job; a separate worker process picks it up, calls a mock CRM, and updates the `SyncRecord`. A `GET /api/sync/:importId` endpoint lets callers poll the current state.

## Trigger model

Sync is **manually triggered** per import. The operator calls `POST /api/sync/:importId` after a completed import. This decouples the import and sync lifecycles and gives operators control over when data leaves the system.

## Mock CRM client

| Behaviour | Detail |
|---|---|
| Simulated latency | 200 ms async delay |
| Response | `{ crmId: "crm_<nanoid>" }` |
| Failure simulation | None in this phase — always succeeds |
| Swap path | Replace `lib/crm.ts` implementation with a real HTTP call in a future phase |

The mock is sufficient for wiring all surrounding infrastructure. Real CRM credentials are deferred until the integration target is confirmed.

## SyncRecord lifecycle

```
PENDING  →  SYNCING  →  SYNCED
                    ↘  FAILED  (on worker error)
```

One `SyncRecord` is created per trigger call. Re-triggering a synced import creates a second `SyncRecord` — history is preserved.

## API surface

| Method | Path | Description |
|---|---|---|
| POST | `/api/sync/[importId]` | Create SyncRecord (PENDING), enqueue job, return 202 |
| GET | `/api/sync/[importId]` | Return the most recent SyncRecord for this import |

**POST error cases:**
- `404` — Import not found
- `409` — Import is not in `COMPLETED` status (still processing or failed)

## BullMQ job payload

```ts
{ importId: string; syncRecordId: string }
```

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Trigger model | Manual POST | Decouples import and sync; operator controls timing |
| Queue backend | BullMQ + ioredis | Already in the tech stack; durable, retry-capable, TypeScript-native |
| Worker process | Separate `tsx workers/sync.ts` | Keeps the Next.js server stateless; worker can be scaled independently |
| CRM client | Mock stub | Unblocks all downstream phases without needing live credentials |
| Re-trigger behaviour | Allowed — creates new SyncRecord | Preserves sync history; useful for debugging failed syncs |
| Status polling | GET endpoint | Simple and sufficient; SSE/WebSocket upgrade comes in Phase 6 |

## Out of Scope

- Real CRM API calls (replace `lib/crm.ts` when target is confirmed)
- Per-user CRM field mapping (import-level sync only in this phase)
- Retry configuration for failed jobs (BullMQ default retries apply)
- Auth / access control on the sync endpoints
- UI for viewing sync history (Phase 6 — progress status page)

## Context

The mission requires seamless CRM sync as part of the end-to-end data pipeline. BullMQ gives us durable, retryable jobs backed by Redis — meaning a worker crash or restart does not lose queued sync work. The mock CRM lets us validate the full infrastructure path before a real integration target is chosen.
