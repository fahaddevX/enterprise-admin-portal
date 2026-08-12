import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { crmSyncQueue } from "@/lib/queue";

type Params = Promise<{ importId: string }>;

export async function POST(_request: NextRequest, { params }: { params: Params }) {
  const { importId } = await params;

  const importRecord = await db.import.findUnique({ where: { id: importId } });
  if (!importRecord) {
    return NextResponse.json({ error: "Import not found" }, { status: 404 });
  }
  if (importRecord.status !== "COMPLETED") {
    return NextResponse.json(
      { error: `Import is not completed (status: ${importRecord.status})` },
      { status: 409 }
    );
  }

  const syncRecord = await db.syncRecord.create({
    data: { importId, status: "PENDING" },
  });

  await crmSyncQueue.add("sync", { importId, syncRecordId: syncRecord.id });

  return NextResponse.json(syncRecord, { status: 202 });
}

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { importId } = await params;

  const syncRecord = await db.syncRecord.findFirst({
    where: { importId },
    orderBy: { createdAt: "desc" },
  });

  if (!syncRecord) {
    return NextResponse.json(
      { error: "No sync record found for this import" },
      { status: 404 }
    );
  }

  return NextResponse.json(syncRecord);
}
