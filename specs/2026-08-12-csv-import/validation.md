# Validation — CSV Import

This phase is considered complete and mergeable when all of the following are true.

## Checklist

### Schema
- [ ] `Import` model has `totalRows`, `processedRows`, `failedRows` fields (Int, default 0)
- [ ] Migration applies cleanly against a fresh local DB

### API
- [ ] `POST /api/imports` with a valid CSV returns HTTP 201 and a JSON `Import` record
- [ ] Returned record has `status: "COMPLETED"` and accurate `totalRows`, `processedRows`, `failedRows`
- [ ] `User` records are created or updated in the database for each valid row
- [ ] A CSV with no `email` column returns HTTP 400 with a clear error message
- [ ] A CSV with some invalid rows still completes — valid rows are upserted, bad rows counted in `failedRows`
- [ ] An empty file upload returns HTTP 400

### UI
- [ ] `/imports` page loads without errors in a modern browser
- [ ] File input restricts selection to `.csv` files
- [ ] Submitting a valid CSV shows a success summary (filename, row counts)
- [ ] Submitting triggers a loading state during the upload

### Project health
- [ ] `pnpm build` exits 0 — no TypeScript errors
- [ ] `pnpm lint` exits 0
- [ ] `GET /api/health` still returns `{"status":"ok","db":"connected"}`

## Not Required to Merge

- Import history list (Phase 6)
- Per-row error detail in the response body
- File size enforcement
- Auth / access control
- BullMQ background processing
