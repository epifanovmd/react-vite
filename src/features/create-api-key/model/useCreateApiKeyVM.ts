import { IMainApi } from "@shared/api";
import type { ApiKeyDto, ICreatedApiKeyDto } from "@shared/api/gen/main/model";
import { useMutation } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { useState } from "react";

import { createApiKeySchema, type TCreateApiKeyValues } from "./validation";

interface UseCreateApiKeyOptions {
  onCreated: (apiKey: ApiKeyDto) => void;
}

/**
 * Создание ключа; секрет сервер отдаёт один раз — он показывается до закрытия.
 * Потребитель — `observer`.
 */
export const useCreateApiKeyVM = ({ onCreated }: UseCreateApiKeyOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [open, setOpenState] = useState(false);
  const [secret, setSecret] = useState<string | null>(null);
  const form = useZodForm(createApiKeySchema, {
    defaultValues: { name: "", scopes: "" },
  });

  const create = useMutation<TCreateApiKeyValues, ICreatedApiKeyDto>({
    mutationFn: data =>
      api.createApiKey({
        name: data.name,
        scopes: data.scopes,
        expiresAt: data.expiresAt?.toISOString(),
      }),
    onSuccess: created => {
      if (!created) return;

      setSecret(created.key);
      onCreated(created.apiKey);
    },
    onError: error => notifyApiError(toast, error),
  });

  /** Окно не закрывается, пока создаётся ключ: иначе секрет потеряется. */
  const setOpen = (next: boolean) => {
    if (!next && create.isLoading) return;
    setOpenState(next);
  };

  const openDialog = () => {
    form.reset({ name: "", scopes: "", expiresAt: undefined });
    setSecret(null);
    setOpenState(true);
  };

  const submit = async (data: TCreateApiKeyValues) => {
    await create.mutate(data);
  };

  return {
    open,
    setOpen,
    openDialog,
    form,
    submit,
    secret,
    isSubmitting: create.isLoading,
  };
};
