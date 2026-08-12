"use client";

import { useCallback, useEffect, useState } from "react";

type SyncRecord = {
  id: string;
  status: string;
  crmId: string | null;
  createdAt: string;
};

type ImportRow = {
  id: string;
  filename: string;
  status: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
  createdAt: string;
  syncRecord: SyncRecord | null;
};

const IMPORT_BADGE: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  COMPLETED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const SYNC_BADGE: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  SYNCING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SYNCED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  FAILED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function Badge({
  status,
  map,
}: {
  status: string;
  map: Record<string, string>;
}) {
  const cls =
    map[status] ??
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {status}
    </span>
  );
}

export function StatusTable() {
  const [rows, setRows] = useState<ImportRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<Set<string>>(new Set());

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRows(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load status");
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 3000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  async function triggerSync(importId: string) {
    setSyncing((prev) => new Set(prev).add(importId));
    try {
      await fetch(`/api/sync/${importId}`, { method: "POST" });
      await fetchStatus();
    } finally {
      setSyncing((prev) => {
        const next = new Set(prev);
        next.delete(importId);
        return next;
      });
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4 text-sm">
        <p className="font-medium text-red-800 dark:text-red-200">
          Failed to load status: {error}
        </p>
      </div>
    );
  }

  if (rows === null) {
    return (
      <div className="animate-pulse space-y-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-10 rounded bg-zinc-200 dark:bg-zinc-700"
          />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">
        No imports yet.{" "}
        <a href="/imports" className="underline hover:text-zinc-700">
          Upload a CSV
        </a>{" "}
        to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 text-sm">
        <thead className="bg-zinc-100 dark:bg-zinc-800">
          <tr>
            {["Filename", "Import Status", "Rows", "CRM Status", "CRM ID", "Started"].map(
              (col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 max-w-[200px] truncate">
                {row.filename}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge status={row.status} map={IMPORT_BADGE} />
              </td>
              <td className="px-4 py-3 tabular-nums text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                {row.processedRows}/{row.totalRows}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {row.syncRecord ? (
                  <Badge status={row.syncRecord.status} map={SYNC_BADGE} />
                ) : row.status === "COMPLETED" ? (
                  <button
                    onClick={() => triggerSync(row.id)}
                    disabled={syncing.has(row.id)}
                    className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 transition-colors"
                  >
                    {syncing.has(row.id) ? "Syncing…" : "Sync to CRM"}
                  </button>
                ) : (
                  <span className="text-zinc-300 dark:text-zinc-600 text-xs">
                    —
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-zinc-500 dark:text-zinc-500 max-w-[160px] truncate">
                {row.syncRecord?.crmId ?? (
                  <span className="text-zinc-300 dark:text-zinc-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs tabular-nums text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                {new Date(row.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
