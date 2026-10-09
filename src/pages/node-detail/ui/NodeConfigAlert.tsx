import { workerOf } from "@entities/agent";
import type { AgentDto, NodeDto } from "@shared/api/gen/main/model";
import { Alert } from "@shared/ui";
import { FC } from "react";

interface NodeConfigAlertProps {
  node: NodeDto;
  /** Агент узла: из итогов применения — текст ошибки по ключу. */
  agent: AgentDto | null;
}

/** Ошибка из итога применения ключа `воркер/ключ`. */
const errorOf = (agent: AgentDto | null, failed: string): string | null => {
  const [worker, key] = failed.split("/");

  if (!agent || !worker || !key) return null;

  return workerOf(agent, worker)?.configs?.[key]?.error?.message ?? null;
};

/** Воркер отказал в настройке: ключи и что он ответил. */
export const NodeConfigAlert: FC<NodeConfigAlertProps> = ({ node, agent }) => {
  if (node.config.status !== "error") return null;

  return (
    <Alert variant="destructive" title="Настройки воркеров не применились">
      <ul className="flex flex-col gap-1 text-sm">
        {node.config.failed.map(failed => (
          <li key={failed}>
            <span className="font-mono">{failed}</span>:{" "}
            {errorOf(agent, failed) ?? "воркер отказал"}
          </li>
        ))}
      </ul>
    </Alert>
  );
};
