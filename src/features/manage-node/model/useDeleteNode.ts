import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useConfirm } from "@shared/ui";

interface UseDeleteNodeOptions {
  onDeleted: (node: NodeDto) => void;
}

/** Удаление узла с подтверждением. Возвращает, удалён ли. */
export const useDeleteNode = ({ onDeleted }: UseDeleteNodeOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();

  return async (node: NodeDto): Promise<boolean> => {
    const ok = await confirm({
      title: `Удалить узел «${node.name}»?`,
      description: node.agentId
        ? "Агент узла будет удалён: на машине он остановит воркеры, уберёт за ними и больше не выйдет на связь. Программа останется — чтобы убрать и её, сначала удалите агента с машины (по SSH или agent uninstall --purge)."
        : "Узел пропадёт из списка.",
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
    });

    if (!ok) return false;

    const res = await api.deleteNode(node.id);

    if (res.error) {
      notifyApiError(toast, res.error);

      return false;
    }

    onDeleted(node);
    toast.success(`Узел «${node.name}» удалён`);

    return true;
  };
};
