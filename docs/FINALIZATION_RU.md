# Финализация портфолио после аудита PR №2

16 октября 2026 года. Ветка `codex/portfolio-audit-ai`. База сравнения — head PR №2 `0b823b7`, а не production.

Правки завершены локально. Push, merge и deploy не выполнялись: существующие интеграции Vercel/Cloudflare реагируют на обновления ветки. Удалённый PR остаётся на `0b823b7`. Настройки интеграций, DNS, Pages и workflow не изменялись.

## 1. Приоритет AI

- Без параметра `direction` выбрано **AI / Automation**, показаны три AI-проекта. Неизвестное значение параметра также открывает AI.
- Порядок переключателей: AI → Marketing / CRM → Все направления.
- Во «Всех направлениях» сначала идут AI-кейсы, затем три маркетинговых кейса в прежнем порядке.
- Выбор «Все направления» сохраняет `?direction=all`, в том числе после reload. Прямые ссылки `?direction=marketing` и `?direction=ai`, история браузера и фильтры тегов работают.

Большие секции не переставлялись. Маркетинговые достижения, фотографии, контакты, исходные маркетинговые кейсы, CSS и анимации сохранены. В SVG AI-суфлёра заменена одна подпись; размеры, цвета и схема остались прежними.

## 2. Подача для HR и технического руководителя

Во всех трёх AI-кейсах установлен порядок: **задача → моё решение → бизнес-применение → мой вклад → материалы → статус и следующий шаг**. Краткие описания карточек объясняют применение. На карточках остаются короткие статусы «Pet-проект», «Workflow-прототип», «Прототип»; границы проверки собраны в заключительном разделе кейса.

| Проект | Что понятно HR | Что доступно техническому руководителю | Граница подтверждения |
|---|---|---|---|
| HH Career Engine | Поиск и разбор вакансий; требования, настройка и проверка результата как личный вклад | HH API → LLM → проверка фактов → письмо → SQLite; dry-run и журнал решений | 350 offline-тестов прошли, 1 пропущен. Код создавался с AI-инструментами. Эффект на найм не измерен |
| Telegram → AI → YouGile | Перенос поручений из переписки в задачи с контекстом | Реальный экспорт 35 узлов, JSON Schema, ветки доступа/ошибок/повторов; 32 локальные проверки | Экспорт неактивен; сквозной запуск не подтверждён. Распределение авторства узлов и личные live-запуски не установлены |
| AI-суфлёр | Помощь с формулировкой ответа; работа автора с контекстом и запросами | Подтверждённое описание прототипа и открытые вопросы к реализации | Исходники и работоспособность не верифицированы; стек, интерфейс и задержка не придуманы |

350 тестов HH и 32 проверки n8n относятся к предыдущему аудиту и не запускались повторно при редакционной финализации: код этих проектов не менялся. Их область и ограничения сохранены из доказательной базы.

## 3. Материалы и будущие демонстрации

Три технических JSON-артефакта сохранены без изменений. У AI-карточек убраны отдельные ссылки, открывавшие JSON, и дублирующая кнопка внизу модального окна. В тексте каждого кейса осталась одна подписанная ссылка на техническую сводку или карточку описания. Человек сначала читает кейс и видит схему; технические сведения доступны дальше.

Схемы на обложках не выдаются за интерфейсы приложений. Описаны доступные материалы: исходники HH в приватном репозитории; реальный экспорт и инструкция n8n; описание AI-суфлёра. Приватные экспорты, конфигурации, credentials и внутренние имена не публиковались. Реальные видео, screenshots продукта и бизнес-метрики не выдумывались.

### Что добавить позже

| Проект | Материал | Что показать | Условие готовности |
|---|---|---|---|
| HH | Запись 60–120 секунд и 2–3 обезличенных кадра | Вакансия, причины оценки, черновик письма, ручная проверка; включённый dry-run | Реальный воспроизводимый запуск без отправки отклика; дата и конфигурация. Отличать синтетический пример от живой вакансии |
| n8n → YouGile | Запись тестовой группы и карточки трекера; комментарий автора | Сообщение → /task → задача; повтор команды; ошибка доступа/API; фактическое расположение исполнителя и срока | Сначала проверить циклы `.first()` с runIndex, доступ и повтор создания. Подтвердить личный вклад; скрыть credentials и рабочие данные |
| AI-суфлёр | Исходники или доступ к прототипу; запись реального сценария | Согласованный контекст, предложенные ответы и оценка автором | Установить реальный способ получения контекста и интерфейс. Не рисовать вымышленный экран и не обещать latency до измерений |

Для каждого ролика достаточно одного примера, подписи «что было моей работой» и результата. Число тестов остаётся техническим свидетельством, а не метрикой экономии времени или качества бизнеса. Измерения времени, ошибок и полезности добавляются после реального сравнения с описанной методикой.

## 4. npm audit: сайт и инструменты

Снимок npm audit: **33 затронутых пакета: 25 high, 7 moderate, 1 low, 0 critical**. Это не 33 независимые уязвимости: часть оценок наследуется по зависимостям. `package.json` и lockfile не изменялись; `npm audit fix --force` не выполнялся.

Проверены `npm explain` всех затронутых пакетов и `chunk.modules` всех JS-файлов финальной production-сборки. Учитывались модули с ненулевым `renderedLength`, включая лениво загружаемый Markdown. **Ни один из 25 high-пакетов не входит в JS, отдаваемый посетителю.** Это вывод о данной сборке, а не доказательство безопасности всей цепочки сборки.

| Контур | Наблюдение | Практическое влияние |
|---|---|---|
| Статический сайт | 0 high-пакетов в итоговых JS chunks | У выявленных high нет обнаруженного пути исполнения через посещение этой сборки; Pages не запускает Node-пакеты при каждом визите |
| Сборка, lint, dev и тесты | High находятся в обработчиках CSS, файловых шаблонов, конфигураций и тестовых сетевых библиотеках | Недоверенные входные данные способны влиять на Node-процесс и CI; отсутствие в bundle не устраняет этот риск |
| Неиспользуемая production-зависимость | `lodash` приходит через `recharts`, но не попадает в bundle | Метка production в npm сама по себе не доказывает доставку кода посетителю |
| Браузерные moderate | `react-router` и `react-router-dom` входят в bundle | Условия эксплуатации redirect/SSR-предупреждений не обнаружены: BrowserRouter без SSR, переключатель задаёт контролируемые search/hash. Advisory остаются открытыми |

`npm audit --omit=dev` не использовался как доказательство безопасности: peer-зависимости Tailwind и неиспользуемый Recharts могут оставаться в production-дереве, хотя их Node-код не исполняется на сайте.

### Причины и ограниченный план исправления

1. **CSS:** PostCSS может читать предыдущие source maps вне ожидаемого каталога при обработке недоверенного CSS. Исправление high вышло в 8.5.18, последующее связанное moderate требует 8.5.23. `source-map-js` и Nano ID имеют условия DoS на специальных входах. Это область Node-сборки. Источники: [high PostCSS](https://github.com/advisories/GHSA-r28c-9q8g-f849), [последующее исправление](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp).
2. **Шаблоны файлов:** `brace-expansion`, `braces`, `minimatch`, `picomatch` — CPU/память на вредоносных шаблонах. `fast-glob`, `micromatch`, `chokidar`, Tailwind, typescript-eslint и lovable-tagger наследуют часть high. Совместимые обновления нужно проверять небольшими группами, без принудительных несовместимых overrides.
3. **glob:** инъекция команды относится к CLI с `-c`/`--cmd`; такие вызовы не обнаружены в скриптах проекта. Это не исполнение shell при любом glob-поиске. [Advisory glob](https://github.com/advisories/GHSA-5j98-mcp5-4vw2).
4. **Конфигурация/кеш:** `js-yaml` — merge/alias/omap, `flatted` — разбор структур; возможны DoS/prototype pollution на недоверенном содержимом. Browserslist — память кеша и custom stats. Здесь это ESLint/Autoprefixer и сборка.
5. **Тесты:** `form-data` — CRLF в multipart-именах, `ws` — память при специально подобранных фрагментах. Приходят через jsdom/Vitest; в browser bundle не входят.
6. **Неиспользуемая библиотека графиков:** `lodash` — входы `template`, `unset`, `omit`. Совместимое обновление либо удаление неиспользуемой зависимости проверяется по импортам; интерфейс менять не требуется.

При отдельном ограниченном maintenance первым кандидатом служат совместимые патчи PostCSS и его листьев, ESLint-зависимостей и тестовых библиотек, затем audit/build/browser-check. Версии необходимо повторно сверить с advisory в момент обновления. Предложенный npm Tailwind 4.3.3 — major-миграция, способная поменять CSS. Предложение lovable-tagger 1.0.20 также помечено npm как semver-major относительно текущего диапазона; применять его вслепую нельзя. Router 7 требует отдельной проверки совместимости. Эти миграции не выполнялись.

### Все 25 high-пакетов

В таблице — один подтверждённый путь из корня зависимостей; полная классификация и advisory сохранены в JSON. «0» означает отсутствие модулей с ненулевым размером в итоговых JS chunks.

| Пакет | Пример пути | Причина / наследование | Модулей в браузере |
|---|---|---|---:|
| `@typescript-eslint/eslint-plugin` | typescript-eslint → @typescript-eslint/eslint-plugin | `@typescript-eslint/type-utils`, `@typescript-eslint/utils` | 0 |
| `@typescript-eslint/parser` | typescript-eslint → @typescript-eslint/parser | `@typescript-eslint/typescript-estree` | 0 |
| `@typescript-eslint/type-utils` | typescript-eslint → @typescript-eslint/eslint-plugin → @typescript-eslint/type-utils | `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils` | 0 |
| `@typescript-eslint/typescript-estree` | typescript-eslint → @typescript-eslint/typescript-estree | `fast-glob` | 0 |
| `@typescript-eslint/utils` | typescript-eslint → @typescript-eslint/utils | `@typescript-eslint/typescript-estree` | 0 |
| `brace-expansion` | eslint → minimatch → brace-expansion | [Advisory](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp) | 0 |
| `braces` | tailwindcss → chokidar → braces | [Advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) | 0 |
| `browserslist` | autoprefixer → browserslist | [Advisory](https://github.com/advisories/GHSA-c83g-rgw3-j3cx) | 0 |
| `chokidar` | tailwindcss → chokidar | `braces` | 0 |
| `fast-glob` | tailwindcss → fast-glob | `micromatch` | 0 |
| `flatted` | eslint → file-entry-cache → flat-cache → flatted | [Advisory](https://github.com/advisories/GHSA-25h7-pfq9-p65f) | 0 |
| `form-data` | jsdom → form-data | [Advisory](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx) | 0 |
| `glob` | tailwindcss → sucrase → glob | [Advisory](https://github.com/advisories/GHSA-5j98-mcp5-4vw2) | 0 |
| `js-yaml` | eslint → @eslint/eslintrc → js-yaml | [Advisory](https://github.com/advisories/GHSA-52cp-r559-cp3m) | 0 |
| `lodash` | recharts → lodash | [Advisory](https://github.com/advisories/GHSA-r5fr-rjxr-66jc) | 0 |
| `lovable-tagger` | lovable-tagger | `tailwindcss` | 0 |
| `micromatch` | tailwindcss → micromatch | `braces` | 0 |
| `minimatch` | eslint → minimatch | [Advisory](https://github.com/advisories/GHSA-3ppc-4f35-3m26) | 0 |
| `nanoid` | postcss → nanoid | [Advisory](https://github.com/advisories/GHSA-28wg-ghj8-5hjv) | 0 |
| `picomatch` | vite → picomatch | [Advisory](https://github.com/advisories/GHSA-c2c7-rcm5-vvqj) | 0 |
| `postcss` | postcss | [Advisory](https://github.com/advisories/GHSA-r28c-9q8g-f849) | 0 |
| `source-map-js` | postcss → source-map-js | [Advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | 0 |
| `tailwindcss` | tailwindcss | `chokidar`, `fast-glob`, `micromatch` | 0 |
| `typescript-eslint` | typescript-eslint | `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `@typescript-eslint/typescript-estree`, `@typescript-eslint/utils` | 0 |
| `ws` | jsdom → ws | [Advisory](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) | 0 |

## 5. Cloudflare и GitHub Pages

На head `0b823b7` **Workers Builds: alena-s-portfolio** завершился `FAILURE`, Vercel — `SUCCESS`. [Проверка Workers](https://github.com/xicrie/my-portfolio/runs/116708628956) содержит только ссылки на Build ID и сервис. В output нет причины, text пуст, annotations отсутствуют. Dashboard Cloudflare требует входа; лог сборки недоступен.

GitHub API подтвердил Pages `build_type=workflow`, домен `xicrie.ru`, HTTPS, source `main`. `.github/workflows/main.yml` выполняет `npm ci`, `npm run build` на Node 22, загрузку `dist` и `actions/deploy-pages`. Триггеры — push в main или ручной запуск. Нет Cloudflare, `needs` на Workers или проверки его результата. В момент проверки main не защищён обязательными status checks, rulesets пусты. Это согласуется с [отдельным workflow Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

**Вывод:** сбой Workers сам по себе не является зависимостью или обязательным блокирующим условием будущего Pages deploy. Без лога нельзя установить причину и исключить общий дефект окружения, установки или сборки, который проявится и на Pages. Нельзя утверждать, что ошибка заведомо безвредна или точно вызвана настройкой Workers.

Финальная сборка локально прошла на Node 22.23.3, на macOS с установленными зависимостями. Свежий `npm ci` на Ubuntu и удалённый workflow этой ветки не запускались. Инфраструктура не менялась. Для дальнейшей диагностики нужен лог конкретного Workers build с командой, runtime и первой ошибкой, без токенов и секретных переменных.

## 6. Сравнение до / после

Снимки получены в установленном Chrome через локальный Vite preview. «До» — сохранённая production-сборка PR `0b823b7`, «после» — локальная финальная версия. Это реальные снимки сайта, не макеты. Анимации не отключались, поэтому кадры свечения/появления могут различаться.

Файлы в пакете результатов: `comparison-cases-1440.png`, `comparison-cases-390.png`, `comparison-hh-1440.png`, `comparison-hh-390.png`; отдельные снимки имеют префиксы `before-` и `after-`. В копии отчёта, выданной пользователю, эти файлы снабжены прямыми локальными ссылками.

Сохранены сравнения кейсов 1440/390 px, HH до/после и отдельные снимки 320/768 px. Размеры/координаты фото hero и шрифт/размер H1 совпадают на четырёх ширинах. В восьми снятых состояниях нет переполнения документа, сломанных изображений кейсов и пойманных runtime-ошибок. Снимки проверены визуально; desktop снят с одинаковым отступом заголовка от fixed-навигации.

## 7. Повторные проверки

| Проверка | Результат |
|---|---|
| Production build на установленном Node 24 и на Node 22.23.3 | Оба прошли, имена итоговых JS/CSS совпадают |
| TypeScript app, node, отдельно Playwright-файлы | Все прошли |
| Playwright production preview / Chrome | **11 passed**, ширины 320, 390, 768, 1024, 1440 px |
| Новая проверка AI | Default, explicit All/reload, AI первым во All, marketing direct link, неизвестный параметр, отсутствие прямых JSON-ссылок на AI-карточках |
| Прежние browser-сценарии | Фильтры/Back, диалоги/focus, клавиатура, контакты, меню, навыки, карусель и границы scroll прошли |
| Vitest | Исходный демонстрационный тест прошёл; это не содержательное покрытие сайта |
| ESLint изменённых TS/TSX | Успех |
| Глобальный ESLint | **Не проходит: прежние 4 ошибки и 7 warnings** в UI-компонентах и tailwind.config.ts; эти файлы не менялись |
| npm audit | 25 high / 7 moderate / 1 low: разобраны, не устранены массовым обновлением |
| Визуальная проверка | Desktop/mobile, hero и HH; основные сравнения просмотрены |
| git diff --check | Успех |

Сохранились предупреждения Vite о chunk >500 kB и устаревшей caniuse-lite. Разделение bundle, смена стека и реорганизация анимаций не входили в задачу. Firefox, Safari и реальные устройства повторно не проверялись. Новые функции и backend не добавлялись.

Архитектура, глобальные стили, зависимости, workflow, фотографии, остальные SVG и технические JSON остались без изменений относительно предыдущего head PR. Локальные preview-процессы после проверки остановлены. Локальные результаты с перечисленными остаточными замечаниями не являются разрешением на публикацию.
