import { ImportUploadForm } from "@/components/ImportUploadForm";

export default function ImportsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          CSV Import
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Upload a CSV file with <code className="font-mono text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">email</code> and <code className="font-mono text-xs bg-zinc-200 dark:bg-zinc-700 px-1 py-0.5 rounded">name</code> columns to import users.
        </p>
        <ImportUploadForm />
      </div>
    </main>
  );
}
