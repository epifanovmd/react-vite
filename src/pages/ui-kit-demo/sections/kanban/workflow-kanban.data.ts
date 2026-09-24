import type {
  KanbanCardData,
  KanbanColumnData,
  KanbanItems,
  KanbanWorkflow,
} from "@shared/ui";

/** Колонка демо: заголовок — строка, чтобы подставлять его в текст сообщений. */
export interface WorkflowColumn extends KanbanColumnData {
  title: string;
}

export interface TaskCard extends KanbanCardData {
  title: string;
  priority: "low" | "medium" | "high";
  assignee: string;
}

export const PRIORITY_LABEL: Record<TaskCard["priority"], string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export const PRIORITY_VARIANT: Record<
  TaskCard["priority"],
  "muted" | "warning" | "destructive"
> = {
  low: "muted",
  medium: "warning",
  high: "destructive",
};

export const COLUMNS: WorkflowColumn[] = [
  { id: "todo", title: "К выполнению" },
  { id: "in-progress", title: "В работе" },
  { id: "review", title: "На проверке", limit: 3 },
  { id: "done", title: "Готово" },
];

export const WORKFLOW: KanbanWorkflow = {
  todo: ["in-progress"],
  "in-progress": ["review", "todo"],
  review: ["done", "in-progress"],
  done: [],
};

export const COLUMN_VARIANT: Record<
  string,
  "muted" | "info" | "warning" | "success"
> = {
  todo: "muted",
  "in-progress": "info",
  review: "warning",
  done: "success",
};

/** Карточка, которую можно заблокировать переключателем. */
export const LOCKABLE_CARD_ID = "task-6";

export const INITIAL_ITEMS: KanbanItems<TaskCard> = {
  todo: [
    {
      id: "task-1",
      title: "Спроектировать схему БД",
      priority: "high",
      assignee: "Анна Орлова",
    },
    {
      id: "task-2",
      title: "Настроить CI-пайплайн",
      priority: "medium",
      assignee: "Игорь Титов",
    },
  ],
  "in-progress": [
    {
      id: "task-3",
      title: "Интеграция с платёжным шлюзом",
      priority: "high",
      assignee: "Мария Седых",
    },
  ],
  review: [
    {
      id: "task-4",
      title: "Обновить дизайн профиля",
      priority: "low",
      assignee: "Дана Ким",
    },
    {
      id: "task-5",
      title: "Ревью PR #482",
      priority: "medium",
      assignee: "Анна Орлова",
    },
  ],
  done: [
    {
      id: LOCKABLE_CARD_ID,
      title: "Настроить мониторинг ошибок",
      priority: "medium",
      assignee: "Игорь Титов",
    },
  ],
};

export const COLUMN_TITLE_BY_ID = new Map(
  COLUMNS.map(column => [column.id, column.title]),
);
