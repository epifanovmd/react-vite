import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Kanban,
  type KanbanCardData,
  type KanbanColumnData,
  type KanbanItems,
  type KanbanWorkflow,
  Switch,
} from "@components/ui";
import { GripVertical, Lock } from "lucide-react";
import { FC, useState } from "react";

import { WorkflowDiagram } from "./WorkflowDiagram";

interface TaskCard extends KanbanCardData {
  title: string;
  priority: "low" | "medium" | "high";
  assignee: string;
}

const PRIORITY_LABEL: Record<TaskCard["priority"], string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

const PRIORITY_VARIANT: Record<
  TaskCard["priority"],
  "muted" | "warning" | "destructive"
> = {
  low: "muted",
  medium: "warning",
  high: "destructive",
};

const COLUMNS: KanbanColumnData[] = [
  { id: "todo", title: "К выполнению" },
  { id: "in-progress", title: "В работе" },
  { id: "review", title: "На проверке" },
  { id: "done", title: "Готово" },
];

const WORKFLOW: KanbanWorkflow = {
  todo: ["in-progress"],
  "in-progress": ["review", "todo"],
  review: ["done", "in-progress"],
  done: [],
};

const COLUMN_VARIANT: Record<string, "muted" | "info" | "warning" | "success"> =
  {
    todo: "muted",
    "in-progress": "info",
    review: "warning",
    done: "success",
  };

const LOCKABLE_CARD_ID = "task-6";

const INITIAL_ITEMS: KanbanItems<TaskCard> = {
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

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const ToggleRow: FC<ToggleRowProps> = ({ label, checked, onCheckedChange }) => (
  <label className="flex items-center gap-2 text-xs text-foreground">
    <Switch size="sm" checked={checked} onCheckedChange={onCheckedChange} />
    {label}
  </label>
);

export const WorkflowKanbanExample: FC = () => {
  const [lastMove, setLastMove] = useState<string | null>(null);
  const [lastClicked, setLastClicked] = useState<string | null>(null);
  const [enforceWorkflow, setEnforceWorkflow] = useState(true);
  const [lockLastCard, setLockLastCard] = useState(true);
  const [handleOnly, setHandleOnly] = useState(false);
  const [boardDisabled, setBoardDisabled] = useState(false);
  const [highlightOnDragStart, setHighlightOnDragStart] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Воркфлоу и drag-хендл</CardTitle>
        <CardDescription className="text-xs">
          Каждое перетаскивание — один переход в графе статусов ниже; из
          начального статуса разрешён только явно указанный набор целей.
        </CardDescription>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/60 pt-3">
          <ToggleRow
            label="Ограничивать переходы по воркфлоу"
            checked={enforceWorkflow}
            onCheckedChange={setEnforceWorkflow}
          />
          <ToggleRow
            label="Заблокировать «Настроить мониторинг ошибок»"
            checked={lockLastCard}
            onCheckedChange={setLockLastCard}
          />
          <ToggleRow
            label="Тянуть только за ручку"
            checked={handleOnly}
            onCheckedChange={setHandleOnly}
          />
          <ToggleRow
            label="Отключить доску целиком"
            checked={boardDisabled}
            onCheckedChange={setBoardDisabled}
          />
          <ToggleRow
            label="Подсвечивать воркфлоу сразу при начале перетаскивания"
            checked={highlightOnDragStart}
            onCheckedChange={setHighlightOnDragStart}
          />
        </div>
      </CardHeader>
      <CardContent>
        {enforceWorkflow && (
          <WorkflowDiagram
            columns={COLUMNS}
            workflow={WORKFLOW}
            columnVariant={COLUMN_VARIANT}
          />
        )}

        <div className={enforceWorkflow ? "mt-3 h-[520px]" : "h-[520px]"}>
          <Kanban<TaskCard, KanbanColumnData>
            columns={COLUMNS}
            defaultItems={INITIAL_ITEMS}
            workflow={enforceWorkflow ? WORKFLOW : undefined}
            isCardDraggable={
              lockLastCard ? card => card.id !== LOCKABLE_CARD_ID : undefined
            }
            disabled={boardDisabled}
            highlightOnDragStart={enforceWorkflow && highlightOnDragStart}
            onCardClick={card => setLastClicked(card.title)}
            renderColumnHeader={(column, count) => (
              <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                <Badge variant={COLUMN_VARIANT[column.id] ?? "muted"}>
                  {column.title}
                </Badge>
                <Badge variant="muted">{count}</Badge>
              </div>
            )}
            renderCard={(card, meta) => (
              <div className="flex flex-col gap-2 p-3">
                <div className="flex items-start gap-2">
                  {handleOnly && (
                    <GripVertical
                      ref={meta.dragHandleRef}
                      className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground active:cursor-grabbing"
                    />
                  )}
                  <span className="flex-1 text-sm font-medium leading-snug text-foreground">
                    {card.title}
                  </span>
                  {lockLastCard && card.id === LOCKABLE_CARD_ID && (
                    <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={
                    handleOnly
                      ? "flex items-center justify-between pl-6"
                      : "flex items-center justify-between"
                  }
                >
                  <Badge variant={PRIORITY_VARIANT[card.priority]}>
                    {PRIORITY_LABEL[card.priority]}
                  </Badge>
                  <Avatar size="sm" name={card.assignee} />
                </div>
              </div>
            )}
            onCardDrop={event =>
              setLastMove(
                `«${event.card.title}»: ${event.fromColumnId} → ${event.toColumnId} (позиция ${event.toIndex + 1})`,
              )
            }
          />
        </div>

        {lastMove && (
          <p className="mt-3 text-xs text-muted-foreground">
            Последнее перемещение: {lastMove}
          </p>
        )}
        {lastClicked && (
          <p className="mt-1 text-xs text-muted-foreground">
            Последний клик по карточке: «{lastClicked}»
          </p>
        )}
      </CardContent>
    </Card>
  );
};
