import fullContentProptech from "../../notion-data/PropTech кейс для IT компании 3045c3762c418107b2ece4cd3bc595c5.md?raw";
import fullContentArticle from "../../notion-data/Статья про PropTech для IT компании 3045c3762c4181e7874af5ec3ec68a3c.md?raw";
import fullContentEmailCombined from "../../notion-data/email-marketing-kts.md?raw";
import fullContentHH from "./projects/hh-career-engine.md?raw";

export type PortfolioCase = {
  id: string;
  category: "ai" | "marketing";
  title: string;
  description?: string;
  fullContent: string;
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
    fullContent: fullContentProptech,
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Упаковка кейсов"],
    image: "/images/case-proptech.webp",
    status: "Релиз ожидается весной",
  },
  {
    id: "article-proptech-2026",
    category: "marketing",
    title: "Статья про PropTech для IT компании",
    description:
      "Аналитическая статья о PropTech-трендах 2026: как девелоперам усилить продажи, стройку и эксплуатацию через цифровые продукты и автоматизацию. Внутри — практичный список решений, которые можно запустить за 2–4 недели.",
    fullContent: fullContentArticle,
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Статьи"],
    image: "/images/case-article.webp",
    link: "https://guides.kts.tech/proptech-trendy-2026/",
    linkLabel: "Читать на сайте",
  },
  {
    id: "email-marketing-kts",
    category: "marketing",
    title: "Email-маркетинг для IT-компании",
    description:
      "Серия email-рассылок для прогрева тёплой базы: вход через аналитику, кейсы и мягкий вывод в диалог. Внутри собраны два письма под разные сценарии коммуникации.",
    fullContent: fullContentEmailCombined,
    company: "KTS",
    companyDescription:
      "Аккредитованная IT-компания и цифровой интегратор. Работа с контентом для сложных цифровых продуктов и B2B-направления.",
    tags: ["IT", "PropTech", "Примеры текстов", "Тексты рассылок", "Email"],
    image: "/images/case-email-2.webp",
    status: "Два примера писем внутри кейса",
  },
  {
    id: "hh-career-engine",
    category: "ai",
    title: "HH Career Engine",
    description:
      "Pet-проект для поиска вакансий: анализ требований, оценка соответствия профилю и подготовка писем. Python, HH API, LLM и SQLite; логика проверена offline-тестами.",
    fullContent: fullContentHH,
    company: "Личный pet-проект",
    tags: ["AI", "Python", "API", "SQLite"],
    image: "/images/case-hh-career-engine.svg",
    status: "Pet-проект · offline-проверка",
    link: "/projects/hh-career-engine-verification.json",
    linkLabel: "Артефакт проверки",
  },
];
