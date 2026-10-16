import { useDeleteFile } from "@features/delete-file";
import { IMainApi } from "@shared/api";
import type { IFileDto } from "@shared/api/gen/main/model";
import { usePaged } from "@shared/lib/holders";
import { useLatestRef } from "@shared/lib/hooks";
import { ISocketTransport, useSocketEvent } from "@shared/lib/socket";
import { useEffect } from "react";

const PAGE_SIZE = 20;

export const useFilesVM = () => {
  const api = IMainApi.useInstance();
  const socket = ISocketTransport.useInstance();

  const files = usePaged<IFileDto>({
    pageSize: PAGE_SIZE,
    keyExtractor: f => f.id,
    autoLoad: true,
    queryFn: async ({ offset, limit }) => {
      const { data, error } = await api.getMyFiles({ offset, limit });

      return {
        data: data ? { data: data.items, totalCount: data.total } : null,
        error,
      };
    },
  });

  const reload = () => files.reload({ refresh: true }).then();

  // Изменения с других устройств и итог обработки приходят по сокету.
  // Сервер закончил обработку (статус, миниатюра) — обновить файл на месте.
  useSocketEvent<[IFileDto]>("file:processed", file =>
    files.updateItem(file.id, file),
  );
  // Загрузка и удаление сдвигают страницы — перечитать текущую.
  useSocketEvent("file:uploaded", reload);
  useSocketEvent("file:deleted", reload);

  // События за время обрыва потеряны: после переподключения — перечитать.
  // Первое подключение (сокет ещё не был на связи при открытии) — не повод.
  const reloadRef = useLatestRef(reload);

  useEffect(() => {
    let wasConnected = socket.state.status === "connected";

    return socket.onConnect(() => {
      if (wasConnected) reloadRef.current();
      wasConnected = true;
    });
  }, [socket, reloadRef]);

  const remove = useDeleteFile({
    onDeleted: () => files.reload({ refresh: true }),
  });

  const onUploaded = () => {
    files.goToPage(1, { refresh: true }).then();
  };

  return { files, remove, onUploaded };
};

export type FilesVM = ReturnType<typeof useFilesVM>;
