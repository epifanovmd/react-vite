import { ADMIN_PERMISSIONS, IUserStore } from "@entities/user";
import { useRevokeApiKey } from "@features/revoke-api-key";
import { IMainApi } from "@shared/api";
import type { ApiKeyDto } from "@shared/api/gen/main/model";
import { usePaged } from "@shared/lib/holders";
import { useSocketEvent, useSocketRoom } from "@shared/lib/socket";

const PAGE_SIZE = 20;

export const useAdminApiKeysVM = () => {
  const api = IMainApi.useInstance();
  const userStore = IUserStore.useInstance();
  const canView = userStore.can(ADMIN_PERMISSIONS.APIKEY_VIEW);

  const keys = usePaged<ApiKeyDto>({
    pageSize: PAGE_SIZE,
    keyExtractor: k => k.id,
    queryFn: async ({ offset, limit }) => {
      const { data, error } = await api.listApiKeys({ offset, limit });

      return {
        data: data ? { data: data.items, totalCount: data.total } : null,
        error,
      };
    },
    autoLoad: true,
    enabled: canView,
  });

  // Новые ключи — первыми: созданный где-то ещё попадает на первую страницу.
  useSocketRoom("api-keys", canView ? "all" : null, () =>
    keys.reload({ refresh: true }),
  );
  useSocketEvent<[ApiKeyDto]>(
    "apikey:updated",
    key => {
      if (keys.items.some(item => item.id === key.id)) {
        keys.updateItem(key.id, key);
      } else {
        void keys.reload({ refresh: true });
      }
    },
    canView,
  );

  const revoke = useRevokeApiKey({
    onRevoked: () => keys.reload({ refresh: true }),
  });

  const onCreated = () => {
    keys.goToPage(1, { refresh: true }).then();
  };

  return {
    keys,
    revoke,
    onCreated,
    canCreate: userStore.can(ADMIN_PERMISSIONS.APIKEY_CREATE),
    canRevoke: userStore.can(ADMIN_PERMISSIONS.APIKEY_REVOKE),
  };
};

export type AdminApiKeysVM = ReturnType<typeof useAdminApiKeysVM>;
