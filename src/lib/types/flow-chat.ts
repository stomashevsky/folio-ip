import type { FlowChatProvider } from "@/lib/constants";

export interface StoredFlowChatKey {
  id: string;
  name: string;
  provider: FlowChatProvider;
  apiKey: string;
  model?: string;
  createdAt: string;
  lastUsedAt?: string;
  active: boolean;
}
