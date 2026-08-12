# Plan — Data Model

Numbered task groups in execution order. Complete each group before moving to the next.

1. **Remove Phase 2 placeholder**
   - Delete the `Health` model from `prisma/schema.prisma`
   - This will be cleaned up in the same migration that introduces the real models

2. **Define domain models**
   - Add `User` model: the enterprise users being imported and managed
   - Add `Import` model: represents one CSV import job, with a status lifecycle enum
   - Add `SyncRecord` model: tracks the CRM sync state for a given import
   - Wire foreign-key relations: `SyncRecord` → `Import`, `Import` → `User` (initiator)

3. **Apply migration**
   - Run `pnpm prisma migrate dev --name domain-models` to apply all changes in one migration
   - Confirm the migration SQL is clean and matches the schema intent

4. **Regenerate client**
   - Run `pnpm prisma generate` to regenerate the TypeScript client with the new models
   - Confirm `lib/generated/prisma/client.ts` reflects all new types and enums

5. **Type-check the project**
   - Run `pnpm build` (or `tsc --noEmit`) and confirm exit code 0
   - Fix any type errors surfaced by the new schema before marking this phase done
