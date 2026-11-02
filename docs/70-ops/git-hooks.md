---
id: ops/git-hooks
title: Git-хуки
summary: lefthook — pre-commit (eslint и prettier по изменённым файлам), pre-push (типы и тесты).
layer: project
roles: [devops, developer]
stages: [commit]
depends_on: [process/git]
---

# Git-хуки

## lefthook — `lefthook.yml`

Устанавливается `yarn` (`prepare: lefthook install`).

| Хук          | Что                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------- |
| `pre-commit` | изменённые файлы: `*.{ts,tsx}` → `eslint --fix`, прочие → `prettier --write` (`stage_fixed`) |
| `pre-push`   | параллельно `yarn typecheck` и `yarn test`                                                   |
