-- CreateEnum
CREATE TYPE "NotificationEvent" AS ENUM ('IMPORT_COMPLETED', 'IMPORT_FAILED', 'SYNC_COMPLETED', 'SYNC_FAILED');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "event" "NotificationEvent" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
