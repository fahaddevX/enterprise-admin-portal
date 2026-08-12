import { parse } from "csv-parse";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid multipart request" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file field in request" },
      { status: 400 }
    );
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "File is empty" }, { status: 400 });
  }

  const importRecord = await db.import.create({
    data: { filename: file.name, status: "PENDING" },
  });

  await db.import.update({
    where: { id: importRecord.id },
    data: { status: "PROCESSING" },
  });

  let totalRows = 0;
  let processedRows = 0;
  let failedRows = 0;
  let finalStatus: "COMPLETED" | "FAILED" = "COMPLETED";

  try {
    const text = await file.text();
    const parser = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    for await (const row of parser as AsyncIterable<Record<string, string>>) {
      totalRows++;
      const email = (row["email"] ?? "").trim();

      if (!email || !isValidEmail(email)) {
        failedRows++;
        continue;
      }

      const name = (row["name"] ?? "").trim() || null;

      await db.user.upsert({
        where: { email },
        update: { name },
        create: { email, name },
      });

      processedRows++;
    }

    if (totalRows === 0) finalStatus = "FAILED";
  } catch {
    finalStatus = "FAILED";
  }

  const result = await db.import.update({
    where: { id: importRecord.id },
    data: { status: finalStatus, totalRows, processedRows, failedRows },
  });

  return NextResponse.json(result, { status: 201 });
}
