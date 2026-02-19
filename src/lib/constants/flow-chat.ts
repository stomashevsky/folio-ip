export const FLOW_CHAT_TEMPERATURE = 0.2;
export const FLOW_CHAT_MAX_OUTPUT_TOKENS = 4096;

export const FLOW_CHAT_GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const FLOW_CHAT_GROQ_DEFAULT_MODEL = "llama-3.1-8b-instant";

export const FLOW_CHAT_GEMINI_DEFAULT_MODEL = "gemini-2.0-flash";

export const FLOW_CHAT_PROVIDER_OPTIONS = [
  { value: "groq", label: "Groq" },
  { value: "gemini", label: "Gemini" },
] as const;

export type FlowChatProvider = (typeof FLOW_CHAT_PROVIDER_OPTIONS)[number]["value"];

export const FLOW_CHAT_EXAMPLES_TITLE = "Examples";
export const FLOW_CHAT_COMPOSER_CONTROL_SIZE = "lg" as const;

export const FLOW_CHAT_EXAMPLE_PROMPTS = [
  "Add ES to the document check",
  "Add a selfie verification after government id",
  "Set retry max to 3 for document check",
] as const;

export const FLOW_CHAT_DEFAULT_PROVIDER: FlowChatProvider = "groq";
export const FLOW_CHAT_PROVIDER_STORAGE_KEY = "folio:flow-chat-provider";
export const FLOW_CHAT_MODEL_STORAGE_KEY = "folio:flow-chat-model";
export const FLOW_CHAT_API_KEY_STORAGE_KEY = "folio:flow-chat-api-key";
export const FLOW_CHAT_KEYS_STORAGE_KEY = "folio:flow-chat-keys";
export const FLOW_CHAT_ACTIVE_KEY_ID_STORAGE_KEY = "folio:flow-chat-active-key-id";
