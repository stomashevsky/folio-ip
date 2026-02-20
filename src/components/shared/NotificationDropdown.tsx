"use client";

import { useState, useCallback } from "react";
import { Button } from "@plexui/ui/components/Button";
import { Popover } from "@plexui/ui/components/Popover";
import { Bell } from "@plexui/ui/components/Icon";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "inquiry" | "verification" | "report" | "case" | "system";
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Inquiry completed",
    description: "inq_8f2a91c3 has been marked as completed and is ready for review.",
    time: "2 min ago",
    read: false,
    type: "inquiry",
  },
  {
    id: "n2",
    title: "Verification failed",
    description: "Document verification ver_3d9e12 failed due to image quality issues.",
    time: "15 min ago",
    read: false,
    type: "verification",
  },
  {
    id: "n3",
    title: "Report match found",
    description: "Watchlist report rep_7c4b23 returned a potential match for review.",
    time: "1 hour ago",
    read: false,
    type: "report",
  },
  {
    id: "n4",
    title: "Case escalated",
    description: "Case case_91ab45 has been escalated to the senior review queue.",
    time: "3 hours ago",
    read: true,
    type: "case",
  },
  {
    id: "n5",
    title: "Webhook delivery failed",
    description: "Webhook endpoint https://api.example.com/hooks returned 500.",
    time: "5 hours ago",
    read: true,
    type: "system",
  },
];

const TYPE_COLORS: Record<Notification["type"], string> = {
  inquiry: "var(--color-primary-solid-bg)",
  verification: "var(--color-warning-solid-bg)",
  report: "var(--color-danger-solid-bg)",
  case: "var(--color-info-solid-bg)",
  system: "var(--color-text-tertiary)",
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  return (
    <Popover>
      <Popover.Trigger>
        <div className="relative">
          <Button
            color="secondary"
            variant="ghost"
            size="sm"
            uniform
            pill={false}
            aria-label="Notifications"
          >
            <Bell style={{ width: 18, height: 18 }} />
          </Button>
          {unreadCount > 0 && (
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-danger-solid-bg)] px-1 text-[10px] font-bold text-[var(--color-text-inverse)]">
              {unreadCount}
            </span>
          )}
        </div>
      </Popover.Trigger>
      <Popover.Content align="end" sideOffset={8}>
        <div className="w-80">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
            <h3 className="heading-xs">Notifications</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                className="text-xs text-[var(--color-text-primary-ghost)] hover:underline"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--color-nav-hover-bg)] ${
                    !n.read ? "bg-[var(--color-surface-secondary)]" : ""
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: !n.read ? TYPE_COLORS[n.type] : "transparent" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--color-text-secondary)]">
                      {n.description}
                    </p>
                    <p className="mt-1 text-2xs text-[var(--color-text-tertiary)]">
                      {n.time}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}
