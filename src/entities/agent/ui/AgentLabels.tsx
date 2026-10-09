import { CodeChip } from "@shared/ui";
import { FC } from "react";

import { agentLabels } from "../lib/agent";

interface AgentLabelsProps {
  labels: Record<string, string>;
  /** Что показать без меток. */
  emptyText?: string;
}

/** Метки агента «ключ=значение». */
export const AgentLabels: FC<AgentLabelsProps> = ({ labels, emptyText }) => {
  const items = agentLabels(labels);

  if (items.length === 0) {
    return emptyText ? (
      <span className="text-muted-foreground">{emptyText}</span>
    ) : null;
  }

  return (
    <span className="flex flex-wrap gap-1">
      {items.map(label => (
        <CodeChip key={label}>{label}</CodeChip>
      ))}
    </span>
  );
};
