"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-red-800 text-white text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
