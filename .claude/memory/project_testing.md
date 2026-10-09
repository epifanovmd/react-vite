---
name: Testing (Vitest)
description: Vitest 4 + Testing Library setup, где лежат тесты, 100%-coverage порог на shared/lib/holders
type: project
---

## Setup

- `vitest.config.ts` — `mergeConfig(viteConfig, ...)`: наследует алиасы/плагины из `vite.config.ts`. `environment: jsdom`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`, `restoreMocks: true`. Include: `./src/**/*.{spec,test}.{ts,tsx}`.
- Стек: Vitest 4, @testing-library/react 16, @testing-library/jest-dom, jsdom.
- Команды: `yarn test` (run), `yarn test:dev` (watch), `yarn test:coverage`.
- Тесты гоняются в pre-commit (`precommit`: `lint-staged && tsc --noEmit && vitest run`) — падающий тест блокирует коммит.

## Где лежат тесты

Рядом с кодом в папках `__tests__/` (~70+ файлов): `shared/lib/holders/__tests__/`, `shared/ui/{select,input,textarea,segmented,foundation}/__tests__/` (у select — также в `strategies/`, `primitives/`, `hooks/`), `pages/ui-kit-demo/sections/forms/__tests__/`.

## Coverage — жёсткий порог на холдеры

`coverage.include` — ТОЛЬКО `src/shared/lib/holders/**` (исключая `index.ts`, `*.types.ts`, `__tests__/`), пороги 100/100/100/100 (statements/branches/functions/lines). Любое изменение в `shared/lib/holders` обязано сопровождаться тестами до полного покрытия — иначе `yarn test:coverage` падает.

## Конвенции

Тест проверяет наблюдаемое поведение, не реализацию; регрессионный тест при фиксе бага; сгенерированный код (`shared/api/gen`) напрямую не тестируется — см. `CONVENTIONS.md` §14.

## Живая проверка экранов агентов (свой стенд)

- Свой API шаблона — по образцу `test/e2e/harness.ts` бэкенда: `NODE_ENV=test`, свой порт (8191), отдельная база (`CREATE DATABASE … ` в контейнере `dev-postgres`, потом `DROP`), Redis `db 14`, `STORAGE_DRIVER=local`, свои `ADMIN_*` и `AGENT_BOOTSTRAP_TOKEN`, `CORS_ALLOWED_ORIGINS=http://localhost:<порт vite>` (иначе сокет не пустит).
- Свой агент — `scripts/agent-dev.sh start|stop` бэкенда с `AGENT_DIR=.agent-<имя>` (в корне бэкенда: путь unix-сокетов воркеров должен быть коротким, scratchpad слишком длинный), `SERVER_PORT`, `AGENT_BOOTSTRAP_TOKEN`; после — `stop` и удалить каталог.
- Свой vite: `VITE_PROTOCOL/HOST/PORT/BASE_URL/SOCKET_BASE_URL` в окружении перекрывают `.env.development`. Чтобы не трогать кэш `node_modules/.vite` vite пользователя — свой конфиг в scratchpad: `import base from "<проект>/vite.config.ts"; export default {...base, root: "<проект>", cacheDir: "<scratchpad>/vite-cache"}` и `vite --config <он> --port N --strictPort`.
- Свой агент — `AGENT_DIR=.agent-<имя> AGENT_NAME=… SERVER_PORT=… AGENT_BOOTSTRAP_TOKEN=… yarn agent:start|stop` в бэкенде (берёт `agent/release`); у API для живой проверки удобно `AGENT_STATUS_INTERVAL_MS=1000`. `agent:stop` останавливает и воркеры. Файлы задач с `withOutput` (S3 `e2e`, `jobs/<id>/echo.txt`) — удалить после.
- Проверено 09.10.2026: отложенная замена (echo.long → перезапуск → бейдж → тост за ~7 с), quick/long/отмена/файл итога, fetch (воркер 200/404, API 403 PATH_FORBIDDEN), удаление ключа (`deleting` → `deleted` < 1 с), offline агента — «нет связи» везде за ~3,6 с.
- Браузер: `puppeteer-core` в scratchpad (`browser/`) + установленный Chrome (`headless: "new"`, свой `userDataDir`). Форма входа заполнена значениями по умолчанию — поля очищать перед вводом; Radix-вкладки переключаются `mousedown`.
- Вход на API пользователя (:8181) его учётной записью — запрещено правилами доступа; только свой стенд.
- Без браузерного MCP — headless Chrome по CDP: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=<порт> --user-data-dir=<scratchpad>/chrome`, скрипт на глобальном `WebSocket` Node 24 (`Runtime.evaluate`, `Page.captureScreenshot`). Вкладки Radix и Select открываются только последовательностью pointerdown → mousedown → pointerup → mouseup → click; значение поля — нативным сеттером `value` + события `input`/`change`. Кнопку отправки искать `form button[type=submit]` (текст «Отправить» бывает и в описании маршрута). Vite стенда — `VITE_BASE_URL=http://localhost:<API> VITE_SOCKET_BASE_URL=… VITE_PORT=<порт> vite --port <порт> --strictPort` (`/api` проксируется на `VITE_BASE_URL`).
- Проверено 09.10.2026 (манифест со схемами): форма по схеме `POST /echo` → ответ воркера; ошибка поля до отправки; JSON не по схеме → «Тело не подходит под схему» + `details.reason`; поля пути нет; каталог воркера (5 разделов); фильтр событий по объявленным типам (+ `job.*`), схема `data`, бейдж «data не по схеме»; `echo.quick` с «Префикс от сервера» → `[<агент>] ТЕКСТ`.
