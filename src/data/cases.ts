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
  illustrationAlt?: string;
  link?: string;
  linkLabel?: string;
};

export const cases: PortfolioCase[] = [
  {
    id: "proptech-legend",
    category: "marketing",
    title: "Упаковка кейса для IT-компании",
    description:
      "Выстроила маркетинговую историю о кабинете брокера для потенциальных заказчиков IT-компании.",
    loadContent: () => import("../../notion-data/PropTech кейс для IT компании 3045c3762c418107b2ece4cd3bc595c5.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "cases",
    cardCover: "/images/case-proptech.svg", caseHero: "/images/case-hero-proptech-legend.svg", caseHeroMobile: "/images/case-hero-proptech-legend-mobile.svg", heroLine: "История кабинета брокера",
  },
  {
    id: "article-proptech-2026",
    category: "marketing",
    title: "Статья о PropTech для IT-компании",
    description:
      "Помогает девелоперу выбрать, с какой задачи начать цифровизацию бизнеса.",
    loadContent: () => import("../../notion-data/Статья про PropTech для IT компании 3045c3762c4181e7874af5ec3ec68a3c.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "articles",
    cardCover: "/images/case-article.svg", caseHero: "/images/case-hero-article-proptech-2026.svg", caseHeroMobile: "/images/case-hero-article-proptech-2026-mobile.svg", heroLine: "Создание статьи для IT‑компании", illustrationAlt: "Страница экспертной статьи и силуэт здания, иллюстрация материала о PropTech",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать статью на сайте",
  },
  {
    id: "email-marketing-kts",
    category: "marketing",
    title: "Письма для B2B-аудитории",
    description:
      "Два письма, которые знакомят с подходом IT-компании и приглашают обсудить проект.",
    loadContent: () => import("../../notion-data/email-marketing-kts.md?raw").then(module => module.default),
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    materialType: "newsletters",
    cardCover: "/images/case-email.svg", caseHero: "/images/case-hero-email-marketing-kts.svg", caseHeroMobile: "/images/case-hero-email-marketing-kts-mobile.svg", heroLine: "Прогревающие письма для IT‑компании",
  },
  {
    id: "hh-career-engine",
    category: "ai",
    title: "Помощник для поиска работы",
    description:
      "Находит подходящие вакансии, готовит персональные письма и отправляет резюме.",
    loadContent: () => import("./projects/hh-career-engine.md?raw").then(module => module.default),
    company: "Личный проект",
    materialType: "applications",
    cardCover: "/images/case-hh-career-engine.svg", caseHero: "/images/case-hero-hh-career-engine.svg", caseHeroMobile: "/images/case-hero-hh-career-engine-mobile.svg", heroLine: "Сам найдёт вакансию и отправит резюме",
    link: "/projects/hh-career-engine-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "telegram-ai-yougile",
    category: "ai",
    title: "Задачи из Telegram в YouGile",
    description:
      "Превращает ответ с тегом в задачу трекера, сохраняя поручение и уточнения.",
    loadContent: () => import("./projects/telegram-ai-yougile.md?raw").then(module => module.default),
    company: "Личный проект",
    materialType: "automations",
    cardCover: "/images/case-telegram-yougile.svg", caseHero: "/images/case-hero-telegram-ai-yougile.svg", caseHeroMobile: "/images/case-hero-telegram-ai-yougile-mobile.svg", heroLine: "Быстрое создание задач из чата",
    link: "/projects/yougile-workflow-verification.json",
    linkLabel: "Артефакт проверки",
  },
  {
    id: "ai-prompter",
    category: "ai",
    title: "AI-суфлёр для переговоров",
    description:
      "Предлагает ответ во время встречи с опорой на разговор и загруженные документы.",
    loadContent: () => import("./projects/ai-prompter.md?raw").then(module => module.default),
    company: "Личный проект",
    materialType: "applications",
    cardCover: "/images/case-ai-prompter.svg", caseHero: "/images/case-hero-ai-prompter.svg", caseHeroMobile: "/images/case-hero-ai-prompter-mobile.svg", heroLine: "Подсказка во время разговора",
    link: "/projects/ai-prompter-brief.json",
    linkLabel: "Техническое описание",
  },
  {
    id: "telegram-roleplay", category: "ai", title: "AI-аватар в Telegram",
    description: "Виртуальный собеседник с заданным характером. Проверяла, насколько последовательно он сохраняет его в диалоге.",
    loadContent: () => import("./projects/telegram-roleplay.md?raw").then(module => module.default),
    company: "Личный проект", materialType: "bots", cardCover: "/images/case-roleplay.svg", caseHero: "/images/case-hero-telegram-roleplay.svg", caseHeroMobile: "/images/case-hero-telegram-roleplay-mobile.svg", heroLine: "Персонаж, который оживает в диалоге", illustrationAlt: "Цифровой персонаж с выразительным лицом и две реплики диалога",
  },
  {
    id: "cbt-diary", category: "ai", title: "Умный дневник в Телеграме",
    description: "AI-дневник с КПТ-поддержкой помогает вести записи, отслеживать настроение и замечать повторяющиеся ситуации.",
    loadContent: () => import("./projects/cbt-diary.md?raw").then(module => module.default),
    company: "Личный проект", materialType: "bots", cardCover: "/images/case-cbt-diary.svg", caseHero: "/images/case-hero-cbt-diary.svg", caseHeroMobile: "/images/case-hero-cbt-diary-mobile.svg", heroLine: "КПТ-дневник с историей записей", illustrationAlt: "Дневник с записями, отметками настроения и историей событий",
  },
  {
    id: "personal-assistant", category: "ai", title: "AI-ассистент в Телеграме",
    description: "Помогает с поиском, записями, календарём и почтой через текст и голос.",
    loadContent: () => import("./projects/personal-assistant.md?raw").then(module => module.default),
    company: "Личный проект", materialType: "bots", cardCover: "/images/case-personal-assistant.svg", caseHero: "/images/case-hero-personal-assistant.svg", caseHeroMobile: "/images/case-hero-personal-assistant-mobile.svg", heroLine: "Записи, встречи и письма из Telegram",
  },
];
