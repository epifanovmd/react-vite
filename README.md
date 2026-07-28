# React Vite

Messenger/admin panel built with React + Vite + MobX + Inversify.

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

Проект построен по методологии **[Feature-Sliced Design](https://feature-sliced.design)**: `app → pages → widgets → features → entities → shared`.

```
src/
  app/        ← композиционный корень (App.tsx, router.tsx, routes/, DI-модули, стили)
  pages/      ← экраны — тонкая композиция widgets/features/entities под роут
  widgets/    ← крупные самостоятельные блоки UI (app-layout, auth-layout)
  features/   ← юзкейсы (sign-in, sign-up, edit-profile, ...)
  entities/   ← бизнес-сущности — состояние и модели, без UI-форм (auth, user)
  shared/     ← переиспользуемый код без знания о бизнес-логике
    ui/       ←   UI-кит
    api/      ←   HttpClient + orval codegen
    config/   ←   env
    lib/      ←   DI, holders, socket, storage, theme, notifications, models, utils
```

Подробнее про слои, правила зависимостей, DI и конвенции именования: [ARCHITECTURE.md](ARCHITECTURE.md)

### Requirements

- Node.js >= 22.12.0
- Yarn >= 1.22.18

### Installation

```sh
git clone https://github.com/epifanovmd/react-vite.git
cd react-vite
yarn
```

Скопируйте `.env.development` / `.env.production` и при необходимости поправьте `VITE_BASE_URL` / `VITE_SOCKET_BASE_URL`.

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
yarn prod
```

### Lint & Format

```sh
yarn lint:fix        # eslint --fix
yarn prettier:fix     # prettier --write
```

Границы слоёв FSD (`boundaries/dependencies`) и self-import правила проверяются линтером — 0 ошибок обязательны для мержа.

### API codegen

HTTP-клиент и типы (`src/shared/api/gen/`) генерируются из OpenAPI-схемы через orval и **не редактируются вручную**:

```sh
yarn generate:orval
```

### License

MIT

**Free Software, Good Work!**
