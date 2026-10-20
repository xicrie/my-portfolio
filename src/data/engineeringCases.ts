type EngineeringCase = {
  stack: string[];
  variant: "decision" | "transfer" | "conversation" | "story" | "reflection" | "inbox";
};

export const engineeringCases: Record<string, EngineeringCase> = {
  "hh-career-engine": {
    stack: ["Python", "HH API", "API языковой модели", "SQLite / WAL"], variant: "decision",
  },
  "telegram-ai-yougile": {
    stack: ["n8n", "Telegram Bot API", "API языковой модели", "YouGile REST API"], variant: "transfer",
  },
  "ai-prompter": {
    stack: ["Python", "Windows", "CustomTkinter", "Whisper / faster-whisper", "PyPDF2", "GPT-4o-mini"], variant: "conversation",
  },
  "telegram-roleplay": {
    stack: ["Telegram", "n8n", "DeepSeek v3"], variant: "story",
  },
  "cbt-diary": {
    stack: ["Telegram", "Notion", "Языковая модель"], variant: "reflection",
  },
  "personal-assistant": {
    stack: ["Telegram Bot API", "n8n", "GPT-4o-mini", "API сервисов"], variant: "inbox",
  },
};
