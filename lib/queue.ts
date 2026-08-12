import { Queue } from "bullmq";
import IORedis from "ioredis";

const globalForQueue = globalThis as unknown as {
  connection: IORedis | undefined;
  crmSyncQueue: Queue | undefined;
};

export function createConnection(): IORedis {
  return new IORedis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null,
  });
}

export const connection = globalForQueue.connection ?? createConnection();

export const crmSyncQueue =
  globalForQueue.crmSyncQueue ?? new Queue("crm-sync", { connection });

if (process.env.NODE_ENV !== "production") {
  globalForQueue.connection = connection;
  globalForQueue.crmSyncQueue = crmSyncQueue;
}
