import { IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import { useMutation } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";

/** Загрузка аватара: файл уходит в хранилище, его id — в профиль. */
export const useChangeAvatar = () => {
  const api = IMainApi.useInstance();
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();

  const upload = useMutation<File, unknown>({
    mutationFn: async file => {
      const uploaded = await api.uploadFile({ file });
      const avatarId = uploaded.data?.[0]?.id;

      if (!avatarId) return { data: null, error: uploaded.error };

      return userStore.updateProfile({ avatarId });
    },
    onSuccess: () => toast.success("Аватар обновлён"),
    onError: error => notifyApiError(toast, error),
  });

  const remove = useMutation<void, unknown>({
    mutationFn: () => userStore.updateProfile({ avatarId: null }),
    onSuccess: () => toast.success("Аватар удалён"),
    onError: error => notifyApiError(toast, error),
  });

  return {
    avatarUrl: userStore.avatarUrl,
    name: userStore.model?.displayName ?? "",
    isBusy: upload.isLoading || remove.isLoading,
    upload: upload.mutate,
    remove: remove.mutate,
  };
};
