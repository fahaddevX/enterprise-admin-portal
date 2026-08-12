# Requirements — Walking Skeleton

## Scope

Wire every layer of the stack — Next.js → API route → Prisma → PostgreSQL — with the minimum possible code. No real features. The sole output is a `/api/health` endpoint that proves the full path works.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| DB connection | Real PostgreSQL via Prisma | The mission demands reliability at scale; proving the stack works end-to-end early surfaces integration issues before features are built on top |
| Schema | Single placeholder model | Enough to exercise the Prisma client and run a real query; the real schema comes in Phase 3 |
| Endpoint shape | `GET /api/health` returning JSON | No UI needed; the JSON response is readable directly in a browser and easy to automate against later |
| Prisma client | Singleton in `lib/db.ts` | Next.js hot reload creates new module instances on every change — a singleton prevents connection pool exhaustion in development |
| Error handling | 503 with `db: "unreachable"` | Makes misconfiguration immediately obvious without requiring log access |

## Out of Scope

- Any UI page or component (Phase 3+)
- Real data models for users, imports, or sync records (Phase 3 — Data model)
- Auth or session handling
- Redis / BullMQ wiring (Phase 4+)
- CI/CD pipeline

## Context

A walking skeleton exists to de-risk the architecture before features are built on it. The mission requires data operations that are reliable and auditable at scale — which means the database path must be proven trustworthy before CSV import or CRM sync are layered on top.
