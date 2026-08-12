"use client";

import { useState } from "react";

type ImportResult = {
  id: string;
  filename: string;
  status: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
};

export function ImportUploadForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput?.files?.[0]) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const body = new FormData();
      body.append("file", fileInput.files[0]);
      const res = await fetch("/api/imports", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
      } else {
        setResult(data as ImportResult);
        form.reset();
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="file"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
        >
          CSV file
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".csv"
          required
          disabled={loading}
          className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-zinc-900 file:text-white hover:file:bg-zinc-700 dark:file:bg-zinc-50 dark:file:text-zinc-900 dark:hover:file:bg-zinc-200 disabled:opacity-50 cursor-pointer"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
      >
        {loading ? "Uploading…" : "Upload CSV"}
      </button>

      {result && (
        <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 p-4 text-sm space-y-1">
          <p className="font-medium text-green-800 dark:text-green-200">
            Import complete — {result.filename}
          </p>
          <p className="text-green-700 dark:text-green-300">
            {result.processedRows} imported · {result.failedRows} skipped ·{" "}
            {result.totalRows} total
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-4 text-sm">
          <p className="font-medium text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}
    </form>
  );
}
