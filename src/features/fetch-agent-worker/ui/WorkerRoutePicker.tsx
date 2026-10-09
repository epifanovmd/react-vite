import { cn } from "@shared/lib/utils/cn";
import { Badge } from "@shared/ui";
import { FC } from "react";

import type { IWorkerRoute } from "../lib/worker-routes";

interface WorkerRoutePickerProps {
  routes: IWorkerRoute[];
  /** Ключ выбранного маршрута. */
  value: string;
  onPick: (route: IWorkerRoute) => void;
}

/** Маршруты из манифеста воркера: выбор задаёт метод, путь и тело. */
export const WorkerRoutePicker: FC<WorkerRoutePickerProps> = ({
  routes,
  value,
  onPick,
}) => (
  <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
    {routes.map(route => {
      const selected = route.key === value;

      return (
        <li key={route.key}>
          <button
            type="button"
            aria-pressed={selected}
            className={cn(
              "flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-3 py-2 text-left text-sm hover:bg-muted",
              selected && "bg-muted",
            )}
            onClick={() => onPick(route)}
          >
            <Badge
              variant={selected ? "primary" : "secondary"}
              className="font-mono"
            >
              {route.method}
            </Badge>
            <span className="font-mono">{route.path}</span>
            {route.request && <Badge variant="outline">тело по схеме</Badge>}
            {route.description && (
              <span className="w-full text-xs text-muted-foreground">
                {route.description}
              </span>
            )}
          </button>
        </li>
      );
    })}
  </ul>
);
