---
paths:
  - "src/app/routes/**"
  - "src/app/router.tsx"
---

# Маршруты

- Имена файлов задаёт роутер; периметр — pathless `_app` / `_auth`.
- Файл маршрута только ссылается на компонент страницы; параметры страница читает
  через `getRouteApi`; guards — `IAuthStore.getInstance()` + `redirect`.
- Подробно — [app](../../src/app/README.md), экраны — [domain/screens](../../docs/60-domain/screens.md).
