import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Dynamic imports ensure dotenv has populated process.env before any
// module-level code in lib/* accesses DATABASE_URL or REDIS_URL.
async function main() {
  const { Worker } = await import("bullmq");
  const { createConnection } = await import("../lib/queue");
  const { db } = await import("../lib/db");
  const { syncToCrm } = await import("../lib/crm");

  const connection = createConnection();

  const worker = new Worker(
    "crm-sync",
    async (job) => {
      const { importId, syncRecordId } = job.data as {
        importId: string;
        syncRecordId: string;
      };

      await db.syncRecord.update({
        where: { id: syncRecordId },
        data: { status: "SYNCING" },
      });

      try {
        const { crmId } = await syncToCrm(importId);
        await db.syncRecord.update({
          where: { id: syncRecordId },
          data: { status: "SYNCED", crmId },
        });
      } catch (err) {
        await db.syncRecord.update({
          where: { id: syncRecordId },
          data: { status: "FAILED" },
        });
        throw err;
      }
    },
    { connection }
  );

  console.log("[worker] CRM sync worker started, waiting for jobs...");

  worker.on("completed", (job) => {
    console.log(`[worker] Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[worker] Job ${job?.id} failed: ${err.message}`);
  });
}

main().catch(console.error);
