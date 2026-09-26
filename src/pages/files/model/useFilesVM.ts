import { IMainApi } from "@shared/api";
import type { IFileDto } from "@shared/api/gen/main/model";
import { usePaged } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { ISocketTransport } from "@shared/lib/socket";
import { useConfirm } from "@shared/ui";
import { useEffect } from "react";

const PAGE_SIZE = 20;

export const useFilesVM = () => {
  const api = IMainApi.useInstance();
  const socket = ISocketTransport.useInstance();
  const toast = INotificationService.useInstance();
  const confirm = useConfirm();

  const files = usePaged<IFileDto>({
    pageSize: PAGE_SIZE,
    keyExtractor: f => f.id,
    queryFn: async ({ offset, limit }) => {
      const { data, error } = await api.getMyFiles({ offset, limit });

      return {
        data: data ? { data: data.items, totalCount: data.total } : null,
        error,
      };
    },
  });

  useEffect(() => {
    files.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Сервер закончил обработку (статус, миниатюра) — обновить файл на месте.
  useEffect(
    () =>
      socket.on<[IFileDto]>("file:processed", file =>
        files.updateItem(file.id, file),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket],
  );

  const remove = async (file: IFileDto) => {
    const ok = await confirm({
      title: "Удалить файл?",
      description: file.name,
      confirmLabel: "Удалить",
      confirmVariant: "destructive",
    });

    if (!ok) return;

    const res = await api.deleteFile(file.id);

    if (res.error) {
      notifyApiError(toast, res.error);

      return;
    }

    await files.reload({ refresh: true });
  };

  const onUploaded = () => {
    files.goToPage(1, { refresh: true }).then();
  };

  return { files, remove, onUploaded };
};
