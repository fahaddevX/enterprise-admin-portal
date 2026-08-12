import { StatusTable } from "@/components/StatusTable";

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Progress Status
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">
          Live import and CRM sync status. Updates every 3 seconds.
        </p>
        <StatusTable />
      </div>
    </main>
  );
}
