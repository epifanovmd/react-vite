---
id: ops/git-hooks
title: Git-хуки и хуки агента
summary: lefthook (pre-commit, commit-msg, pre-push) и хуки Claude Code (защита документов, разблокировка).
layer: project
roles: [devops, developer]
stages: [commit]
depends_on: [process/git, meta/protection]
---

# Git-хуки и хуки агента

## lefthook — `lefthook.yml`

Устанавливается `yarn` (`prepare: lefthook install`).

| Хук          | Что                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------- |
| `pre-commit` | изменённые файлы: `*.{ts,tsx}` → `eslint --fix`, прочие → `prettier --write` (`stage_fixed`) |
| `commit-msg` | формат сообщения — `scripts/git/commit-msg.mjs` ([process/git](../10-process/git.md))        |
| `pre-push`   | параллельно `yarn typecheck` и `yarn test`                                                   |

## Хуки Claude Code — `.claude/settings.json`

| Событие            | Скрипт                           | Что                                                   |
| ------------------ | -------------------------------- | ----------------------------------------------------- |
| `PreToolUse`       | `.claude/hooks/protect-docs.mjs` | отклоняет запись в защищённые пути без разблокировки  |
| `UserPromptSubmit` | `.claude/hooks/docs-unlock.mjs`  | `/docs-edit` открывает правку, `/docs-lock` закрывает |
| `SessionStart`     | `.claude/hooks/docs-unlock.mjs`  | новая сессия — правка закрыта                         |

Флаг разблокировки — `.claude/.docs-unlock` (вне git), живёт 60 минут. Правила —
[meta/protection](../00-meta/protection.md). Изменения хуков применяются после
перезапуска сессии Claude Code.
