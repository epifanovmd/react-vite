---
id: ops/live-testing
title: Живая проверка на своём стенде
summary: Одноразовый стенд — свой API, своя база, свой vite, headless Chrome по CDP; что запрещено.
layer: project
roles: [tester, developer]
stages: [verification]
depends_on: [ops/environment]
---

# Живая проверка на своём стенде

## Запрещено

- Входить на API пользователя (:8181) его учётной записью и менять его данные.
- Запускать серверы против удалённой базы — только одноразовые контейнеры.
- Трогать кэш `node_modules/.vite` пользователя.

## Стенд

- **API**: свой процесс бэкенда (настройки — `test/e2e/harness.ts` бэкенда):
  `NODE_ENV=test`, свой порт (8191), отдельная база (`CREATE DATABASE …` в контейнере
  `dev-postgres`, после — `DROP`), Redis `db 14`, `STORAGE_DRIVER=local`, свои `ADMIN_*`,
  `CORS_ALLOWED_ORIGINS=http://localhost:<порт vite>` (иначе сокет не пустит).
- **Vite**: `VITE_BASE_URL=http://localhost:<API> VITE_SOCKET_BASE_URL=… VITE_PORT=<порт>`
  в окружении перекрывают `.env.development`. Свой конфиг в scratchpad:
  `import base from "<проект>/vite.config.ts"; export default (env) => ({ ...base(env), root: "<проект>", cacheDir: "<scratchpad>/vite-cache" })`,
  запуск `vite --config <он> --port N --strictPort`.

## Браузер

- `puppeteer-core` в scratchpad + установленный Chrome (`headless: "new"`, свой
  `userDataDir`), либо headless Chrome по CDP:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=<порт> --user-data-dir=<scratchpad>/chrome`
  и скрипт на глобальном `WebSocket` Node 24 (`Runtime.evaluate`,
  `Page.captureScreenshot`, `Runtime.consoleAPICalled` — предупреждения React).
- Вкладки Radix и Select открываются последовательностью pointerdown → mousedown →
  pointerup → mouseup → click; значение поля — нативным сеттером `value` + события
  `input`/`change`.
- Форма входа заполнена значениями по умолчанию — очищать перед вводом.
- Кнопка отправки — `form button[type=submit]`.
- UI Kit `/ui` публичный: обход разделов без входа, в тёмной и светлой теме.
