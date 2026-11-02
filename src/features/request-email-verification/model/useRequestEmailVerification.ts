import { IUserStore } from "@entities/user";
import { useMutation } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";

/** Повторная отправка письма подтверждения email. Потребитель — `observer`. */
export const useRequestEmailVerification = () => {
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();

  const request = useMutation<void, unknown>({
    mutationFn: () => userStore.requestVerifyEmail(),
    onSuccess: () => toast.success("Письмо с подтверждением отправлено"),
    onError: error => notifyApiError(toast, error),
  });

  return {
    isLoading: request.isLoading,
    requestVerification: async () => {
      await request.mutate();
    },
  };
};
