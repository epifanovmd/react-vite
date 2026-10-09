import type { NodeDto } from "@shared/api/gen/main/model";
import { Button, Card, Empty } from "@shared/ui";
import { HardDriveDownload } from "lucide-react";
import { FC } from "react";

interface NodeAgentEmptyProps {
  node: NodeDto;
  /** Можно установить агента; нет — без кнопки. */
  onInstall?: () => void;
}

/** У узла нет агента: подсказка и кнопка установки. */
export const NodeAgentEmpty: FC<NodeAgentEmptyProps> = ({
  node,
  onInstall,
}) => (
  <Card>
    <Empty
      size="sm"
      icon={<HardDriveDownload size={28} />}
      title="Агент не установлен"
      description={
        node.host
          ? "Установите агента командой на узле или по SSH — он сам выйдет на связь"
          : "Установите агента командой на узле — он сам выйдет на связь. Для установки по SSH задайте адрес узла"
      }
      action={
        onInstall && (
          <Button
            leftIcon={<HardDriveDownload size={15} />}
            onClick={onInstall}
          >
            Установить агента
          </Button>
        )
      }
    />
  </Card>
);
