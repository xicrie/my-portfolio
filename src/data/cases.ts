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
  cardCover: string;
  caseHero: string;
  caseHeroMobile: string;
  heroLine: string;
  link?: string;
  linkLabel?: string;
};

export const cases: PortfolioCase[] = [
  {
    id: "proptech-legend",
    category: "marketing",
    title: "LEGENDA: история цифрового продукта",
    description:
      "История о том, как личный кабинет упрощает работу брокера и помогает девелоперу.",
    loadContent: () => import("../../notion-data/PropTech кейс для IT компании 3045c3762c418107b2ece4cd3bc595c5.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "cases",
    cardCover: "/images/case-proptech.svg", caseHero: "/images/case-hero-proptech-legend.svg", caseHeroMobile: "/images/case-hero-proptech-legend-mobile.svg", heroLine: "Сложный продукт. Понятная история.",
  },
  {
    id: "article-proptech-2026",
    category: "marketing",
    title: "PropTech: от технологий к задачам бизнеса",
    description:
      "Помогает девелоперу выбрать, с какой задачи начать цифровизацию бизнеса.",
    loadContent: () => import("../../notion-data/Статья про PropTech для IT компании 3045c3762c4181e7874af5ec3ec68a3c.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "articles",
    cardCover: "/images/case-article.svg", caseHero: "/images/case-hero-article-proptech-2026.svg", caseHeroMobile: "/images/case-hero-article-proptech-2026-mobile.svg", heroLine: "Технологии через задачи бизнеса",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать на сайте",
  },
  {
    id: "email-marketing-kts",
    category: "marketing",
    title: "Письма для B2B-аудитории",
    description:
      "Два письма, которые знакомят с подходом IT-компании и приглашают обсудить проект.",
    loadContent: () => import("../../notion-data/email-marketing-kts.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "newsletters",
    cardCover: "/images/case-email.svg", caseHero: "/images/case-hero-email-marketing-kts.svg", caseHeroMobile: "/images/case-hero-email-marketing-kts-mobile.svg", heroLine: "Письмо как начало разговора",
  },
  {
    id: "hh-career-engine",
    category: "ai",
    title: "HH Career Engine",
    description:
      "Находит подходящие вакансии и помогает объяснить работодателю, почему ваш опыт ему подходит.",
    loadContent: () => import("./projects/hh-career-engine.md?raw").then(module => module.default),
    company: "Личный проект",
    materialType: "applications",
    cardCover: "/images/case-hh-career-engine.svg", caseHero: "/images/case-hero-hh-career-engine.svg", caseHeroMobile: "/images/case-hero-hh-career-engine-mobile.svg", heroLine: "Вакансии под ваш опыт",
    link: "/projects/hh-career-engine-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "telegram-ai-yougile",
    category: "ai",
    title: "Из Telegram в YouGile",
    description:
      "Помогает перенести поручение из переписки в трекер, сохранив смысл и важные уточнения.",
    loadContent: () => import("./projects/telegram-ai-yougile.md?raw").then(module => module.default),
    company: "Личный проект",
    materialType: "automations",
    cardCover: "/images/case-telegram-yougile.svg", caseHero: "/images/case-hero-telegram-ai-yougile.svg", caseHeroMobile: "/images/case-hero-telegram-ai-yougile-mobile.svg", heroLine: "Поручение становится задачей",
    link: "/projects/yougile-workflow-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "ai-prompter",
    category: "ai",
    title: "AI-суфлёр",
    description:
      "Предлагает короткую подсказку во время разговора с опорой на вопрос собеседника и факты из резюме.",
    loadContent: () => import("./projects/ai-prompter.md?raw").then(module => module.default),
    company: "Личный прототип",
    materialType: "applications",
    cardCover: "/images/case-ai-prompter.svg", caseHero: "/images/case-hero-ai-prompter.svg", caseHeroMobile: "/images/case-hero-ai-prompter-mobile.svg", heroLine: "Опора во время разговора",
    link: "/projects/ai-prompter-brief.json",
    linkLabel: "Описание прототипа",
  },
  {
    id: "telegram-roleplay", category: "ai", title: "Истории с персонажами в Telegram",
    description: "Позволяет стать участником истории и продолжать её через разговор с персонажем.",
    loadContent: () => import("./projects/telegram-roleplay.md?raw").then(module => module.default),
    company: "Личный прототип", materialType: "bots", cardCover: "/images/case-roleplay.svg", caseHero: "/images/case-hero-telegram-roleplay.svg", caseHeroMobile: "/images/case-hero-telegram-roleplay-mobile.svg", heroLine: "История в ответ на вашу реплику",
  },
  {
    id: "cbt-diary", category: "ai", title: "КПТ-дневник в Telegram",
    description: "Помогает остановиться, записать важное и внимательнее отнестись к собственным мыслям.",
    loadContent: () => import("./projects/cbt-diary.md?raw").then(module => module.default),
    company: "Личный прототип", materialType: "bots", cardCover: "/images/case-cbt-diary.svg", caseHero: "/images/case-hero-cbt-diary.svg", caseHeroMobile: "/images/case-hero-cbt-diary-mobile.svg", heroLine: "Место для мыслей и наблюдений",
  },
  {
    id: "personal-assistant", category: "ai", title: "Личный ассистент в Telegram",
    description: "Задачи, идеи и заметки из одного сообщения превращаются в понятные записи.",
    loadContent: () => import("./projects/personal-assistant.md?raw").then(module => module.default),
    company: "Личный прототип", materialType: "bots", cardCover: "/images/case-personal-assistant.svg", caseHero: "/images/case-hero-personal-assistant.svg", caseHeroMobile: "/images/case-hero-personal-assistant-mobile.svg", heroLine: "Мысли не теряются в переписке",
  },
];
