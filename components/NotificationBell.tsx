"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/Skeleton";
import { useToast } from "@/components/ToastProvider";

type Notification = {
  id: string;
  event: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type NotificationsData = {
  notifications: Notification[];
  unreadCount: number;
};

function isSuccessEvent(event: string) {
  return event.endsWith("_COMPLETED");
}

export function NotificationBell() {
  const [data, setData] = useState<NotificationsData | null>(null);
  const [open, setOpen] = useState(false);
  const lastIdRef = useRef<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const body: NotificationsData = await res.json();

      if (lastIdRef.current !== null && body.notifications.length > 0) {
        const lastSeenIdx = body.notifications.findIndex(
          (n) => n.id === lastIdRef.current
        );
        const newOnes =
          lastSeenIdx === -1
            ? body.notifications.slice(0, 3)
            : body.notifications.slice(0, lastSeenIdx);
        for (const n of [...newOnes].reverse()) {
          addToast(n.message, isSuccessEvent(n.event) ? "success" : "error");
        }
      }

      if (body.notifications.length > 0) {
        lastIdRef.current = body.notifications[0].id;
      }

      setData(body);
    } catch {
      // silent — don't crash the nav on a failed poll
    }
  }, [addToast]);

  useEffect(() => {
    // async fn — setState only fires after await, never synchronously in the effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    const id = setInterval(fetchNotifications, 3000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  async function markAllRead() {
    await fetch("/api/notifications/read-all", { method: "POST" });
    await fetchNotifications();
  }

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div className="relative ml-auto" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg z-40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-zinc-50 dark:divide-zinc-800">
            {data === null ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ) : data.notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
                No notifications yet
              </p>
            ) : (
              data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 ${
                    !n.read ? "bg-zinc-50 dark:bg-zinc-800/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${
                        !n.read ? "bg-blue-500" : "bg-transparent"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
