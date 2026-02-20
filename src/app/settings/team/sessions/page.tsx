"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { DataTable, TableSearch } from "@/components/shared";
import { dateTimeCell, statusCell } from "@/lib/utils/columnHelpers";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import type { ColumnDef } from "@tanstack/react-table";

interface Session {
  id: string;
  userName: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  location: string;
  startedAt: string;
  lastActiveAt: string;
  status: "active" | "expired" | "revoked";
}

const mockSessions: Session[] = [
  {
    id: "sess_001",
    userName: "John Doe",
    email: "john@example.com",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome/120.0 (macOS)",
    location: "San Francisco, CA",
    startedAt: "2025-02-20T08:30:00Z",
    lastActiveAt: "2025-02-20T14:45:00Z",
    status: "active",
  },
  {
    id: "sess_002",
    userName: "Jane Smith",
    email: "jane@example.com",
    ipAddress: "203.0.113.45",
    userAgent: "Safari/537.36 (iOS)",
    location: "New York, NY",
    startedAt: "2025-02-19T10:15:00Z",
    lastActiveAt: "2025-02-20T12:30:00Z",
    status: "active",
  },
  {
    id: "sess_003",
    userName: "Bob Johnson",
    email: "bob@example.com",
    ipAddress: "198.51.100.22",
    userAgent: "Firefox/123.0 (Windows)",
    location: "Chicago, IL",
    startedAt: "2025-02-18T14:20:00Z",
    lastActiveAt: "2025-02-20T09:00:00Z",
    status: "active",
  },
  {
    id: "sess_004",
    userName: "Alice Brown",
    email: "alice@example.com",
    ipAddress: "192.0.2.88",
    userAgent: "Chrome/120.0 (macOS)",
    location: "Seattle, WA",
    startedAt: "2025-02-17T11:45:00Z",
    lastActiveAt: "2025-02-19T16:30:00Z",
    status: "expired",
  },
  {
    id: "sess_005",
    userName: "Charlie Wilson",
    email: "charlie@example.com",
    ipAddress: "203.0.113.99",
    userAgent: "Safari/537.36 (iOS)",
    location: "Boston, MA",
    startedAt: "2025-02-16T09:00:00Z",
    lastActiveAt: "2025-02-18T13:20:00Z",
    status: "expired",
  },
  {
    id: "sess_006",
    userName: "Diana Martinez",
    email: "diana@example.com",
    ipAddress: "198.51.100.55",
    userAgent: "Edge/120.0 (Windows)",
    location: "Austin, TX",
    startedAt: "2025-02-15T15:30:00Z",
    lastActiveAt: "2025-02-17T10:45:00Z",
    status: "revoked",
  },
  {
    id: "sess_007",
    userName: "Eve Taylor",
    email: "eve@example.com",
    ipAddress: "192.168.1.50",
    userAgent: "Chrome/120.0 (Linux)",
    location: "Denver, CO",
    startedAt: "2025-02-14T12:00:00Z",
    lastActiveAt: "2025-02-16T14:15:00Z",
    status: "revoked",
  },
  {
    id: "sess_008",
    userName: "Frank Anderson",
    email: "frank@example.com",
    ipAddress: "203.0.113.77",
    userAgent: "Firefox/123.0 (macOS)",
    location: "Portland, OR",
    startedAt: "2025-02-20T07:30:00Z",
    lastActiveAt: "2025-02-20T15:00:00Z",
    status: "active",
  },
  {
    id: "sess_009",
    userName: "Grace Lee",
    email: "grace@example.com",
    ipAddress: "198.51.100.11",
    userAgent: "Safari/537.36 (iOS)",
    location: "Miami, FL",
    startedAt: "2025-02-19T13:45:00Z",
    lastActiveAt: "2025-02-20T11:20:00Z",
    status: "active",
  },
  {
    id: "sess_010",
    userName: "Henry Clark",
    email: "henry@example.com",
    ipAddress: "192.0.2.33",
    userAgent: "Chrome/120.0 (Windows)",
    location: "Phoenix, AZ",
    startedAt: "2025-02-13T10:30:00Z",
    lastActiveAt: "2025-02-15T09:00:00Z",
    status: "expired",
  },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "revoked", label: "Revoked" },
];

const columns: ColumnDef<Session, unknown>[] = [
  {
    accessorKey: "userName",
    header: "User",
    size: 150,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.userName}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    size: 150,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.ipAddress}
      </span>
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    size: 150,
    cell: ({ row }) => (
      <span className="text-[var(--color-text-secondary)]">
        {row.original.location}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    cell: statusCell<Session>((r) => r.status),
  },
  {
    accessorKey: "startedAt",
    header: "Started at (UTC)",
    size: 180,
    cell: dateTimeCell<Session>((r) => r.startedAt),
  },
  {
    accessorKey: "lastActiveAt",
    header: "Last active (UTC)",
    size: 180,
    cell: dateTimeCell<Session>((r) => r.lastActiveAt),
  },
];

export default function TeamSessionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filteredData = useMemo(() => {
    let result = mockSessions;

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (session) =>
          session.userName.toLowerCase().includes(query) ||
          session.email.toLowerCase().includes(query) ||
          session.ipAddress.toLowerCase().includes(query)
      );
    }

    if (statusFilter.length > 0) {
      result = result.filter((session) => statusFilter.includes(session.status));
    }

    return result;
  }, [search, statusFilter]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Sessions"
        actions={
          <Button color="danger" variant="outline" size="md" pill={false}>
            Revoke All
          </Button>
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search sessions..."
            />

            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill
                listMinWidth={180}
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(opts) => setStatusFilter(opts.map((o) => o.value))}
                placeholder="Status"
                variant="outline"
                size="sm"
              />
            </div>
          </>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pt-4 md:px-6">
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "lastActiveAt", desc: true }]}
        />
      </div>
    </div>
  );
}
