# React Vite

Messenger/admin panel built with React + Vite + MobX + Inversify.

##### Stack:
- TypeScript 6
- React 19
- Vite 8
- MobX 6 (state management)
- Inversify 8 (DI)
- Axios (HTTP) + orval (codegen)
- TanStack Router (file-based routing)
- Tailwind CSS 4
- Socket.IO (real-time)

### Architecture

```
src/
  auth/     ← аутентификация (services, store, pages)
  user/     ← пользователь (store, pages, models)
  lib/      ← инфраструктура (storage, socket, notification, theme)
  api/      ← HTTP client + orval codegen
  store/    ← shared state (AppDataStore, holders)
  components/ ← shared UI kit
  di/       ← DI-контейнер
  routes/   ← TanStack Router
```

Подробнее: [ARCHITECTURE.md](ARCHITECTURE.md)

### Installation

```sh
git clone https://github.com/epifanovmd/react-vite.git
cd react-vite
yarn
```

### Run

```sh
yarn dev
```

Application listening on: http://localhost:3000

### Build

```sh
yarn build
```

### Lint

```sh
yarn lint:fix
```

### License

MIT

**Free Software, Good Work!**
