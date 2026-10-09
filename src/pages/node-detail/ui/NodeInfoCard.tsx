import { NodeConfigBadge } from "@entities/node";
import type { NodeDto } from "@shared/api/gen/main/model";
import { formatter } from "@shared/lib/utils";
import { Card, InfoField } from "@shared/ui";
import { FC } from "react";

interface NodeInfoCardProps {
  node: NodeDto;
}

/**
 * Узел: владелец, создатель, конфигурация и описание. Адрес, статус и
 * версия агента — в шапке, сведения об агенте — на вкладке «Обзор».
 */
export const NodeInfoCard: FC<NodeInfoCardProps> = ({ node }) => (
  <Card>
    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
      <InfoField
        label="Владелец"
        value={node.ownerName}
        emptyText="не назначен"
      />
      <InfoField
        label="Создал"
        value={
          node.createdByName &&
          `${node.createdByName} · ${formatter.date.format(node.createdAt)}`
        }
      />
      <InfoField
        label="Конфигурация"
        value={<NodeConfigBadge config={node.config} />}
      />
      {node.description && (
        <InfoField
          label="Описание"
          truncate={false}
          value={node.description}
          className="sm:col-span-3"
        />
      )}
    </div>
  </Card>
);
