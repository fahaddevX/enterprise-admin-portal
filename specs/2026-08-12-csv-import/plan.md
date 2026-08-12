# Plan — CSV Import

Numbered task groups in execution order. Complete each group before moving to the next.

1. **Schema update**
   - Add `totalRows`, `processedRows`, and `failedRows` (all `Int`, default 0) to the `Import` model
   - Run `pnpm prisma migrate dev --name import-row-counts` to apply
   - Regenerate the Prisma client

2. **Install csv-parse**
   - Add `csv-parse` via pnpm (ships its own types — no `@types/` needed)

3. **Import API route**
   - Create `app/api/imports/route.ts` handling `POST /api/imports`
   - Accept `multipart/form-data` with a `file` field
   - Create an `Import` record (status `PENDING`), then set to `PROCESSING`
   - Stream the uploaded file through `csv-parse`, expecting columns `email` and `name`
   - For each valid row: upsert a `User` by email; increment `processedRows`
   - For each invalid row (missing email): increment `failedRows`, continue
   - On completion: set status to `COMPLETED` (or `FAILED` if zero rows succeeded); update all row counts
   - Return the final `Import` record as JSON

4. **Upload form UI**
   - Create `app/imports/page.tsx` — a server component page
   - Create `components/ImportUploadForm.tsx` — a client component with:
     - A styled file input accepting `.csv` files only
     - A submit button that POSTs to `/api/imports` via `fetch`
     - Inline feedback: loading state during upload, success summary or error message on completion

5. **End-to-end verification**
   - Upload a sample CSV (email + name columns) via the form in a browser
   - Confirm the API returns a `COMPLETED` Import record with accurate row counts
   - Confirm `User` records appear in the database
   - Upload a malformed CSV and confirm a graceful error response
