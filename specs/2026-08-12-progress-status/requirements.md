# Phase 6 — Progress Status Page: Requirements

## Scope

A single `/status` page that gives operators real-time visibility into every import and its CRM sync state. The page polls the server every 3 seconds and updates the table in place — no manual refresh needed.

## Functional requirements

- `GET /api/status` returns all imports ordered by `createdAt` descending, each with its latest SyncRecord (or null if no sync has been triggered)
- The status table shows: Filename, Import Status, Rows processed/total, CRM Sync Status, CRM ID, and import start time
- Import Status and CRM Sync Status are displayed as colored badge pills matching their enum value (PENDING, PROCESSING, COMPLETED, FAILED, SYNCING, SYNCED)
- The table auto-refreshes every 3 seconds via `setInterval`; the interval is cleared on component unmount
- A loading state is shown on the first fetch; fetch errors surface as an inline message rather than crashing the page

## Out of scope

- Server-Sent Events or WebSocket streaming (deferred to a future phase if needed)
- Filtering, sorting, or pagination (data volumes are small in this phase)
- Per-import detail drill-down pages
- Manual sync trigger controls on this page (sync is triggered via the existing `/api/sync/:importId` endpoint)

## Key decisions

| Decision | Choice | Reason |
|---|---|---|
| Real-time mechanism | Polling every 3 s | Simple, no extra dependencies, sufficient for operator use |
| Page structure | Single `/status` page | One place to check all operational state |
| Data fetch | Client-side via `setInterval` in a `"use client"` component | Keeps the page lightweight; no SSE or WebSocket plumbing |

## Context

Phase 5 introduced the CRM sync queue and `SyncRecord` model. This phase surfaces those records in a UI. The mission calls for "real-time operational visibility" — polling at 3-second intervals satisfies that for the current scale.
