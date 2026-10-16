---
name: Testing (Vitest)
description: Vitest 4 + Testing Library setup, где лежат тесты, 100%-coverage порог на shared/lib/holders
type: project
---

## Setup

- `vitest.config.ts` — без mergeConfig: плагин react + `alias`/`define`, экспортированные из `vite.config.ts`. `environment: jsdom`, `globals: true`, `setupFiles: ["./vitest.setup.ts"]`, `restoreMocks: true`. Include: `./src/**/*.{spec,test}.{ts,tsx}`.
- Стек: Vitest 4, @testing-library/react 16, @testing-library/jest-dom, jsdom.
- Команды: `yarn test` (run), `yarn test:dev` (watch), `yarn test:coverage`.
- Тесты гоняются на pre-push (lefthook, вместе с typecheck) и в CI; на коммит — только eslint/prettier по изменённым файлам.

## Где лежат тесты

Рядом с кодом в папках `__tests__/` (~70+ файлов): `shared/lib/holders/__tests__/`, `shared/ui/{select,input,textarea,segmented,foundation}/__tests__/` (у select — также в `strategies/`, `primitives/`, `hooks/`), `pages/ui-kit-demo/sections/forms/__tests__/`.

## Coverage — жёсткий порог на холдеры

`coverage.include` — ТОЛЬКО `src/shared/lib/holders/**` (исключая `index.ts`, `*.types.ts`, `__tests__/`), пороги 100/100/100/100 (statements/branches/functions/lines). Любое изменение в `shared/lib/holders` обязано сопровождаться тестами до полного покрытия — иначе `yarn test:coverage` падает.

## Конвенции

Тест проверяет наблюдаемое поведение, не реализацию; регрессионный тест при фиксе бага; сгенерированный код (`shared/api/gen`) напрямую не тестируется — см. `CONVENTIONS.md` §14.

## Живая проверка экранов (свой стенд)

- Свой сервер API (настройки — из `test/e2e/harness.ts` бэкенда): `NODE_ENV=test`, свой порт (8191), отдельная база (`CREATE DATABASE … ` в контейнере `dev-postgres`, потом `DROP`), Redis `db 14`, `STORAGE_DRIVER=local`, свои `ADMIN_*`, `CORS_ALLOWED_ORIGINS=http://localhost:<порт vite>` (иначе сокет не пустит).
- Свой vite: `VITE_HOST/PORT/BASE_URL/SOCKET_BASE_URL` в окружении перекрывают `.env.development`. Чтобы не трогать кэш `node_modules/.vite` vite пользователя — свой конфиг в scratchpad: `import base from "<проект>/vite.config.ts"; export default (env) => ({...base(env), root: "<проект>", cacheDir: "<scratchpad>/vite-cache"})` (конфиг — функция от mode) и `vite --config <он> --port N --strictPort`.
- Браузер: `puppeteer-core` в scratchpad (`browser/`) + установленный Chrome (`headless: "new"`, свой `userDataDir`). Форма входа заполнена значениями по умолчанию — поля очищать перед вводом; Radix-вкладки переключаются `mousedown`.
- Вход на API пользователя (:8181) его учётной записью — запрещено правилами доступа; только свой стенд.
- Без браузерного MCP — headless Chrome по CDP: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=<порт> --user-data-dir=<scratchpad>/chrome`, скрипт на глобальном `WebSocket` Node 24 (`Runtime.evaluate`, `Page.captureScreenshot`). Вкладки Radix и Select открываются только последовательностью pointerdown → mousedown → pointerup → mouseup → click; значение поля — нативным сеттером `value` + события `input`/`change`. Кнопку отправки искать `form button[type=submit]` (текст «Отправить» бывает и в описании маршрута). Vite стенда — `VITE_BASE_URL=http://localhost:<API> VITE_SOCKET_BASE_URL=… VITE_PORT=<порт> vite --port <порт> --strictPort` (`/api` и `/socket.io` проксируются на `VITE_BASE_URL` / `VITE_SOCKET_BASE_URL`).
