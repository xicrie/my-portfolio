
export type PortfolioCase = {
  id: string;
  category: "ai" | "marketing";
  title: string;
  description?: string;
  loadContent: () => Promise<string>;
  company: string;
  companyDescription?: string;
  tags: string[];
  image: string;
  link?: string;
  linkLabel?: string;
  status?: string;
};

export const cases: PortfolioCase[] = [
  {
    id: "proptech-legend",
    category: "marketing",
    title: "PropTech кейс для IT компании",
    description:
      "Упаковка кейса внедрения для IT-компании в PropTech на примере LEGENDA. Продуктовая разработка личного кабинета брокера превращена в ясную B2B-историю с ключевыми сценариями, интеграциями и выгодами для бизнеса.",
    loadContent: () => import("../../notion-data/PropTech кейс для IT компании 3045c3762c418107b2ece4cd3bc595c5.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Упаковка кейсов"],
    image: "/images/case-proptech.svg",
    status: "Материал проекта · статус релиза уточняется",
  },
  {
    id: "article-proptech-2026",
    category: "marketing",
    title: "Статья про PropTech для IT компании",
    description:
      "Аналитическая статья о PropTech-трендах 2026: как девелоперам усилить продажи, стройку и эксплуатацию через цифровые продукты и автоматизацию. Внутри — практичный список решений, которые можно запустить за 2–4 недели.",
    loadContent: () => import("../../notion-data/Статья про PropTech для IT компании 3045c3762c4181e7874af5ec3ec68a3c.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Статьи"],
    image: "/images/case-article.svg",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать на сайте",
  },
  {
    id: "email-marketing-kts",
    category: "marketing",
    title: "Email-маркетинг для IT-компании",
    description:
      "Серия email-рассылок для прогрева тёплой базы: вход через аналитику, кейсы и мягкий вывод в диалог. Внутри собраны два письма под разные сценарии коммуникации.",
    loadContent: () => import("../../notion-data/email-marketing-kts.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Тексты рассылок", "Email"],
    image: "/images/case-email.svg",
    status: "Два примера писем внутри кейса",
  },
  {
    id: "hh-career-engine",
    category: "ai",
    title: "HH Career Engine",
    description:
      "Поиск и разбор вакансий по профессиональному профилю: сопоставление требований с опытом, подготовка писем и история решений.",
    loadContent: () => import("./projects/hh-career-engine.md?raw").then(module => module.default),
    company: "Личный pet-проект",
    tags: ["AI", "Python", "API", "SQLite"],
    image: "/images/case-hh-career-engine.svg",
    status: "CLI-инструмент · проверен offline",
    link: "/projects/hh-career-engine-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "telegram-ai-yougile",
    category: "ai",
    title: "Telegram → AI → YouGile",
    description:
      "Поручение из переписки — в структурированную задачу YouGile. Сценарий на n8n с сохранением контекста и проверкой ответа AI.",
    loadContent: () => import("./projects/telegram-ai-yougile.md?raw").then(module => module.default),
    company: "Личная автоматизация",
    tags: ["AI", "n8n", "API"],
    image: "/images/case-telegram-yougile.svg",
    status: "n8n workflow · проверен offline",
    link: "/projects/yougile-workflow-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "ai-prompter",
    category: "ai",
    title: "AI-суфлёр",
    description:
      "Windows-суфлёр на базе Ecoute: два аудиоканала, транскрипция, вопрос собеседника и короткая подсказка с PDF-контекстом.",
    loadContent: () => import("./projects/ai-prompter.md?raw").then(module => module.default),
    company: "Личный прототип",
    tags: ["AI", "Python", "Аудио"],
    image: "/images/case-ai-prompter.svg",
    status: "Код исследован · Windows runtime не проверен",
    link: "/projects/ai-prompter-brief.json",
    linkLabel: "Описание прототипа",
  },
  {
    id: "telegram-roleplay", category: "ai", title: "Интерактивные AI-боты в Telegram",
    description: "AI-персонажи и интерактивные истории: пользователь участвует в развитии сценария через естественный диалог.",
    loadContent: () => import("./projects/telegram-roleplay.md?raw").then(module => module.default),
    company: "Личные прототипы", tags: ["AI", "Telegram", "Storytelling"], image: "/images/case-roleplay.svg", status: "Прототипы · ожидаются workflow",
  },
  {
    id: "cbt-diary", category: "ai", title: "КПТ-дневник в Telegram",
    description: "Личный дневник для саморефлексии. Состав КПТ-механик и отличие от других AI-дневников требуют проверки по исходникам.",
    loadContent: () => import("./projects/cbt-diary.md?raw").then(module => module.default),
    company: "Личный прототип", tags: ["AI", "Telegram", "Дневник"], image: "/images/case-cbt-diary.svg", status: "Прототип · ожидается экспорт",
  },
  {
    id: "personal-assistant", category: "ai", title: "Личный AI-ассистент в Telegram",
    description: "AI-inbox и связанные личные прототипы: разбор свободного текста на задачи, гипотезы, факты и заметки.",
    loadContent: () => import("./projects/personal-assistant.md?raw").then(module => module.default),
    company: "Семейство прототипов", tags: ["AI", "Telegram", "n8n", "AI-inbox"], image: "/images/case-personal-assistant.svg", status: "Описание автора · ожидаются workflow",
  },
];
