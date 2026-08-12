# Requirements — Data Model

## Scope

Replace the Phase 2 placeholder schema with the three real domain models that all subsequent phases build on: `User`, `Import`, and `SyncRecord`. All three are introduced in a single migration.

## Models

### User
Represents an enterprise user record — the subject of CSV imports and CRM sync operations.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| email | String | Unique — the natural identifier for deduplication |
| name | String? | Optional display name |
| createdAt | DateTime | Auto-set on insert |
| updatedAt | DateTime | Auto-updated on change |

### Import
Represents one CSV import job submitted by an operator. Tracks the job lifecycle.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| filename | String | Original CSV filename — supports audit trail per the mission |
| status | ImportStatus | Enum: PENDING → PROCESSING → COMPLETED / FAILED |
| createdAt | DateTime | Auto-set on insert |
| updatedAt | DateTime | Auto-updated on change |

**ImportStatus enum:** `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`

Row counts and per-row error logging are deferred to Phase 4 (CSV import), when the actual processing logic is in place.

### SyncRecord
Represents the CRM sync state for a single import job.

| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| importId | String | FK → Import |
| status | SyncStatus | Enum: PENDING → SYNCING → SYNCED / FAILED |
| crmId | String? | External CRM record ID, populated after successful sync |
| createdAt | DateTime | Auto-set on insert |
| updatedAt | DateTime | Auto-updated on change |

**SyncStatus enum:** `PENDING`, `SYNCING`, `SYNCED`, `FAILED`

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Single migration | All three models in one `migrate dev` run | Simpler to apply and review at this stage; models are interdependent |
| CUID primary keys | `@default(cuid())` | URL-safe, non-sequential — better for audit logs and external exposure than auto-increment |
| Status as enum | Prisma `enum` types | Enforced at DB and ORM level; prevents invalid state values |
| Row counts deferred | Not included in this phase | Phase 4 will define exact processing semantics; adding fields now would be speculative |
| Health model removed | Deleted in this migration | It was a Phase 2 scaffold with no production purpose |

## Out of Scope

- CSV parsing or file upload logic (Phase 4)
- CRM API client or sync job queue (Phase 5)
- Any UI for viewing or managing these records (Phase 6+)
- Seed data or fixtures

## Context

The mission requires auditability: every import must be traceable from file upload through CRM sync. These three models are the backbone that makes that traceability possible. Getting the schema right here avoids costly migrations later.
