# Validation — Data Model

This phase is considered complete and mergeable when all of the following are true.

## Checklist

- [ ] `prisma/schema.prisma` contains `User`, `Import`, and `SyncRecord` models — and no `Health` model
- [ ] `ImportStatus` enum defines `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`
- [ ] `SyncStatus` enum defines `PENDING`, `SYNCING`, `SYNCED`, `FAILED`
- [ ] `pnpm prisma migrate dev` applies the migration cleanly against a fresh local DB with no errors
- [ ] The generated migration SQL accurately reflects the schema (inspect `prisma/migrations/`)
- [ ] `pnpm prisma generate` completes without errors
- [ ] `pnpm build` exits 0 — no TypeScript errors across the project
- [ ] `pnpm lint` exits 0
- [ ] `GET /api/health` still returns `{"status":"ok","db":"connected"}` — no regressions

## Not Required to Merge

- Seed data or dev fixtures
- Any UI page for these models
- Row count fields on `Import` (added in Phase 4)
- CRM sync logic (Phase 5)
