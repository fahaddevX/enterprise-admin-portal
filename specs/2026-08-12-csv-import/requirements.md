# Requirements — CSV Import

## Scope

Allow an operator to upload a CSV file containing user records. The server streams the file, validates each row, upserts `User` records, and returns a completed `Import` record with row-level counts. A minimal upload form provides a browser-testable interface.

## CSV format

| Column | Required | Notes |
|---|---|---|
| `email` | Yes | Used as the unique key for upsert; rows missing email are skipped |
| `name` | No | Optional display name; ignored if blank |

Any additional columns in the CSV are silently ignored. Column order does not matter — `csv-parse` maps by header name.

## Processing behaviour

- **Streaming**: the file is piped through `csv-parse` row-by-row; the full file is never loaded into memory at once
- **Upsert by email**: if a `User` with that email already exists, `name` is updated; otherwise a new record is created
- **Per-row error handling**: rows that fail validation (missing email, malformed email) are counted in `failedRows` and skipped — they do not abort the import
- **Status lifecycle**: `PENDING` → `PROCESSING` → `COMPLETED` / `FAILED`
  - `FAILED` is only set when the file itself cannot be parsed (e.g. wrong MIME type, empty file) — partial row failures result in `COMPLETED` with non-zero `failedRows`

## Schema additions to `Import`

| Field | Type | Notes |
|---|---|---|
| totalRows | Int | Total data rows in the CSV (header excluded) |
| processedRows | Int | Rows successfully upserted |
| failedRows | Int | Rows skipped due to validation errors |

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Processing model | Synchronous streaming | Simpler than a queue for this phase; streaming keeps memory flat regardless of file size |
| Parser | csv-parse | Mature, streaming-native, ships TypeScript types, well-suited to server-side pipelines |
| Multipart parsing | Native Next.js `request.formData()` | Built in — no additional middleware needed |
| Upsert strategy | `upsert` by `email` | Prevents duplicate users across multiple imports; aligns with the mission's deduplication requirement |
| Partial failure | Continue, count failures | Aborting an entire import on one bad row is too destructive for large enterprise files |
| Background queue | Deferred | BullMQ integration comes in Phase 5 (CRM sync); CSV processing is fast enough inline for this phase |

## Out of Scope

- File size limits and streaming backpressure tuning (polish pass)
- Per-row error detail log (polish pass)
- Import history list page (Phase 6 — progress status page)
- Auth / access control

## Context

The mission calls for processing large user data files reliably and at speed. Streaming with `csv-parse` keeps memory flat regardless of file size, and upsert-by-email ensures idempotency so operators can safely re-upload corrected files.
