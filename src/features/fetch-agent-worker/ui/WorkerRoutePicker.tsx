import type { IAgentManifestRouteDto } from "@shared/api/gen/main/model";
import { Badge } from "@shared/ui";
import { FC } from "react";

interface WorkerRoutePickerProps {
  routes: IAgentManifestRouteDto[];
  onPick: (route: IAgentManifestRouteDto) => void;
}

/** Маршруты из манифеста воркера: выбор подставляет метод и путь. */
export const WorkerRoutePicker: FC<WorkerRoutePickerProps> = ({
  routes,
  onPick,
}) => {
  if (routes.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Маршрутов воркер не объявил — путь можно ввести вручную.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {routes.map(route => (
        <li key={`${route.method} ${route.path}`}>
          <button
            type="button"
            className="flex w-full flex-wrap items-center gap-x-2 gap-y-0.5 px-3 py-2 text-left text-sm hover:bg-muted"
            onClick={() => onPick(route)}
          >
            <Badge variant="secondary" className="font-mono">
              {route.method.toUpperCase()}
            </Badge>
            <span className="font-mono">{route.path}</span>
            {route.description && (
              <span className="w-full text-xs text-muted-foreground">
                {route.description}
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};
