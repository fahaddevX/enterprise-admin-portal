# Validation — Project Scaffolding

This phase is considered complete and mergeable when all of the following are true.

## Checklist

- [ ] `pnpm install` completes with no errors on a clean clone
- [ ] `pnpm dev` starts the Next.js dev server without errors or warnings
- [ ] The default page loads at `http://localhost:3000` in a modern browser
- [ ] A Tailwind utility class (e.g. `text-blue-500`) visibly applies on the page
- [ ] `pnpm lint` exits with code 0
- [ ] `.env.example` exists and documents every key referenced in the codebase
- [ ] `.env.local` is absent from git history and covered by `.gitignore`
- [ ] The directory structure (`app/`, `lib/`, `db/`, `workers/`, `components/`) is in place
- [ ] The `@/` TypeScript path alias resolves correctly (no TS errors)

## Not Required to Merge

- Database connectivity
- Redis connectivity
- Any CI pipeline passing
- Pixel-perfect design
