# Портфолио Алёны Степановой

Сайт: https://xicrie.ru/

React, TypeScript, Vite и Tailwind CSS. GitHub Pages публикует ветку `main` через `.github/workflows/main.yml`.

## Локальная работа

```sh
npm ci
npm run dev
```

## Проверки и сборка

```sh
npx tsc --noEmit -p tsconfig.app.json
npx tsc --noEmit -p tsconfig.node.json
npm run lint
npm test
npm run build
PLAYWRIGHT_CHANNEL=chrome PLAYWRIGHT_BASE_URL=http://127.0.0.1:8090 npx playwright test
```

Для браузерных проверок production-сборки сначала запустите `npm run preview -- --host 127.0.0.1 --port 8090`. Chrome должен быть установлен; для Chromium Playwright можно не указывать `PLAYWRIGHT_CHANNEL`.

Сборка создаёт индексируемую главную, девять самостоятельных страниц `/cases/<id>/`, `sitemap.xml`, `robots.txt`, страницу 404 и `version.json` с SHA опубликованного коммита. Главная сохраняет интерактивное чтение кейсов и фильтры; самостоятельные страницы доступны без JavaScript.

## Публикация

Обычный push в `main` запускает проверки, production build и deployment GitHub Pages. Текущий домен и HTTPS настроены в GitHub Pages. `version.json` на публичном сайте позволяет сверить опубликованную версию с коммитом workflow.
