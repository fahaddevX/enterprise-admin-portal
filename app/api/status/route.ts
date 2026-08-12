import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  const imports = await db.import.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      syncRecords: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const data = imports.map((imp) => ({
    id: imp.id,
    filename: imp.filename,
    status: imp.status,
    totalRows: imp.totalRows,
    processedRows: imp.processedRows,
    failedRows: imp.failedRows,
    createdAt: imp.createdAt,
    syncRecord: imp.syncRecords[0] ?? null,
  }));

  return NextResponse.json(data);
}
