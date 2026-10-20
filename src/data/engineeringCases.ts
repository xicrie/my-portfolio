type EngineeringCase = {
  purpose: string;
  stack: string[];
  variant: "decision" | "transfer" | "conversation" | "story" | "reflection" | "inbox";
};

export const engineeringCases: Record<string, EngineeringCase> = {
  "hh-career-engine": {
    purpose: "Помощник для поиска и отбора вакансий",
    stack: ["Python", "HH API", "API языковой модели", "SQLite / WAL"], variant: "decision",
  },
  "telegram-ai-yougile": {
    purpose: "Сообщение из чата становится рабочей задачей",
    stack: ["n8n", "Telegram Bot API", "API языковой модели", "YouGile REST API"], variant: "transfer",
  },
  "ai-prompter": {
    purpose: "AI-помощник во время звонков и переговоров",
    stack: ["Python", "Windows", "CustomTkinter", "Whisper / faster-whisper", "PyPDF2", "GPT-4o-mini"], variant: "conversation",
  },
  "telegram-roleplay": {
    purpose: "Ксаавьер: эксперимент с характером и поведением в диалоге",
    stack: ["Telegram", "n8n", "DeepSeek v3"], variant: "story",
  },
  "cbt-diary": {
    purpose: "Личный AI-дневник с КПТ-поддержкой",
    stack: ["Telegram", "Notion", "Языковая модель"], variant: "reflection",
  },
  "personal-assistant": {
    purpose: "Помощник для фиксации, разбора и сохранения информации",
    stack: ["Telegram", "n8n", "API языковой модели", "Google Sheets"], variant: "inbox",
  },
};
