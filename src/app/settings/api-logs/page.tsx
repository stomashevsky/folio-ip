"use client";

import { useState, useMemo } from "react";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL } from "@/components/layout/TopBar";
import { TABLE_PAGE_WRAPPER, TABLE_PAGE_CONTENT } from "@/lib/constants/page-layout";
import { DataTable, TableSearch, Modal, ModalHeader, ModalBody, KeyValueTable } from "@/components/shared";
import { ColumnSettings, type ColumnConfig } from "@/components/shared/ColumnSettings";
import { idCell, dateTimeCell } from "@/lib/utils/columnHelpers";
import type { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { Badge } from "@plexui/ui/components/Badge";
import { Select } from "@plexui/ui/components/Select";
import { Button } from "@plexui/ui/components/Button";

interface ApiLog {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  statusCode: number;
  duration: number;
  ipAddress: string;
  apiKeyId: string;
  createdAt: string;
}

const mockApiLogs: ApiLog[] = [
  {
    id: "log_001",
    method: "GET",
    path: "/api/v1/inquiries",
    statusCode: 200,
    duration: 145,
    ipAddress: "192.168.1.100",
    apiKeyId: "key_abc123",
    createdAt: "2025-02-20T14:30:00Z",
  },
  {
    id: "log_002",
    method: "POST",
    path: "/api/v1/inquiries",
    statusCode: 201,
    duration: 320,
    ipAddress: "192.168.1.101",
    apiKeyId: "key_def456",
    createdAt: "2025-02-20T14:29:15Z",
  },
  {
    id: "log_003",
    method: "GET",
    path: "/api/v1/verifications/ver_123",
    statusCode: 200,
    duration: 98,
    ipAddress: "192.168.1.102",
    apiKeyId: "key_abc123",
    createdAt: "2025-02-20T14:28:45Z",
  },
  {
    id: "log_004",
    method: "PUT",
    path: "/api/v1/inquiries/inq_456",
    statusCode: 200,
    duration: 210,
    ipAddress: "192.168.1.103",
    apiKeyId: "key_ghi789",
    createdAt: "2025-02-20T14:27:30Z",
  },
  {
    id: "log_005",
    method: "DELETE",
    path: "/api/v1/workflows/wf_789",
    statusCode: 204,
    duration: 156,
    ipAddress: "192.168.1.104",
    apiKeyId: "key_jkl012",
    createdAt: "2025-02-20T14:26:00Z",
  },
  {
    id: "log_006",
    method: "GET",
    path: "/api/v1/reports",
    statusCode: 200,
    duration: 234,
    ipAddress: "192.168.1.105",
    apiKeyId: "key_abc123",
    createdAt: "2025-02-20T14:25:15Z",
  },
  {
    id: "log_007",
    method: "POST",
    path: "/api/v1/accounts",
    statusCode: 400,
    duration: 89,
    ipAddress: "192.168.1.106",
    apiKeyId: "key_mno345",
    createdAt: "2025-02-20T14:24:00Z",
  },
  {
    id: "log_008",
    method: "GET",
    path: "/api/v1/cases/case_123",
    statusCode: 404,
    duration: 45,
    ipAddress: "192.168.1.107",
    apiKeyId: "key_pqr678",
    createdAt: "2025-02-20T14:23:30Z",
  },
  {
    id: "log_009",
    method: "PATCH",
    path: "/api/v1/verifications/ver_456",
    statusCode: 200,
    duration: 178,
    ipAddress: "192.168.1.108",
    apiKeyId: "key_stu901",
    createdAt: "2025-02-20T14:22:45Z",
  },
  {
    id: "log_010",
    method: "GET",
    path: "/api/v1/accounts/act_789",
    statusCode: 500,
    duration: 1200,
    ipAddress: "192.168.1.109",
    apiKeyId: "key_vwx234",
    createdAt: "2025-02-20T14:21:00Z",
  },
  {
    id: "log_011",
    method: "POST",
    path: "/api/v1/webhooks",
    statusCode: 201,
    duration: 267,
    ipAddress: "192.168.1.110",
    apiKeyId: "key_yz567",
    createdAt: "2025-02-20T14:20:15Z",
  },
  {
    id: "log_012",
    method: "GET",
    path: "/api/v1/transactions",
    statusCode: 200,
    duration: 412,
    ipAddress: "192.168.1.111",
    apiKeyId: "key_abc123",
    createdAt: "2025-02-20T14:19:30Z",
  },
];

const METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

const STATUS_CODE_OPTIONS = [
  { value: "2xx", label: "2xx Success" },
  { value: "4xx", label: "4xx Client Error" },
  { value: "5xx", label: "5xx Server Error" },
];

const COLUMN_CONFIG: ColumnConfig[] = [
  { id: "method", label: "Method" },
  { id: "path", label: "Path" },
  { id: "statusCode", label: "Status Code" },
  { id: "duration", label: "Duration (ms)" },
  { id: "ipAddress", label: "IP Address" },
  { id: "apiKeyId", label: "API Key ID" },
  { id: "createdAt", label: "Created at" },
];

const DEFAULT_VISIBILITY: VisibilityState = {
  method: true,
  path: true,
  statusCode: true,
  duration: true,
  ipAddress: true,
  apiKeyId: false,
  createdAt: true,
};

const columns: ColumnDef<ApiLog, unknown>[] = [
  {
    accessorKey: "method",
    header: "Method",
    size: 100,
    cell: ({ row }) => {
      const method = row.original.method;
      const colorMap: Record<string, "info" | "secondary" | "warning" | "danger"> = {
        GET: "secondary",
        POST: "info",
        PUT: "warning",
        PATCH: "warning",
        DELETE: "danger",
      };
      return (
        <Badge color={colorMap[method]} variant="soft">
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "path",
    header: "Path",
    size: 280,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.path}
      </span>
    ),
  },
  {
    accessorKey: "statusCode",
    header: "Status Code",
    size: 120,
    cell: ({ row }) => {
      const code = row.original.statusCode;
      const colorMap: Record<number, "success" | "warning" | "danger"> = {
        200: "success",
        201: "success",
        204: "success",
        400: "warning",
        404: "warning",
        500: "danger",
      };
      const category = code >= 500 ? "danger" : code >= 400 ? "warning" : "success";
      return (
        <Badge color={colorMap[code] || category} variant="soft">
          {code}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration (ms)",
    size: 120,
    cell: ({ row }) => <span>{row.original.duration}</span>,
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
    size: 140,
    cell: ({ row }) => (
      <span className="font-mono text-[var(--color-text-secondary)]">
        {row.original.ipAddress}
      </span>
    ),
  },
  {
    accessorKey: "apiKeyId",
    header: "API Key ID",
    size: 160,
    cell: idCell<ApiLog>((r) => r.apiKeyId),
  },
  {
    accessorKey: "createdAt",
    header: "Created at (UTC)",
    size: 180,
    cell: dateTimeCell<ApiLog>((r) => r.createdAt),
  },
];

export default function ApiLogsPage() {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string[]>([]);
  const [statusCodeFilter, setStatusCodeFilter] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(DEFAULT_VISIBILITY);
  const [selectedLog, setSelectedLog] = useState<ApiLog | null>(null);

  const hasActiveFilters = methodFilter.length > 0 || statusCodeFilter.length > 0;

  const filteredData = useMemo(() => {
    return mockApiLogs.filter((log) => {
      if (methodFilter.length > 0 && !methodFilter.includes(log.method)) {
        return false;
      }

      if (statusCodeFilter.length > 0) {
        const codeCategory = log.statusCode >= 500 ? "5xx" : log.statusCode >= 400 ? "4xx" : "2xx";
        if (!statusCodeFilter.includes(codeCategory)) {
          return false;
        }
      }

      if (search) {
        const searchLower = search.toLowerCase();
        return (
          log.path.toLowerCase().includes(searchLower) ||
          log.ipAddress.toLowerCase().includes(searchLower) ||
          log.apiKeyId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [methodFilter, statusCodeFilter, search]);

  function clearAllFilters() {
    setMethodFilter([]);
    setStatusCodeFilter([]);
  }

  return (
    <div className={TABLE_PAGE_WRAPPER}>
      <TopBar
        title="API Logs"
        actions={
          <ColumnSettings
            columns={COLUMN_CONFIG}
            visibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
        }
        toolbar={
          <>
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search logs..."
            />

            <div className="w-36">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={METHOD_OPTIONS}
                value={methodFilter}
                onChange={(opts) => setMethodFilter(opts.map((o) => o.value))}
                placeholder="Method"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            <div className="w-48">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={220}
                options={STATUS_CODE_OPTIONS}
                value={statusCodeFilter}
                onChange={(opts) => setStatusCodeFilter(opts.map((o) => o.value))}
                placeholder="Status Code"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            {hasActiveFilters && (
              <Button
                color="secondary"
                variant="soft"
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_TOOLBAR_PILL}
                onClick={clearAllFilters}
              >
                Clear filters
              </Button>
            )}
          </>
        }
      />

      <div className={TABLE_PAGE_CONTENT}>
        <DataTable
          data={filteredData}
          columns={columns}
          globalFilter={search}
          pageSize={50}
          initialSorting={[{ id: "createdAt", desc: true }]}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          onRowClick={setSelectedLog}
          mobileColumnVisibility={{
            ipAddress: false,
            apiKeyId: false,
            duration: false,
          }}
        />
      </div>

      <Modal open={!!selectedLog} onOpenChange={(open) => { if (!open) setSelectedLog(null); }} maxWidth="max-w-lg">
        {selectedLog && (
          <>
            <ModalHeader>
              <h2 className="heading-sm">{selectedLog.method} {selectedLog.path}</h2>
            </ModalHeader>
            <ModalBody>
              <KeyValueTable
                rows={[
                  { label: "Log ID", value: selectedLog.id },
                  { label: "Method", value: selectedLog.method },
                  { label: "Path", value: selectedLog.path },
                  { label: "Status Code", value: String(selectedLog.statusCode) },
                  { label: "Duration", value: `${selectedLog.duration}ms` },
                  { label: "IP Address", value: selectedLog.ipAddress },
                  { label: "API Key ID", value: selectedLog.apiKeyId },
                  { label: "Timestamp", value: new Date(selectedLog.createdAt).toLocaleString() },
                ]}
              />
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  );
}
