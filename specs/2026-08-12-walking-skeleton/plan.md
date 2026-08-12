# Plan — Walking Skeleton

Numbered task groups in execution order. Complete each group before moving to the next.

1. **Prisma setup**
   - Install `prisma` and `@prisma/client` via pnpm
   - Run `pnpm prisma init` to generate `prisma/schema.prisma` and add `DATABASE_URL` to `.env`
   - Confirm `DATABASE_URL` is listed in `.env.example`

2. **Minimal schema**
   - Add a single placeholder model to `prisma/schema.prisma` (e.g. a `_Health` table with one `id` field)
   - Run `pnpm prisma migrate dev --name init` to apply the migration to the local Postgres DB
   - Confirm `pnpm prisma generate` completes without errors

3. **Health API route**
   - Create `app/api/health/route.ts` as a Next.js Route Handler
   - The handler queries the DB via the Prisma client (e.g. `$queryRaw\`SELECT 1\``)
   - Return `{ status: "ok", db: "connected" }` on success, `{ status: "error", db: "unreachable" }` with a 503 on failure

4. **Prisma client singleton**
   - Add `lib/db.ts` exporting a singleton Prisma client instance (prevents connection exhaustion in dev with Next.js hot reload)

5. **End-to-end verification**
   - Open `http://localhost:3000/api/health` in a browser
   - Confirm JSON response shows `status: "ok"` and `db: "connected"`
   - Confirm no errors in the Next.js server log
