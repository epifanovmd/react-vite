import type { NodeDto } from "@shared/api/gen/main/model";

/**
 * Шапка узла одной строкой: адрес, версия агента; агент ни разу не выходил
 * на связь — так и пишем (сколько прошло с последней связи — в статусе).
 */
export const nodeSubtitle = (node: NodeDto): string =>
  [
    node.host ?? "адрес не задан",
    node.agent?.version && `агент ${node.agent.version}`,
    node.agent &&
      !node.agent.online &&
      !node.agent.lastSeenAt &&
      "агент не выходил на связь",
  ]
    .filter(Boolean)
    .join(" · ");
