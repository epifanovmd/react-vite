---
paths:
  - "docs/**"
  - "CLAUDE.md"
  - "README.md"
  - ".claude/**"
  - "scripts/**"
---

# Система знаний

- Защищено: правка только по команде `/docs-edit`; иначе — предложение в
  `docs/inbox/` ([protection](../../docs/00-meta/protection.md)).
- Формат, место и размер документов — [authoring](../../docs/00-meta/authoring.md).
- Одно правило — в одном месте; остальные ссылаются. После правки —
  `yarn docs:index` и `yarn docs:check`.
