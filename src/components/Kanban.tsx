import classNames from "classnames";
import React, { memo } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
  DragStart,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from "react-beautiful-dnd";

type Task = {
  id: string;
  content: string;
  allowedColumns: string[]; // Добавляем массив разрешенных колонок
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type ColumnMap = {
  [key: string]: Column;
};

const initialColumns: ColumnMap = {
  todo: {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "task-1",
        content: "Implement login page",
        allowedColumns: ["inProgress", "toDevReview"], // Можно перенести только в эти колонки
      },
      {
        id: "task-2",
        content: "Design database schema",
        allowedColumns: ["inProgress"],
      },
      {
        id: "task-3",
        content: "Set up CI/CD pipeline",
        allowedColumns: ["inProgress", "done"], // Можно перенести в "In Progress" или "Done"
      },
    ],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    tasks: [
      {
        id: "task-4",
        content: "Develop user profile API",
        allowedColumns: ["toDevReview", "done"],
      },
    ],
  },
  toDevReview: {
    id: "toDevReview",
    title: "To Dev Review",
    tasks: [],
  },
  inDevReview: {
    id: "inDevReview",
    title: "In Dev Review",
    tasks: [],
  },
  done: {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "task-5",
        content: "Create project repository",
        allowedColumns: [], // Завершенные задачи нельзя никуда переносить
      },
    ],
  },
};

export const KanbanBoard: React.FC = memo(() => {
  const [columns, setColumns] = React.useState<ColumnMap>(initialColumns);
  const [isDragging, setIsDragging] = React.useState(false);
  const [draggedTask, setDraggedTask] = React.useState<Task | null>(null);
  const [sourceColumnId, setSourceColumnId] = React.useState<string | null>(
    null,
  );

  const onDragStart = (start: DragStart) => {
    setIsDragging(true);
    // Находим перетаскиваемую задачу
    const column = columns[start.source.droppableId];
    const task = column.tasks[start.source.index];

    setDraggedTask(task);
    setSourceColumnId(start.source.droppableId);
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    setIsDragging(false);
    setDraggedTask(null);
    setSourceColumnId(null);

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];
    const task = start.tasks[source.index];

    // Проверяем, разрешено ли перемещение в целевую колонку
    if (!task.allowedColumns.includes(finish.id)) {
      return;
    }

    if (start === finish) {
      const newTaskIds = Array.from(start.tasks);

      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, task);

      const newColumn: Column = {
        ...start,
        tasks: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });

      return;
    }

    const startTaskIds = Array.from(start.tasks);

    startTaskIds.splice(source.index, 1);
    const newStart: Column = {
      ...start,
      tasks: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.tasks);

    finishTaskIds.splice(destination.index, 0, task);
    const newFinish: Column = {
      ...finish,
      tasks: finishTaskIds,
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  // Функция проверки разрешенных колонок для подсветки
  const isDropAllowed = (columnId: string) => {
    if (!isDragging || !draggedTask) return false;

    return draggedTask.allowedColumns.includes(columnId);
  };

  return (
    <div className="p-5 font-sans">
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <div className={"flex gap-5"}>
          {Object.values(columns).map(column => (
            <div
              key={column.id}
              className="flex flex-col flex-1 bg-gray-100 rounded p-4 min-h-[500px]"
            >
              <h2 className="mt-0 text-gray-800 text-base uppercase font-semibold">
                {column.title}
              </h2>

              <Droppable
                droppableId={column.id}
                isDropDisabled={
                  isDragging &&
                  !isDropAllowed(column.id) &&
                  column.id !== sourceColumnId
                }
              >
                {(
                  provided: DroppableProvided,
                  snapshot: DroppableStateSnapshot,
                ) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={classNames(
                      "p-3 flex-1 bg-gray-100 rounded border-2 border-dashed",
                      {
                        "border-transparent":
                          !isDragging || !isDropAllowed(column.id),
                        "bg-blue-50 border-blue-600":
                          isDragging && isDropAllowed(column.id),
                        "bg-green-50 border-green-600":
                          snapshot.isDraggingOver && isDropAllowed(column.id),
                      },
                    )}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(
                          provided: DraggableProvided,
                          snapshot: DraggableStateSnapshot,
                        ) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={classNames(
                              "p-3 mb-3 bg-white rounded shadow-sm cursor-pointer min-h-[100px]",
                              {
                                "opacity-50": snapshot.isDragging,
                              },
                            )}
                          >
                            {task.content}
                            <div className="text-xs text-gray-500 mt-1">
                              Allowed columns: {task.allowedColumns.join(", ")}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
});
