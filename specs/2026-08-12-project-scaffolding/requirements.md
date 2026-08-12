# Requirements — Project Scaffolding

## Scope

Stand up the project skeleton that every subsequent phase builds on. No application features are implemented here — only tooling, configuration, and directory structure.

## Decisions

| Decision | Choice | Reason |
|---|---|---|
| Package manager | pnpm | Fast installs, strict dependency resolution, disk-efficient |
| Framework | Next.js (App Router) | Full-stack TypeScript, built-in API routes, SSR — see `tech-stack.md` |
| Styling | Tailwind CSS | Utility-first; enables the polished UI Steve in marketing requires |
| CI | Deferred | Out of scope for this phase; added in a future phase |
| Env management | `.env.local` + `.env.example` | Keeps secrets local; `.example` documents required keys for onboarding |

## Out of Scope

- Database connection or migrations (Phase 3 — Data model)
- Redis / BullMQ wiring (Phase 4+)
- Any application UI beyond a blank landing page
- CI/CD pipeline configuration

## Context

This phase exists to ensure every engineer starts from an identical, reproducible baseline. The mission demands reliability at scale; a clean scaffold with consistent tooling is the foundation that makes that possible.
