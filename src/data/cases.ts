export const materialTypes = {
  applications: { label: "Приложения", singular: "Приложение" },
  bots: { label: "Telegram-боты", singular: "Telegram-бот" },
  automations: { label: "Автоматизации", singular: "Автоматизация" },
  cases: { label: "Кейсы", singular: "Кейс" },
  articles: { label: "Статьи", singular: "Статья" },
  newsletters: { label: "Рассылки", singular: "Рассылка" },
} as const;
export type MaterialType = keyof typeof materialTypes;


export type PortfolioCase = {
  id: string;
  category: "ai" | "marketing";
  title: string;
  description?: string;
  loadContent: () => Promise<string>;
  company: string;
  companyDescription?: string;
  materialType: MaterialType;
  image: string;
  link?: string;
  linkLabel?: string;
  status?: string;
};

export const cases: PortfolioCase[] = [
  {
    id: "proptech-legend",
    category: "marketing",
    title: "LEGENDA: история цифрового продукта",
    description:
      "Упаковка кейса внедрения для IT-компании в PropTech на примере LEGENDA. Продуктовая разработка личного кабинета брокера превращена в ясную B2B-историю с ключевыми сценариями, интеграциями и выгодами для бизнеса.",
    loadContent: () => import("../../notion-data/PropTech кейс для IT компании 3045c3762c418107b2ece4cd3bc595c5.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "cases",
    image: "/images/case-proptech.svg",
    status: "Материал проекта · статус релиза уточняется",
  },
  {
    id: "article-proptech-2026",
    category: "marketing",
    title: "PropTech: от технологий к задачам бизнеса",
    description:
      "Аналитическая статья о PropTech-трендах 2026: как девелоперам усилить продажи, стройку и эксплуатацию через цифровые продукты и автоматизацию. Внутри — практичный список решений, которые можно запустить за 2–4 недели.",
    loadContent: () => import("../../notion-data/Статья про PropTech для IT компании 3045c3762c4181e7874af5ec3ec68a3c.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "articles",
    image: "/images/case-article.svg",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать на сайте",
  },
  {
    id: "email-marketing-kts",
    category: "marketing",
    title: "Email-маркетинг: повод для диалога",
    description:
      "Серия email-рассылок для прогрева тёплой базы: вход через аналитику, кейсы и мягкий вывод в диалог. Внутри собраны два письма под разные сценарии коммуникации.",
    loadContent: () => import("../../notion-data/email-marketing-kts.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "newsletters",
    image: "/images/case-email.svg",
    status: "Два примера писем внутри кейса",
  },
  {
    id: "hh-career-engine",
    category: "ai",
    title: "HH Career Engine",
    description:
      "Помогает выбрать подходящие вакансии, понять основания выбора и подготовить письмо с опорой на реальный опыт.",
    loadContent: () => import("./projects/hh-career-engine.md?raw").then(module => module.default),
    company: "Личный проект",
    materialType: "applications",
    image: "/images/case-hh-career-engine.svg",
    status: "Личный инструмент",
    link: "/projects/hh-career-engine-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "telegram-ai-yougile",
    category: "ai",
    title: "Telegram → AI → YouGile",
    description:
      "Превращает поручение из переписки в понятную задачу: сохраняет контекст, учитывает уточнение и возвращает ответ в чат.",
    loadContent: () => import("./projects/telegram-ai-yougile.md?raw").then(module => module.default),
    company: "Личная автоматизация",
    materialType: "automations",
    image: "/images/case-telegram-yougile.svg",
    status: "Собранный сценарий",
    link: "/projects/yougile-workflow-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "ai-prompter",
    category: "ai",
    title: "AI-суфлёр",
    description:
      "Помогает сформулировать ответ во время онлайн-разговора: выделяет вопрос и подбирает короткую подсказку с контекстом из резюме.",
    loadContent: () => import("./projects/ai-prompter.md?raw").then(module => module.default),
    company: "Личный прототип",
    materialType: "applications",
    image: "/images/case-ai-prompter.svg",
    status: "Прототип приложения",
    link: "/projects/ai-prompter-brief.json",
    linkLabel: "Описание прототипа",
  },
  {
    id: "telegram-roleplay", category: "ai", title: "Интерактивные AI-боты в Telegram",
    description: "AI-персонажи и интерактивные истории: пользователь участвует в развитии сценария через естественный диалог.",
    loadContent: () => import("./projects/telegram-roleplay.md?raw").then(module => module.default),
    company: "Личные прототипы", materialType: "bots", image: "/images/case-roleplay.svg", status: "Личные прототипы",
  },
  {
    id: "cbt-diary", category: "ai", title: "КПТ-дневник в Telegram",
    description: "Идея личного дневника в привычном чате: записать мысль или событие и вернуться к ним для спокойной рефлексии.",
    loadContent: () => import("./projects/cbt-diary.md?raw").then(module => module.default),
    company: "Личный прототип", materialType: "bots", image: "/images/case-cbt-diary.svg", status: "Личный прототип",
  },
  {
    id: "personal-assistant", category: "ai", title: "Личный AI-ассистент в Telegram",
    description: "Свободная мысль — в понятную запись. AI-inbox раскладывает входящее на задачи, гипотезы, факты и заметки.",
    loadContent: () => import("./projects/personal-assistant.md?raw").then(module => module.default),
    company: "Семейство прототипов", materialType: "bots", image: "/images/case-personal-assistant.svg", status: "Семейство прототипов",
  },
];
