# React Vite

Клиентское веб-приложение на React + Vite, построенное по Feature-Sliced Design.

##### Stack:

- TypeScript
- React 19
- Vite 8
- MobX 6 (state management)
- Inversify 8 (DI)
- Axios (HTTP) + orval (codegen)
- TanStack Router (file-based routing)
- Tailwind CSS 4
- Socket.IO (real-time)

### Architecture

Проект построен по методологии
**[Feature-Sliced Design](https://feature-sliced.design)**:
`app → pages → widgets → features → entities → shared`.

```
src/
  app/        ← композиционный корень (точка входа, роутер, DI-модули, глобальные стили)
  pages/      ← экраны — тонкая композиция widgets/features/entities под маршрут
  widgets/    ← крупные самостоятельные блоки UI
  features/   ← пользовательские сценарии и действия
  entities/   ← бизнес-сущности: состояние и доменные модели, без UI-форм
  shared/     ← переиспользуемый код без знания о бизнес-логике
    ui/       ←   UI-кит
    api/      ←   HTTP-клиент и сгенерированные контракты
    config/   ←   конфигурация окружения
    lib/      ←   независимые технические модули (DI, async-состояние, транспорт, хранилище, тема, уведомления, утилиты)
```

Документация:

- архитектурная модель, слои, границы и правила зависимостей — [ARCHITECTURE.md](ARCHITECTURE.md);
- памятка «что куда класть» — [FSD-CHEATSHEET.md](FSD-CHEATSHEET.md);
- правила написания кода — [CONVENTIONS.md](CONVENTIONS.md);
- принципы проектирования — [CLEAN-CODE.md](CLEAN-CODE.md) и [DESIGN-PRINCIPLES.md](DESIGN-PRINCIPLES.md).

Документация описывает общие принципы и не содержит описания конкретных слайсов и
модулей. Она меняется только в исключительных случаях — когда меняется архитектура,
принцип или паттерн проекта.

### Requirements

- Node.js >= 22.12.0
- Yarn >= 1.22.18

### Installation

```sh
git clone <repository-url>
cd <project-directory>
yarn
```

Скопируйте файлы окружения (`.env.development` / `.env.production`) и при необходимости
поправьте адреса backend и real-time транспорта.

### Run

```sh
yarn dev
```

Application listening on: http://localhost:3000

### Build

```sh
yarn build
```

Собранный бандл — в `dist/`. Локально проверить прод-сборку:

```sh
yarn prod           # локальный предпросмотр прод-сборки
```

### Деплой

Образ: `Dockerfile` собирает статику, отдаёт её nginx (`nginx.conf`: SPA-fallback на
`index.html`, долгий кэш `/assets`). `VITE_*` встраиваются при сборке —
`.env.production`, поверх для конкретного сервера — `.env.production.local`.

Деплой по SSH — исходники на хост (rsync, исключения — `.deployignore`) и сборка там же:

```sh
cp .env.deploy.example .env.deploy   # хост, каталог, порт (файл не в git)
make env                             # один раз: .env.production.local на хост (если нужен)
make deploy                          # sync → build → up
make status | logs | restart | down
```

Любое значение из `.env.deploy` переопределяется в команде: `make deploy SSH_HOST=…`.

### Checks

Обязательный минимум перед merge (это же выполняет pre-commit hook):

```sh
yarn lint            # eslint, включая границы слоёв FSD — 0 ошибок
yarn typecheck       # tsc --noEmit
yarn test            # vitest run
```

Автофиксы:

```sh
yarn lint:fix
yarn prettier:fix
```

### API codegen

HTTP-клиент и типы генерируются из OpenAPI-схемы и **не редактируются вручную**:

```sh
yarn generate:orval
```

То же относится к сгенерированному дереву маршрутов роутера.

### License

MIT

**Free Software, Good Work!**
