"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TopBar, TOPBAR_CONTROL_SIZE, TOPBAR_TOOLBAR_PILL, TOPBAR_ACTION_PILL } from "@/components/layout/TopBar";
import { MetricCard, SectionHeading, TableSearch } from "@/components/shared";
import { Badge } from "@plexui/ui/components/Badge";
import { Button } from "@plexui/ui/components/Button";
import { Select } from "@plexui/ui/components/Select";
import { Input } from "@plexui/ui/components/Input";
import { Switch } from "@plexui/ui/components/Switch";
import { Tabs } from "@plexui/ui/components/Tabs";
import {
  CloseBold,
  CollapseLg,
  ExpandMd,
  PlayCircle,
  Reload,
  SettingsCog,
  Warning,
} from "@plexui/ui/components/Icon";
import { formatDateTime } from "@/lib/utils/format";

interface GraphConnection {
  id: string;
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationship: string;
  strength: number;
  riskLevel?: "low" | "medium" | "high";
  clusterId?: string;
  createdAt: string;
}

interface GraphEntity {
  type: string;
  id: string;
  riskLevel?: "low" | "medium" | "high";
  clusterId?: string;
  createdAt?: string;
}

const NODE_STYLES: Record<string, { background: string; border: string; color: string }> = {
  account: { background: "#dbeafe", border: "#3b82f6", color: "#1e40af" },
  inquiry: { background: "#ede9fe", border: "#8b5cf6", color: "#5b21b6" },
  verification: { background: "#dcfce7", border: "#22c55e", color: "#166534" },
  device: { background: "#fef9c3", border: "#eab308", color: "#854d0e" },
  ip_address: { background: "#ffedd5", border: "#f97316", color: "#9a3412" },
  email: { background: "#e0f2fe", border: "#06b6d4", color: "#155e75" },
};

type BadgeColor = "info" | "discovery" | "success" | "warning" | "caution" | "secondary" | "danger";

const BADGE_COLORS: Record<string, BadgeColor> = {
  account: "info",
  inquiry: "discovery",
  verification: "success",
  device: "warning",
  ip_address: "caution",
  email: "info",
};

function badgeColor(key: string): BadgeColor {
  return BADGE_COLORS[key] ?? "secondary";
}

const ENTITY_TYPE_OPTIONS = [
  { value: "account", label: "Account" },
  { value: "inquiry", label: "Inquiry" },
  { value: "verification", label: "Verification" },
  { value: "device", label: "Device" },
  { value: "ip_address", label: "IP Address" },
  { value: "email", label: "Email" },
];

const RELATIONSHIP_TYPE_OPTIONS = [
  { value: "owns", label: "Owns" },
  { value: "submitted", label: "Submitted" },
  { value: "verified_by", label: "Verified by" },
  { value: "same_device", label: "Same Device" },
  { value: "same_ip", label: "Same IP" },
  { value: "same_email", label: "Same Email" },
  { value: "linked_to", label: "Linked to" },
  { value: "flagged_by", label: "Flagged by" },
  { value: "similar_document", label: "Similar Document" },
];

const RISK_COLORS: Record<string, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const MOCK_CONNECTIONS: GraphConnection[] = [
  // ── Cluster: "clean_onboarding" — Normal user, clean KYC ──
  { id: "c001", sourceType: "account", sourceId: "act_8f3a2b", targetType: "inquiry", targetId: "inq_d41f0c", relationship: "owns", strength: 0.97, riskLevel: "low", clusterId: "clean_onboarding", createdAt: "2025-02-18T09:12:00Z" },
  { id: "c002", sourceType: "inquiry", sourceId: "inq_d41f0c", targetType: "verification", targetId: "ver_selfie_01", relationship: "submitted", strength: 0.95, riskLevel: "low", clusterId: "clean_onboarding", createdAt: "2025-02-18T09:13:30Z" },
  { id: "c003", sourceType: "inquiry", sourceId: "inq_d41f0c", targetType: "verification", targetId: "ver_govid_01", relationship: "submitted", strength: 0.93, riskLevel: "low", clusterId: "clean_onboarding", createdAt: "2025-02-18T09:14:00Z" },
  { id: "c004", sourceType: "device", sourceId: "dev_iphone15", targetType: "account", targetId: "act_8f3a2b", relationship: "same_device", strength: 0.99, riskLevel: "low", clusterId: "clean_onboarding", createdAt: "2025-02-18T09:10:00Z" },
  { id: "c005", sourceType: "email", sourceId: "eml_proton_01", targetType: "account", targetId: "act_8f3a2b", relationship: "same_email", strength: 0.99, riskLevel: "low", clusterId: "clean_onboarding", createdAt: "2025-02-18T09:09:00Z" },

  // ── Cluster: "fraud_ring_synthetic" — Synthetic identity ring: 5 fake accounts, shared infra ──
  { id: "c010", sourceType: "account", sourceId: "act_syn_01", targetType: "account", targetId: "act_syn_02", relationship: "same_ip", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:22:00Z" },
  { id: "c011", sourceType: "account", sourceId: "act_syn_02", targetType: "account", targetId: "act_syn_03", relationship: "same_device", strength: 0.91, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:23:00Z" },
  { id: "c012", sourceType: "account", sourceId: "act_syn_03", targetType: "account", targetId: "act_syn_04", relationship: "same_ip", strength: 0.89, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:24:00Z" },
  { id: "c013", sourceType: "account", sourceId: "act_syn_04", targetType: "account", targetId: "act_syn_05", relationship: "same_device", strength: 0.92, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:25:00Z" },
  { id: "c014", sourceType: "account", sourceId: "act_syn_05", targetType: "account", targetId: "act_syn_01", relationship: "same_ip", strength: 0.88, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:26:00Z" },
  { id: "c015", sourceType: "device", sourceId: "dev_emulator_01", targetType: "account", targetId: "act_syn_01", relationship: "same_device", strength: 0.97, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:20:00Z" },
  { id: "c016", sourceType: "device", sourceId: "dev_emulator_01", targetType: "account", targetId: "act_syn_03", relationship: "same_device", strength: 0.96, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:20:30Z" },
  { id: "c017", sourceType: "device", sourceId: "dev_emulator_01", targetType: "account", targetId: "act_syn_05", relationship: "same_device", strength: 0.95, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:21:00Z" },
  { id: "c018", sourceType: "device", sourceId: "dev_emulator_02", targetType: "account", targetId: "act_syn_02", relationship: "same_device", strength: 0.96, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:21:30Z" },
  { id: "c019", sourceType: "device", sourceId: "dev_emulator_02", targetType: "account", targetId: "act_syn_04", relationship: "same_device", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:22:00Z" },
  { id: "c020", sourceType: "ip_address", sourceId: "ip_vpn_exit_01", targetType: "account", targetId: "act_syn_01", relationship: "same_ip", strength: 0.93, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:19:00Z" },
  { id: "c021", sourceType: "ip_address", sourceId: "ip_vpn_exit_01", targetType: "account", targetId: "act_syn_02", relationship: "same_ip", strength: 0.92, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:19:30Z" },
  { id: "c022", sourceType: "ip_address", sourceId: "ip_vpn_exit_01", targetType: "account", targetId: "act_syn_04", relationship: "same_ip", strength: 0.90, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:20:00Z" },
  { id: "c023", sourceType: "ip_address", sourceId: "ip_vpn_exit_02", targetType: "account", targetId: "act_syn_03", relationship: "same_ip", strength: 0.91, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:20:30Z" },
  { id: "c024", sourceType: "ip_address", sourceId: "ip_vpn_exit_02", targetType: "account", targetId: "act_syn_05", relationship: "same_ip", strength: 0.89, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:21:00Z" },
  { id: "c025", sourceType: "email", sourceId: "eml_tempmail_01", targetType: "account", targetId: "act_syn_01", relationship: "same_email", strength: 0.98, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:18:00Z" },
  { id: "c026", sourceType: "email", sourceId: "eml_tempmail_01", targetType: "account", targetId: "act_syn_03", relationship: "same_email", strength: 0.97, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:18:30Z" },
  { id: "c027", sourceType: "account", sourceId: "act_syn_01", targetType: "inquiry", targetId: "inq_syn_01", relationship: "owns", strength: 0.95, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:30:00Z" },
  { id: "c028", sourceType: "account", sourceId: "act_syn_02", targetType: "inquiry", targetId: "inq_syn_02", relationship: "owns", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:31:00Z" },
  { id: "c029", sourceType: "account", sourceId: "act_syn_04", targetType: "inquiry", targetId: "inq_syn_04", relationship: "owns", strength: 0.93, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:32:00Z" },
  { id: "c030", sourceType: "inquiry", sourceId: "inq_syn_01", targetType: "verification", targetId: "ver_fake_dl_01", relationship: "submitted", strength: 0.92, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:33:00Z" },
  { id: "c031", sourceType: "inquiry", sourceId: "inq_syn_02", targetType: "verification", targetId: "ver_fake_dl_02", relationship: "submitted", strength: 0.90, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:34:00Z" },
  { id: "c032", sourceType: "verification", sourceId: "ver_fake_dl_01", targetType: "verification", targetId: "ver_fake_dl_02", relationship: "similar_document", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_synthetic", createdAt: "2025-02-17T03:35:00Z" },

  // ── Cluster: "velocity_abuse" — Same person, rapid-fire inquiries from datacenter ──
  { id: "c040", sourceType: "account", sourceId: "act_velocity", targetType: "inquiry", targetId: "inq_rapid_01", relationship: "owns", strength: 0.96, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T14:00:00Z" },
  { id: "c041", sourceType: "account", sourceId: "act_velocity", targetType: "inquiry", targetId: "inq_rapid_02", relationship: "owns", strength: 0.96, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T14:00:12Z" },
  { id: "c042", sourceType: "account", sourceId: "act_velocity", targetType: "inquiry", targetId: "inq_rapid_03", relationship: "owns", strength: 0.96, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T14:00:24Z" },
  { id: "c043", sourceType: "account", sourceId: "act_velocity", targetType: "inquiry", targetId: "inq_rapid_04", relationship: "owns", strength: 0.96, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T14:00:36Z" },
  { id: "c044", sourceType: "ip_address", sourceId: "ip_datacenter", targetType: "account", targetId: "act_velocity", relationship: "same_ip", strength: 0.85, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T13:59:00Z" },
  { id: "c045", sourceType: "device", sourceId: "dev_headless", targetType: "account", targetId: "act_velocity", relationship: "same_device", strength: 0.88, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T13:58:00Z" },
  { id: "c046", sourceType: "inquiry", sourceId: "inq_rapid_01", targetType: "verification", targetId: "ver_rapid_01", relationship: "submitted", strength: 0.91, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T14:01:00Z" },
  { id: "c047", sourceType: "inquiry", sourceId: "inq_rapid_02", targetType: "verification", targetId: "ver_rapid_02", relationship: "submitted", strength: 0.89, riskLevel: "medium", clusterId: "velocity_abuse", createdAt: "2025-02-19T14:01:30Z" },

  // ── Cluster: "fraud_ring_docmill" — Document forgery mill: shared templates ──
  { id: "c050", sourceType: "account", sourceId: "act_mill_01", targetType: "inquiry", targetId: "inq_mill_01", relationship: "owns", strength: 0.95, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:00:00Z" },
  { id: "c051", sourceType: "account", sourceId: "act_mill_02", targetType: "inquiry", targetId: "inq_mill_02", relationship: "owns", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:05:00Z" },
  { id: "c052", sourceType: "account", sourceId: "act_mill_03", targetType: "inquiry", targetId: "inq_mill_03", relationship: "owns", strength: 0.93, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:10:00Z" },
  { id: "c053", sourceType: "inquiry", sourceId: "inq_mill_01", targetType: "verification", targetId: "ver_forged_01", relationship: "submitted", strength: 0.92, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:15:00Z" },
  { id: "c054", sourceType: "inquiry", sourceId: "inq_mill_02", targetType: "verification", targetId: "ver_forged_02", relationship: "submitted", strength: 0.91, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:16:00Z" },
  { id: "c055", sourceType: "inquiry", sourceId: "inq_mill_03", targetType: "verification", targetId: "ver_forged_03", relationship: "submitted", strength: 0.90, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:17:00Z" },
  { id: "c056", sourceType: "verification", sourceId: "ver_forged_01", targetType: "verification", targetId: "ver_forged_02", relationship: "similar_document", strength: 0.96, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:20:00Z" },
  { id: "c057", sourceType: "verification", sourceId: "ver_forged_02", targetType: "verification", targetId: "ver_forged_03", relationship: "similar_document", strength: 0.95, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:21:00Z" },
  { id: "c058", sourceType: "verification", sourceId: "ver_forged_01", targetType: "verification", targetId: "ver_forged_03", relationship: "similar_document", strength: 0.93, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T11:22:00Z" },
  { id: "c059", sourceType: "device", sourceId: "dev_mill_tablet", targetType: "account", targetId: "act_mill_01", relationship: "same_device", strength: 0.95, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T10:55:00Z" },
  { id: "c060", sourceType: "device", sourceId: "dev_mill_tablet", targetType: "account", targetId: "act_mill_02", relationship: "same_device", strength: 0.94, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T10:56:00Z" },
  { id: "c061", sourceType: "device", sourceId: "dev_mill_tablet", targetType: "account", targetId: "act_mill_03", relationship: "same_device", strength: 0.93, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T10:57:00Z" },
  { id: "c062", sourceType: "ip_address", sourceId: "ip_cafe_wifi", targetType: "account", targetId: "act_mill_01", relationship: "same_ip", strength: 0.88, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T10:54:00Z" },
  { id: "c063", sourceType: "ip_address", sourceId: "ip_cafe_wifi", targetType: "account", targetId: "act_mill_02", relationship: "same_ip", strength: 0.87, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T10:54:30Z" },
  { id: "c064", sourceType: "ip_address", sourceId: "ip_cafe_wifi", targetType: "account", targetId: "act_mill_03", relationship: "same_ip", strength: 0.86, riskLevel: "high", clusterId: "fraud_ring_docmill", createdAt: "2025-02-16T10:55:00Z" },

  // ── Cluster: "shared_household" — Legitimate shared IP (family), medium risk ──
  { id: "c070", sourceType: "account", sourceId: "act_parent", targetType: "inquiry", targetId: "inq_parent", relationship: "owns", strength: 0.97, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T18:00:00Z" },
  { id: "c071", sourceType: "account", sourceId: "act_teen", targetType: "inquiry", targetId: "inq_teen", relationship: "owns", strength: 0.96, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T19:30:00Z" },
  { id: "c072", sourceType: "ip_address", sourceId: "ip_home_router", targetType: "account", targetId: "act_parent", relationship: "same_ip", strength: 0.80, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T17:55:00Z" },
  { id: "c073", sourceType: "ip_address", sourceId: "ip_home_router", targetType: "account", targetId: "act_teen", relationship: "same_ip", strength: 0.78, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T19:25:00Z" },
  { id: "c074", sourceType: "inquiry", sourceId: "inq_parent", targetType: "verification", targetId: "ver_parent_id", relationship: "submitted", strength: 0.94, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T18:05:00Z" },
  { id: "c075", sourceType: "inquiry", sourceId: "inq_teen", targetType: "verification", targetId: "ver_teen_id", relationship: "submitted", strength: 0.92, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T19:35:00Z" },
  { id: "c076", sourceType: "device", sourceId: "dev_family_ipad", targetType: "account", targetId: "act_parent", relationship: "same_device", strength: 0.75, riskLevel: "medium", clusterId: "shared_household", createdAt: "2025-02-15T18:01:00Z" },
  { id: "c077", sourceType: "device", sourceId: "dev_family_ipad", targetType: "account", targetId: "act_teen", relationship: "same_device", strength: 0.73, riskLevel: "medium", clusterId: "shared_household", createdAt: "2025-02-15T19:31:00Z" },
  { id: "c078", sourceType: "email", sourceId: "eml_parent", targetType: "account", targetId: "act_parent", relationship: "same_email", strength: 0.99, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T17:50:00Z" },
  { id: "c079", sourceType: "email", sourceId: "eml_teen", targetType: "account", targetId: "act_teen", relationship: "same_email", strength: 0.99, riskLevel: "low", clusterId: "shared_household", createdAt: "2025-02-15T19:20:00Z" },

  // ── Cluster: "business_bulk" — Business doing bulk verifications, clean ──
  { id: "c080", sourceType: "account", sourceId: "act_corp_hr", targetType: "inquiry", targetId: "inq_hire_01", relationship: "owns", strength: 0.98, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T10:00:00Z" },
  { id: "c081", sourceType: "account", sourceId: "act_corp_hr", targetType: "inquiry", targetId: "inq_hire_02", relationship: "owns", strength: 0.98, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T10:05:00Z" },
  { id: "c082", sourceType: "account", sourceId: "act_corp_hr", targetType: "inquiry", targetId: "inq_hire_03", relationship: "owns", strength: 0.98, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T10:10:00Z" },
  { id: "c083", sourceType: "inquiry", sourceId: "inq_hire_01", targetType: "verification", targetId: "ver_bgcheck_01", relationship: "submitted", strength: 0.95, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T10:15:00Z" },
  { id: "c084", sourceType: "inquiry", sourceId: "inq_hire_02", targetType: "verification", targetId: "ver_bgcheck_02", relationship: "submitted", strength: 0.94, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T10:20:00Z" },
  { id: "c085", sourceType: "inquiry", sourceId: "inq_hire_03", targetType: "verification", targetId: "ver_bgcheck_03", relationship: "submitted", strength: 0.93, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T10:25:00Z" },
  { id: "c086", sourceType: "ip_address", sourceId: "ip_corp_office", targetType: "account", targetId: "act_corp_hr", relationship: "same_ip", strength: 0.99, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T09:55:00Z" },
  { id: "c087", sourceType: "email", sourceId: "eml_corp_hr", targetType: "account", targetId: "act_corp_hr", relationship: "same_email", strength: 0.99, riskLevel: "low", clusterId: "business_bulk", createdAt: "2025-02-20T09:50:00Z" },

  // ── Cross-cluster bridges — These reveal hidden connections ──
  { id: "c090", sourceType: "ip_address", sourceId: "ip_vpn_exit_01", targetType: "account", targetId: "act_mill_02", relationship: "same_ip", strength: 0.62, riskLevel: "high", createdAt: "2025-02-18T02:30:00Z" },
  { id: "c091", sourceType: "device", sourceId: "dev_emulator_02", targetType: "account", targetId: "act_velocity", relationship: "same_device", strength: 0.58, riskLevel: "high", createdAt: "2025-02-19T01:15:00Z" },
  { id: "c092", sourceType: "account", sourceId: "act_syn_03", targetType: "account", targetId: "act_mill_01", relationship: "linked_to", strength: 0.52, riskLevel: "high", createdAt: "2025-02-17T16:00:00Z" },
];

const SAMPLE_QUERIES = [
  { label: "Synthetic identity rings", query: "MATCH (a1:Account)-[:SAME_IP|SAME_DEVICE]-(a2:Account) WHERE a1 <> a2 RETURN CLUSTER" },
  { label: "Document forgery clusters", query: "MATCH (v1:Verification)-[:SIMILAR_DOCUMENT]-(v2:Verification) RETURN v1, v2 WITH ACCOUNTS" },
  { label: "Shared emulators", query: "MATCH (d:Device)-[:SAME_DEVICE]-(a:Account) WHERE d.type = 'emulator' AND COUNT(a) > 2 RETURN d, a" },
  { label: "Cross-cluster bridges", query: "MATCH (a1)-[r]-(a2) WHERE a1.cluster <> a2.cluster RETURN a1, r, a2" },
];

interface GraphLayoutConfig {
  clusterSpacing: number;
  nodeRadiusBase: number;
  nodeRadiusMult: number;
  edgeType: string;
}

const DEFAULT_LAYOUT: GraphLayoutConfig = {
  clusterSpacing: 700,
  nodeRadiusBase: 160,
  nodeRadiusMult: 20,
  edgeType: "smoothstep",
};

function buildGraph(
  connections: GraphConnection[],
  highlightCluster?: string | null,
  layout: GraphLayoutConfig = DEFAULT_LAYOUT,
): { nodes: Node[]; edges: Edge[]; entities: Map<string, GraphEntity> } {
  const entityMap = new Map<string, GraphEntity>();

  for (const conn of connections) {
    const srcKey = `${conn.sourceType}:${conn.sourceId}`;
    const tgtKey = `${conn.targetType}:${conn.targetId}`;
    if (!entityMap.has(srcKey)) {
      entityMap.set(srcKey, {
        type: conn.sourceType,
        id: conn.sourceId,
        riskLevel: conn.riskLevel,
        clusterId: conn.clusterId,
        createdAt: conn.createdAt,
      });
    }
    if (!entityMap.has(tgtKey)) {
      entityMap.set(tgtKey, {
        type: conn.targetType,
        id: conn.targetId,
        riskLevel: conn.riskLevel,
        clusterId: conn.clusterId,
        createdAt: conn.createdAt,
      });
    }
  }

  const entities = Array.from(entityMap.entries());

  const clusterMap = new Map<string, string[]>();
  for (const [key, entity] of entities) {
    const cluster = entity.clusterId ?? "unclustered";
    if (!clusterMap.has(cluster)) clusterMap.set(cluster, []);
    clusterMap.get(cluster)!.push(key);
  }

  const clusterCenters: Record<string, { x: number; y: number }> = {};
  const clusters = Array.from(clusterMap.keys());
  clusters.forEach((cluster, ci) => {
    const col = ci % 3;
    const row = Math.floor(ci / 3);
    clusterCenters[cluster] = {
      x: col * layout.clusterSpacing + 350,
      y: row * layout.clusterSpacing + 300,
    };
  });

  const nodes: Node[] = entities.map(([key, entity]) => {
    const cluster = entity.clusterId ?? "unclustered";
    const clusterMembers = clusterMap.get(cluster) ?? [];
    const idx = clusterMembers.indexOf(key);
    const center = clusterCenters[cluster] ?? { x: 400, y: 300 };
    const radius = layout.nodeRadiusBase + clusterMembers.length * layout.nodeRadiusMult;
    const angle = (2 * Math.PI * idx) / clusterMembers.length - Math.PI / 2;

    const style = NODE_STYLES[entity.type] ?? NODE_STYLES.account;
    const isFraudRing = cluster.startsWith("fraud_ring");
    const isHighlighted = highlightCluster
      ? highlightCluster === "__fraud_rings__" ? isFraudRing : cluster === highlightCluster
      : false;
    const isDimmed = highlightCluster ? !isHighlighted : false;

    return {
      id: key,
      position: {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      },
      data: {
        label: `${entity.type}\n${entity.id}`,
        entityType: entity.type,
        entityId: entity.id,
        riskLevel: entity.riskLevel,
        clusterId: cluster,
      },
      style: {
        background: style.background,
        color: style.color,
        borderWidth: isFraudRing ? "2.5px" : "1.5px",
        borderStyle: "solid",
        borderColor: isFraudRing ? "var(--color-danger-solid-bg)" : style.border,
        borderRadius: "10px",
        padding: "10px 14px",
        fontSize: "12px",
        fontWeight: 500,
        width: 140,
        textAlign: "center" as const,
        lineHeight: "1.5",
        opacity: isDimmed ? 0.15 : 1,
        boxShadow: isFraudRing && isHighlighted ? "0 0 12px var(--color-danger-solid-bg)" : undefined,
        transition: "opacity 200ms, box-shadow 200ms",
      },
    };
  });

  const edges: Edge[] = connections.map((conn) => {
    const isFraud = conn.clusterId?.startsWith("fraud_ring");
    const isDimmed = highlightCluster
      ? highlightCluster === "__fraud_rings__" ? !isFraud : conn.clusterId !== highlightCluster
      : false;

    return {
      id: conn.id,
      source: `${conn.sourceType}:${conn.sourceId}`,
      target: `${conn.targetType}:${conn.targetId}`,
      type: layout.edgeType,
      animated: conn.strength > 0.85 || !!isFraud,
      style: {
        stroke: isFraud
          ? "var(--color-danger-solid-bg)"
          : "var(--color-text-tertiary)",
        strokeWidth: Math.max(1, conn.strength * 2.5),
        opacity: isDimmed ? 0.1 : 1,
        transition: "opacity 200ms",
      },
    };
  });

  return { nodes, edges, entities: entityMap };
}

function detectClusters(connections: GraphConnection[]): {
  id: string;
  nodeCount: number;
  edgeCount: number;
  avgRisk: string;
  isFraudRing: boolean;
}[] {
  const clusterNodes = new Map<string, Set<string>>();
  const clusterEdges = new Map<string, number>();
  const clusterRisks = new Map<string, string[]>();

  for (const conn of connections) {
    if (!conn.clusterId) continue;
    const cluster = conn.clusterId;
    if (!clusterNodes.has(cluster)) clusterNodes.set(cluster, new Set());
    clusterNodes.get(cluster)!.add(`${conn.sourceType}:${conn.sourceId}`);
    clusterNodes.get(cluster)!.add(`${conn.targetType}:${conn.targetId}`);
    clusterEdges.set(cluster, (clusterEdges.get(cluster) ?? 0) + 1);
    if (conn.riskLevel) {
      if (!clusterRisks.has(cluster)) clusterRisks.set(cluster, []);
      clusterRisks.get(cluster)!.push(conn.riskLevel);
    }
  }

  return Array.from(clusterNodes.entries()).map(([id, nodes]) => {
    const risks = clusterRisks.get(id) ?? [];
    const highCount = risks.filter((r) => r === "high").length;
    const medCount = risks.filter((r) => r === "medium").length;
    const avgRisk = highCount > risks.length / 2 ? "high" : medCount > risks.length / 2 ? "medium" : "low";

    return {
      id,
      nodeCount: nodes.size,
      edgeCount: clusterEdges.get(id) ?? 0,
      avgRisk,
      isFraudRing: id.startsWith("fraud_ring"),
    };
  });
}

const EDGE_TYPE_OPTIONS = [
  { value: "smoothstep", label: "Smooth Step" },
  { value: "default", label: "Bezier" },
  { value: "straight", label: "Straight" },
  { value: "step", label: "Step" },
];

const BG_VARIANT_OPTIONS = [
  { value: "dots", label: "Dots" },
  { value: "lines", label: "Lines" },
  { value: "cross", label: "Cross" },
];

const BG_VARIANT_MAP: Record<string, BackgroundVariant> = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
};

const MINIMAP_COLORS: Record<string, string> = {
  account: "#3b82f6",
  inquiry: "#8b5cf6",
  verification: "#22c55e",
  device: "#eab308",
  ip_address: "#f97316",
  email: "#06b6d4",
};

function miniMapNodeColor(node: Node) {
  return MINIMAP_COLORS[String(node.data?.entityType ?? "")] ?? "#e5e7eb";
}

interface GraphCanvasProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  snapToGrid: boolean;
  snapGrid: [number, number];
  bgGap: number;
  bgVariant: BackgroundVariant;
  showMiniMap: boolean;
  fitViewKey: number;
  onNodeClick: NodeMouseHandler;
  onPaneClick: () => void;
}

function GraphCanvas({
  initialNodes,
  initialEdges,
  snapToGrid,
  snapGrid,
  bgGap,
  bgVariant,
  showMiniMap,
  fitViewKey,
  onNodeClick,
  onPaneClick,
}: GraphCanvasProps) {
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(initialNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();

  useEffect(() => { setRfNodes(initialNodes); }, [initialNodes, setRfNodes]);
  useEffect(() => { setRfEdges(initialEdges); }, [initialEdges, setRfEdges]);

  useEffect(() => {
    if (fitViewKey > 0) {
      setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 50);
    }
  }, [fitViewKey, fitView]);

  return (
    <ReactFlow
      nodes={rfNodes}
      edges={rfEdges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
      maxZoom={2.5}
      zoomOnScroll={false}
      zoomOnPinch
      zoomOnDoubleClick
      preventScrolling={false}
      snapToGrid={snapToGrid}
      snapGrid={snapGrid}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      nodesDraggable={false}
      nodesConnectable={false}
    >
      <Background gap={bgGap} size={1} color="var(--color-border)" variant={bgVariant} />
      <Controls showInteractive={false} position="bottom-right" />
      {showMiniMap && (
        <MiniMap
          position="bottom-left"
          pannable={true}
          zoomable={true}
          inversePan={false}
          nodeColor={miniMapNodeColor}
          nodeBorderRadius={8}
          maskColor="rgba(0,0,0,0.08)"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", width: 200, height: 140 }}
        />
      )}
    </ReactFlow>
  );
}

export default function GraphPage() {
  const [search, setSearch] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string[]>([]);
  const [relationshipFilter, setRelationshipFilter] = useState<string[]>([]);
  const [highlightCluster, setHighlightCluster] = useState<string | null>(null);
  const [queryText, setQueryText] = useState("");
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("explorer");

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitViewKey, setFitViewKey] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const showSettingsPanel = false;
  const [edgeType, setEdgeType] = useState("default");
  const [bgVariant, setBgVariant] = useState("dots");
  const [bgGap, setBgGap] = useState(16);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [clusterSpacing, setClusterSpacing] = useState(1000);
  const [nodeRadiusBase, setNodeRadiusBase] = useState(80);
  const [nodeRadiusMult, setNodeRadiusMult] = useState(30);

  const layoutConfig = useMemo<GraphLayoutConfig>(
    () => ({ clusterSpacing, nodeRadiusBase, nodeRadiusMult, edgeType }),
    [clusterSpacing, nodeRadiusBase, nodeRadiusMult, edgeType],
  );

  const filteredConnections = useMemo(() => {
    return MOCK_CONNECTIONS.filter((conn) => {
      if (entityTypeFilter.length > 0) {
        if (!entityTypeFilter.includes(conn.sourceType) && !entityTypeFilter.includes(conn.targetType)) {
          return false;
        }
      }
      if (relationshipFilter.length > 0) {
        if (!relationshipFilter.includes(conn.relationship)) return false;
      }
      return true;
    });
  }, [entityTypeFilter, relationshipFilter]);

  const { nodes: allNodes, edges: allEdges, entities } = useMemo(
    () => buildGraph(filteredConnections, highlightCluster, layoutConfig),
    [filteredConnections, highlightCluster, layoutConfig],
  );

  const clusters = useMemo(() => detectClusters(filteredConnections), [filteredConnections]);
  const fraudRings = clusters.filter((c) => c.isFraudRing);

  const nodes = useMemo(() => {
    if (!search.trim()) return allNodes;
    const q = search.toLowerCase();
    const matchingIds = new Set(
      allNodes.filter((n) => n.id.toLowerCase().includes(q)).map((n) => n.id),
    );
    return allNodes.map((n) => ({
      ...n,
      style: {
        ...n.style,
        opacity: matchingIds.has(n.id) ? 1 : 0.15,
      },
    }));
  }, [allNodes, search]);

  const selectedEntity = useMemo(() => {
    if (!selectedNode) return null;
    const entity = entities.get(selectedNode);
    if (!entity) return null;
    const connectedEdges = filteredConnections.filter(
      (c) =>
        `${c.sourceType}:${c.sourceId}` === selectedNode ||
        `${c.targetType}:${c.targetId}` === selectedNode,
    );
    return { ...entity, key: selectedNode, connections: connectedEdges };
  }, [selectedNode, entities, filteredConnections]);

  const hasActiveFilters = entityTypeFilter.length > 0 || relationshipFilter.length > 0;

  const handleNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    setSelectedNode(node.id);
  }, []);

  function clearAllFilters() {
    setEntityTypeFilter([]);
    setRelationshipFilter([]);
    setHighlightCluster(null);
  }

  function handleRunQuery() {
    const lowerQuery = queryText.toLowerCase();
    if (lowerQuery.includes("fraud") || lowerQuery.includes("ring") || lowerQuery.includes("synthetic")) {
      setHighlightCluster("__fraud_rings__");
      setActiveTab("explorer");
      const totalFraudNodes = fraudRings.reduce((sum, r) => sum + r.nodeCount, 0);
      const totalFraudEdges = fraudRings.reduce((sum, r) => sum + r.edgeCount, 0);
      setQueryResult(`Found ${fraudRings.length} fraud ring(s) with ${totalFraudNodes} nodes and ${totalFraudEdges} connections.`);
    } else if (lowerQuery.includes("same_ip") || lowerQuery.includes("shared")) {
      setRelationshipFilter(["same_ip"]);
      setActiveTab("explorer");
      setQueryResult(`Filtered to ${MOCK_CONNECTIONS.filter((c) => c.relationship === "same_ip").length} same_ip connections.`);
    } else if (lowerQuery.includes("high") || lowerQuery.includes("risk")) {
      setHighlightCluster("__fraud_rings__");
      setActiveTab("explorer");
      setQueryResult(`Found ${MOCK_CONNECTIONS.filter((c) => c.riskLevel === "high").length} high-risk connections across ${fraudRings.length} fraud ring(s).`);
    } else if (lowerQuery.includes("document") || lowerQuery.includes("forgery") || lowerQuery.includes("mill")) {
      setHighlightCluster("fraud_ring_docmill");
      setActiveTab("explorer");
      setQueryResult("Highlighted document forgery mill cluster. 3 accounts sharing forged documents from single device.");
    } else {
      setQueryResult(`Query executed. ${filteredConnections.length} connections matched across ${clusters.length} clusters.`);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TopBar
        title="Graph Explorer"
        actions={
          <div className="flex items-center gap-2">
            {fraudRings.length > 0 && (
              <Button
                color="danger"
                variant={highlightCluster === "__fraud_rings__" ? "solid" : "outline"}
                size={TOPBAR_CONTROL_SIZE}
                pill={TOPBAR_ACTION_PILL}
                onClick={() =>
                  setHighlightCluster((prev) =>
                    prev === "__fraud_rings__" ? null : "__fraud_rings__",
                  )
                }
              >
                <Warning />
                <span className="hidden md:inline">
                  {fraudRings.length} Fraud Ring{fraudRings.length > 1 ? "s" : ""}
                </span>
              </Button>
            )}
            <Button
              color="secondary"
              variant="outline"
              size={TOPBAR_CONTROL_SIZE}
              pill={TOPBAR_ACTION_PILL}
              onClick={() => {
                clearAllFilters();
                setSearch("");
                setSelectedNode(null);
                setQueryResult(null);
                setQueryText("");
              }}
            >
              <Reload />
              <span className="hidden md:inline">Reset</span>
            </Button>
          </div>
        }
        toolbar={
          <>
            <TableSearch value={search} onChange={setSearch} placeholder="Search nodes..." />

            <div className="w-40">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={180}
                options={ENTITY_TYPE_OPTIONS}
                value={entityTypeFilter}
                onChange={(opts) => setEntityTypeFilter(opts.map((o) => o.value))}
                placeholder="Entity type"
                variant="outline"
                size={TOPBAR_CONTROL_SIZE}
              />
            </div>

            <div className="w-44">
              <Select
                multiple
                clearable
                block
                pill={TOPBAR_TOOLBAR_PILL}
                listMinWidth={200}
                options={RELATIONSHIP_TYPE_OPTIONS}
                value={relationshipFilter}
                onChange={(opts) => setRelationshipFilter(opts.map((o) => o.value))}
                placeholder="Relationship"
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

      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="shrink-0 px-4 pt-6 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total Nodes" value={allNodes.length.toLocaleString()} trend={{ value: 12 }} />
            <MetricCard label="Total Edges" value={allEdges.length.toLocaleString()} trend={{ value: 8 }} />
            <MetricCard label="Clusters" value={clusters.length.toString()} trend={{ value: 3 }} />
            <MetricCard
              label="Fraud Rings"
              value={fraudRings.length.toString()}
              trend={{ value: fraudRings.length }}
            />
          </div>
        </div>

        <div className="shrink-0 overflow-x-auto px-4 pt-4 md:px-6" style={{ "--color-ring": "transparent" } as React.CSSProperties}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="underline"
            aria-label="Graph sections"
            size="lg"
          >
            <Tabs.Tab value="explorer">Explorer</Tabs.Tab>
            <Tabs.Tab value="query">Query</Tabs.Tab>
            <Tabs.Tab value="clusters" badge={{ content: clusters.length, pill: true }}>Clusters</Tabs.Tab>
          </Tabs>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Visualize connections between accounts, inquiries, verifications, and devices. Click on a node to see its details and connections.
          </p>
        </div>

        <div className="min-h-0 flex-1 px-4 py-6 md:px-6">
          {activeTab === "explorer" && (
            <div
              className={`graph-explorer-container ${
                isFullscreen
                  ? "fixed inset-0 z-50 bg-[var(--color-surface)]"
                  : "relative overflow-hidden rounded-xl border border-[var(--color-border)]"
              }`}
              style={isFullscreen ? undefined : { height: "calc(100vh - 280px)", minHeight: 500 }}
            >
              <ReactFlowProvider>
                <GraphCanvas
                  initialNodes={nodes}
                  initialEdges={allEdges}
                  snapToGrid={snapToGrid}
                  snapGrid={[bgGap, bgGap]}
                  bgGap={bgGap}
                  bgVariant={BG_VARIANT_MAP[bgVariant] ?? BackgroundVariant.Dots}
                  showMiniMap={showMiniMap}
                  fitViewKey={fitViewKey}
                  onNodeClick={handleNodeClick}
                  onPaneClick={() => setSelectedNode(null)}
                />
              </ReactFlowProvider>

              <div className="absolute left-3 top-3 z-10">
                <div className="flex gap-1.5">
                  {showSettingsPanel && (
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-100 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
                      onClick={() => setShowSettings((v) => !v)}
                    >
                      <SettingsCog style={{ width: 16, height: 16 }} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-100 transition-colors hover:bg-[var(--color-nav-hover-bg)]"
                    onClick={() => { setIsFullscreen((v) => !v); setFitViewKey((k) => k + 1); }}
                  >
                    {isFullscreen
                      ? <CollapseLg style={{ width: 16, height: 16 }} />
                      : <ExpandMd style={{ width: 16, height: 16 }} />
                    }
                  </button>
                </div>

                {showSettingsPanel && showSettings && (
                  <div className="mt-2 w-64 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-200">
                    <p className="text-xs font-medium text-[var(--color-text)]">Graph Settings</p>

                    <div className="mt-3 space-y-3">
                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Edge Type</label>
                        <div className="mt-1">
                          <Select
                            block
                            size="sm"
                            options={EDGE_TYPE_OPTIONS}
                            value={edgeType}
                            onChange={(opt) => setEdgeType(opt.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Background</label>
                        <div className="mt-1">
                          <Select
                            block
                            size="sm"
                            options={BG_VARIANT_OPTIONS}
                            value={bgVariant}
                            onChange={(opt) => setBgVariant(opt.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Grid Gap</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={bgGap}
                            onChange={(e) => setBgGap(Number(e.target.value) || 8)}
                            min={4}
                            max={100}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Cluster Spacing</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={clusterSpacing}
                            onChange={(e) => setClusterSpacing(Number(e.target.value) || 400)}
                            min={200}
                            max={2000}
                            step={50}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Node Radius Base</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={nodeRadiusBase}
                            onChange={(e) => setNodeRadiusBase(Number(e.target.value) || 100)}
                            min={50}
                            max={500}
                            step={10}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs text-[var(--color-text-secondary)]">Node Radius Multiplier</label>
                        <div className="mt-1">
                          <Input
                            type="number"
                            size="sm"
                            value={nodeRadiusMult}
                            onChange={(e) => setNodeRadiusMult(Number(e.target.value) || 10)}
                            min={0}
                            max={100}
                            step={5}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xs text-[var(--color-text-secondary)]">Snap to Grid</span>
                        <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xs text-[var(--color-text-secondary)]">Mini Map</span>
                        <Switch checked={showMiniMap} onCheckedChange={setShowMiniMap} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedEntity && (
                <div className="absolute right-3 top-3 z-10 w-80 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-200">
                  <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Badge color={badgeColor(selectedEntity.type)} variant="soft" size="sm">
                        {selectedEntity.type}
                      </Badge>
                      {selectedEntity.riskLevel && (
                        <Badge color={RISK_COLORS[selectedEntity.riskLevel]} variant="outline" size="sm">
                          {selectedEntity.riskLevel} risk
                        </Badge>
                      )}
                    </div>
                    <button
                      type="button"
                      className="rounded p-0.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                      onClick={() => setSelectedNode(null)}
                    >
                      <CloseBold style={{ width: 14, height: 14 }} />
                    </button>
                  </div>

                  <div className="px-4 py-3">
                    <p className="font-mono text-sm text-[var(--color-text)]">{selectedEntity.id}</p>
                    {selectedEntity.clusterId && (
                      <p className="mt-1 text-2xs text-[var(--color-text-tertiary)]">
                        Cluster: {selectedEntity.clusterId}
                        {selectedEntity.clusterId.startsWith("fraud_ring") && (
                          <Badge color="danger" variant="soft" size="sm" className="ml-2">
                            Fraud Ring
                          </Badge>
                        )}
                      </p>
                    )}
                    {selectedEntity.createdAt && (
                      <p className="mt-1 text-2xs text-[var(--color-text-tertiary)]">
                        First seen: {formatDateTime(selectedEntity.createdAt)}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-[var(--color-border)] px-4 py-3">
                    <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                      Connections ({selectedEntity.connections.length})
                    </p>
                    <div className="mt-2 max-h-48 space-y-1.5 overflow-auto">
                      {selectedEntity.connections.map((conn) => {
                        const isSource = `${conn.sourceType}:${conn.sourceId}` === selectedEntity.key;
                        const otherType = isSource ? conn.targetType : conn.sourceType;
                        const otherId = isSource ? conn.targetId : conn.sourceId;
                        return (
                          <button
                            key={conn.id}
                            type="button"
                            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-[var(--color-nav-hover-bg)]"
                            onClick={() => setSelectedNode(`${otherType}:${otherId}`)}
                          >
                            <span className="flex items-center gap-1.5">
                              <Badge color={badgeColor(otherType)} variant="soft" size="sm">
                                {otherType}
                              </Badge>
                              <span className="text-[var(--color-text-secondary)]">{otherId}</span>
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="text-2xs text-[var(--color-text-tertiary)]">{conn.relationship}</span>
                              <span className="font-mono text-2xs text-[var(--color-text-tertiary)]">
                                {conn.strength.toFixed(2)}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "query" && (
            <div className="space-y-6">
              <div>
                <SectionHeading size="xs">Graph Query</SectionHeading>
                <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                  Use Graph Query Language to search for patterns, clusters, and anomalies.
                </p>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                      placeholder="MATCH (a:Account)-[:SAME_IP]-(b:Account) RETURN a, b"
                      size="md"

                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRunQuery();
                      }}
                    />
                  </div>
                  <Button
                    color="primary"
                    size="md"
                    onClick={handleRunQuery}
                    disabled={!queryText.trim()}
                  >
                    <PlayCircle />
                    Run Query
                  </Button>
                </div>
              </div>

              {queryResult && (
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex items-start gap-2">
                    <Badge color="success" variant="soft" size="sm">Result</Badge>
                    <p className="text-sm text-[var(--color-text)]">{queryResult}</p>
                  </div>
                </div>
              )}

              <div>
                <SectionHeading size="xs">Sample Queries</SectionHeading>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {SAMPLE_QUERIES.map((sq) => (
                    <button
                      key={sq.label}
                      type="button"
                      className="rounded-lg border border-[var(--color-border)] p-3 text-left transition-colors hover:border-[var(--color-primary-soft-border)] hover:bg-[var(--color-primary-soft-bg)]"
                      onClick={() => {
                        setQueryText(sq.query);
                      }}
                    >
                      <p className="text-sm font-medium text-[var(--color-text)]">{sq.label}</p>
                      <p className="mt-1 truncate font-mono text-2xs text-[var(--color-text-tertiary)]">
                        {sq.query}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading size="xs">Recent Connections</SectionHeading>
                <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--color-border)]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Source</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Target</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Relationship</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Risk</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Strength</th>
                        <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConnections.slice(0, 15).map((conn) => (
                        <tr key={conn.id} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-nav-hover-bg)]">
                          <td className="px-4 py-3">
                            <Badge color={badgeColor(conn.sourceType)} variant="soft" size="sm">
                              {conn.sourceType}:{conn.sourceId}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge color={badgeColor(conn.targetType)} variant="soft" size="sm">
                              {conn.targetType}:{conn.targetId}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text)]">{conn.relationship}</td>
                          <td className="px-4 py-3">
                            {conn.riskLevel && (
                              <Badge color={RISK_COLORS[conn.riskLevel]} variant="outline" size="sm">
                                {conn.riskLevel}
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[var(--color-text)]">{conn.strength.toFixed(2)}</span>
                          </td>
                          <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                            {formatDateTime(conn.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "clusters" && (
            <div className="space-y-4">
              <SectionHeading size="xs">Detected Clusters</SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clusters.map((cluster) => (
                  <button
                    key={cluster.id}
                    type="button"
                    className={`rounded-lg border p-4 text-left transition-all ${
                      highlightCluster === cluster.id
                        ? "border-[var(--color-primary-solid-bg)] bg-[var(--color-primary-soft-bg)]"
                        : cluster.isFraudRing
                          ? "border-[var(--color-danger-soft-border)] hover:border-[var(--color-danger-solid-bg)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary-soft-border)]"
                    }`}
                    onClick={() => {
                      setHighlightCluster((prev) =>
                        prev === cluster.id ? null : cluster.id,
                      );
                      setActiveTab("explorer");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)]">
                        {cluster.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      {cluster.isFraudRing && (
                        <Badge color="danger" variant="soft" size="sm">
                          <Warning style={{ width: 10, height: 10 }} />
                          Fraud Ring
                        </Badge>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-2xs text-[var(--color-text-tertiary)]">Nodes</p>
                        <p className="heading-xs">{cluster.nodeCount}</p>
                      </div>
                      <div>
                        <p className="text-2xs text-[var(--color-text-tertiary)]">Edges</p>
                        <p className="heading-xs">{cluster.edgeCount}</p>
                      </div>
                      <div>
                        <p className="text-2xs text-[var(--color-text-tertiary)]">Risk</p>
                        <Badge color={RISK_COLORS[cluster.avgRisk] ?? "secondary"} variant="outline" size="sm">
                          {cluster.avgRisk}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
