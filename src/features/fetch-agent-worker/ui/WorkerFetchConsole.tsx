import type { AgentDto } from "@shared/api/gen/main/model";
import { Card } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { useWorkerFetchVM } from "../model/useWorkerFetchVM";
import { WorkerFetchForm } from "./WorkerFetchForm";
import { WorkerFetchResponse } from "./WorkerFetchResponse";

interface WorkerFetchConsoleProps {
  agent: AgentDto;
}

/** Консоль запроса к воркеру через агента: запрос слева, ответ справа. */
export const WorkerFetchConsole: FC<WorkerFetchConsoleProps> = observer(
  ({ agent }) => {
    const vm = useWorkerFetchVM(agent);

    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Запрос" description="Через агента к HTTP-маршруту воркера">
          <WorkerFetchForm vm={vm} />
        </Card>
        <Card title="Ответ">
          <WorkerFetchResponse session={vm.session} onDownload={vm.download} />
        </Card>
      </div>
    );
  },
);
