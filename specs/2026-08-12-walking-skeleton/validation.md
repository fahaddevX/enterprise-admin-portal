# Validation — Walking Skeleton

This phase is considered complete and mergeable when all of the following are true.

## Checklist

- [ ] `pnpm prisma generate` completes without errors
- [ ] `pnpm prisma migrate dev` applies the initial migration cleanly against a local Postgres instance
- [ ] `GET /api/health` returns HTTP 200 with `{ "status": "ok", "db": "connected" }` when the DB is reachable
- [ ] `GET /api/health` returns HTTP 503 with `{ "status": "error", "db": "unreachable" }` when the DB is not reachable (verified by temporarily setting an invalid `DATABASE_URL`)
- [ ] `lib/db.ts` exports the Prisma singleton and is the only place a `PrismaClient` is instantiated
- [ ] No TypeScript errors (`pnpm build` or `tsc --noEmit` exits 0)
- [ ] `pnpm lint` exits 0
- [ ] `DATABASE_URL` is documented in `.env.example`
- [ ] No Prisma connection errors appear in the Next.js server log under normal operation

## Not Required to Merge

- Any rendered UI page
- Real data in the database beyond what the migration creates
- Redis or queue connectivity
- Authentication
