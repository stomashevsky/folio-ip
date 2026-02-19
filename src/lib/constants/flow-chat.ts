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

export const FLOW_CHAT_EMPTY_STATE_TITLE = "AI Assistant";
export const FLOW_CHAT_INPUT_PLACEHOLDER = "Describe changes to the flow in natural language.";
export const FLOW_CHAT_FRAME_PADDING_PX = 12;
export const FLOW_CHAT_FRAME_RADIUS_PX = 10;
export const FLOW_CHAT_FRAME_SECTION_GAP_PX = 12;
export const FLOW_CHAT_EXAMPLE_ICON_SIZE_PX = 14;
export const FLOW_CHAT_EXAMPLE_ICON_VERTICAL_PADDING_PX = 2;
export const FLOW_CHAT_EXAMPLE_TEXT_LINE_HEIGHT_PX = 20;
export const FLOW_CHAT_EXAMPLE_ROW_RADIUS_PX = 10;
export const FLOW_CHAT_EXAMPLE_ROW_GAP_PX = 8;
export const FLOW_CHAT_EXAMPLE_ROW_PADDING_X_PX = 10;
export const FLOW_CHAT_EXAMPLE_ROW_PADDING_Y_PX = 8;
export const FLOW_CHAT_MESSAGE_ACTION_GAP_PX = 6;
export const FLOW_CHAT_MESSAGE_LINE_HEIGHT_PX = 20;
export const FLOW_CHAT_MESSAGE_VERTICAL_PADDING_PX = 10;
export const FLOW_CHAT_EXAMPLE_PROMPTS_LIMIT = 3;
export const FLOW_CHAT_EXAMPLE_COUNTRY_CODE = "ES";
export const FLOW_CHAT_EXAMPLE_RETRY_MAX = 3;
export const FLOW_CHAT_COMPOSER_TEXTAREA_SIZE = "lg" as const;
export const FLOW_CHAT_COMPOSER_TEXTAREA_VARIANT = "outline" as const;
export const FLOW_CHAT_COMPOSER_ACTION_SIZE = "lg" as const;
export const FLOW_CHAT_COMPOSER_ROWS = 1;
export const FLOW_CHAT_COMPOSER_MAX_ROWS = 8;
export const FLOW_CHAT_COMPOSER_ACTION_BUTTON_HEIGHT_PX = 36;
export const FLOW_CHAT_COMPOSER_SEND_ICON_SIZE_PX = 20;
export const FLOW_CHAT_COMPOSER_ACTION_INSET_PX = 8;
export const FLOW_CHAT_COMPOSER_ACTION_COLUMN_WIDTH_PX = FLOW_CHAT_COMPOSER_ACTION_BUTTON_HEIGHT_PX;
export const FLOW_CHAT_COMPOSER_SEND_RADIUS_PX = FLOW_CHAT_FRAME_RADIUS_PX;
export const FLOW_CHAT_COMPOSER_RADIUS_PX = FLOW_CHAT_FRAME_RADIUS_PX;
export const FLOW_CHAT_COMPOSER_TEXT_TO_ACTION_GAP_PX = 8;
export const FLOW_CHAT_COMPOSER_TEXT_SIDE_PADDING_PX = 12;
export const FLOW_CHAT_COMPOSER_TEXT_RIGHT_PADDING_PX = FLOW_CHAT_COMPOSER_TEXT_SIDE_PADDING_PX;
export const FLOW_CHAT_COMPOSER_TEXT_TOP_PADDING_PX = 10;
export const FLOW_CHAT_COMPOSER_BOTTOM_ROW_HEIGHT_PX =
  FLOW_CHAT_COMPOSER_ACTION_BUTTON_HEIGHT_PX
  + (FLOW_CHAT_COMPOSER_ACTION_INSET_PX * 2);
export const FLOW_CHAT_COMPOSER_TEXT_BOTTOM_PADDING_PX =
  FLOW_CHAT_COMPOSER_BOTTOM_ROW_HEIGHT_PX
  + FLOW_CHAT_COMPOSER_TEXT_TO_ACTION_GAP_PX;
export const FLOW_CHAT_COMPOSER_TEXT_LINE_HEIGHT_PX = 20;
export const FLOW_CHAT_COMPOSER_MIN_HEIGHT_PX = 98;

export const FLOW_CHAT_UNIVERSAL_EXAMPLE_PROMPTS = [
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
