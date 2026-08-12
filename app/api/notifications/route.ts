import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET() {
  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    db.notification.count({ where: { read: false } }),
  ]);
  return NextResponse.json({ notifications, unreadCount });
}
