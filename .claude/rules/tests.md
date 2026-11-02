---
paths:
  - "src/**/__tests__/**"
  - "src/**/testing/**"
  - "vitest.config.ts"
  - "vitest.setup.ts"
---

# Тесты

- Тест проверяет поведение, не реализацию; не зависит от порядка; без реальной сети
  ([conventions/tests](../../docs/30-conventions/tests.md)).
- Багфикс — тест, падающий на текущем коде, до исправления
  ([bugfix](../../docs/10-process/bugfix.md)).
- Фейки: транспорт — `createFakeTransport`/`createTestClient`, доступ —
  `createFakeAccess`, сокет — `createFakeSocket`; методы MobX-стора не `spyOn`
  ([tech/testing](../../docs/50-tech/testing.md)).
- Сгенерированный код напрямую не тестируется.
