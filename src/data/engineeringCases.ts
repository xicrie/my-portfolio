type StoryStep = { title: string; detail: string };
type EngineeringCase = {
  purpose: string;
  stack: string[];
  variant: "decision" | "transfer" | "conversation" | "story" | "reflection" | "inbox";
  flow: StoryStep[];
  flowCaption: string;
};

export const engineeringCases: Record<string, EngineeringCase> = {
  "hh-career-engine": {
    purpose: "Меньше случайных вакансий. Больше ясности, где ваш опыт действительно пригодится.",
    stack: ["Python", "HH API", "API языковой модели", "SQLite / WAL", "pytest"], variant: "decision",
    flowCaption: "Сценарий работы с инструментом. Последнее решение остаётся за человеком.",
    flow: [
      { title: "Задать условия", detail: "Профиль, формат работы и важные ограничения." },
      { title: "Увидеть основания", detail: "Какие требования совпали с опытом и что осталось уточнить." },
      { title: "Подготовить отклик", detail: "Проверить черновик письма до отправки работодателю." },
    ],
  },
  "telegram-ai-yougile": {
    purpose: "Поручение уже есть в чате. Остаётся превратить его в задачу, сохранив смысл разговора.",
    stack: ["n8n", "JavaScript", "Telegram Bot API", "OpenAI API", "JSON Schema", "YouGile REST API"], variant: "transfer",
    flowCaption: "Сценарий собранной автоматизации. Полная связь сервисов требует отдельного запуска.",
    flow: [
      { title: "Выбрать поручение", detail: "Ответить командой /task на исходное сообщение." },
      { title: "Подготовить карточку", detail: "Сохранить действие, уточнение и ссылку на обсуждение." },
      { title: "Получить ответ", detail: "Увидеть подтверждение трекера или объяснение ошибки." },
    ],
  },
  "ai-prompter": {
    purpose: "Подсказка в нужный момент, чтобы увереннее сформулировать собственный ответ.",
    stack: ["Python", "Windows", "CustomTkinter", "PyAudioWPatch", "Whisper / faster-whisper", "PyPDF2", "GPT-4o-mini"], variant: "conversation",
    flowCaption: "Путь подсказки по исходникам. Иллюстрация не заменяет проверку приложения на Windows.",
    flow: [
      { title: "Услышать вопрос", detail: "Разговор превращается в текст, из которого выделяется вопрос собеседника." },
      { title: "Добавить контекст", detail: "Подбираются фрагменты резюме, подходящие по словам." },
      { title: "Выбрать формулировку", detail: "Модель предлагает короткий вариант, человек проверяет его и отвечает сам." },
    ],
  },
  "telegram-roleplay": {
    purpose: "Не просто читать историю, а стать её участником через разговор с персонажем.",
    stack: ["Telegram", "Языковая модель"], variant: "story",
    flowCaption: "Авторский сценарий личного прототипа.",
    flow: [
      { title: "Обратиться к персонажу", detail: "Начать разговор в привычном чате Telegram." },
      { title: "Сделать свой ход", detail: "Продолжить историю собственной репликой." },
    ],
  },
  "cbt-diary": {
    purpose: "Небольшая пауза в привычном чате, чтобы записать важное и лучше услышать себя.",
    stack: ["Telegram"], variant: "reflection",
    flowCaption: "Целевой сценарий личного прототипа для саморефлексии.",
    flow: [
      { title: "Записать своими словами", detail: "Что произошло и какие мысли это вызвало." },
      { title: "Уделить записи внимание", detail: "Использовать её как отправную точку для осмысления." },
    ],
  },
  "personal-assistant": {
    purpose: "Запишите мысль так, как она пришла. Ассистент поможет навести в ней порядок.",
    stack: ["Telegram", "n8n", "API языковой модели", "Google Sheets"], variant: "inbox",
    flowCaption: "Сценарий входящей корзины по описанию автора.",
    flow: [],
  },
};
