import { cn } from "@shared/lib/utils/cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Kanban,
  type KanbanCardRenderMeta,
} from "@shared/ui";
import type { FC } from "react";
import { useCallback } from "react";

import { TaskCardView } from "./TaskCardView";
import { ToggleRow } from "./ToggleRow";
import { useWorkflowKanbanExample } from "./useWorkflowKanbanExample";
import {
  COLUMN_VARIANT,
  COLUMNS,
  INITIAL_ITEMS,
  type TaskCard,
  WORKFLOW,
  type WorkflowColumn,
} from "./workflow-kanban.data";
import { WorkflowColumnHeader } from "./WorkflowColumnHeader";
import { WorkflowDiagram } from "./WorkflowDiagram";

const renderColumnHeader = (column: WorkflowColumn, count: number) => (
  <WorkflowColumnHeader column={column} count={count} />
);

export const WorkflowKanbanExample: FC = () => {
  const {
    lastMove,
    lastClicked,
    enforceWorkflow,
    setEnforceWorkflow,
    lockLastCard,
    setLockLastCard,
    handleOnly,
    setHandleOnly,
    boardDisabled,
    setBoardDisabled,
    highlightOnDragStart,
    setHighlightOnDragStart,
    workflow,
    isCardDraggable,
    highlight,
    isCardLocked,
    onCardClick,
    onCardDrop,
  } = useWorkflowKanbanExample();

  const renderCard = useCallback(
    (card: TaskCard, meta: KanbanCardRenderMeta) => (
      <TaskCardView
        card={card}
        meta={meta}
        handleOnly={handleOnly}
        locked={isCardLocked(card)}
      />
    ),
    [handleOnly, isCardLocked],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Воркфлоу и drag-хендл</CardTitle>
        <CardDescription className="text-xs">
          Каждое перетаскивание — один переход в графе статусов ниже; из
          начального статуса разрешён только явно указанный набор целей. У
          колонки «На проверке» WIP-лимит 3 — сверх него карточки из других
          колонок не принимаются.
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

        <div className={cn("h-[520px]", enforceWorkflow && "mt-3")}>
          <Kanban<TaskCard, WorkflowColumn>
            columns={COLUMNS}
            defaultItems={INITIAL_ITEMS}
            workflow={workflow}
            isCardDraggable={isCardDraggable}
            disabled={boardDisabled}
            highlightOnDragStart={highlight}
            onCardClick={onCardClick}
            renderColumnHeader={renderColumnHeader}
            renderCard={renderCard}
            onCardDrop={onCardDrop}
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
