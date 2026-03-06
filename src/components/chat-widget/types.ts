export type PersonalityMode = "professional" | "friendly" | "teacher" | "code-expert";

export type Language = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "pt";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatWidgetSettings {
  personality: PersonalityMode;
  language: Language;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
}

export interface ChatWidgetConfig {
  /** Called when user sends a message. Return a ReadableStream for streaming or a string for instant response. */
  onSendMessage?: (messages: ChatMessage[], settings: ChatWidgetSettings) => Promise<ReadableStream<Uint8Array> | string>;
  /** Initial greeting message */
  greeting?: string;
  /** Widget title */
  title?: string;
  /** Primary color (HSL format) */
  primaryColor?: string;
  /** Position on screen */
  position?: "bottom-right" | "bottom-left";
}

export const PERSONALITY_OPTIONS: { value: PersonalityMode; label: string; icon: string }[] = [
  { value: "professional", label: "Professional", icon: "💼" },
  { value: "friendly", label: "Friendly", icon: "😊" },
  { value: "teacher", label: "Teacher", icon: "📚" },
  { value: "code-expert", label: "Code Expert", icon: "💻" },
];

export const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
  { value: "pt", label: "Português" },
];
