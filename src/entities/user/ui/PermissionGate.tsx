import type { KnownPermission } from "@shared/api/gen/main/model";
import { Empty, PageLoader } from "@shared/ui";
import { Lock } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, PropsWithChildren } from "react";

import { IUserStore } from "../model/types";

interface PermissionGateProps {
  permission: KnownPermission;
}

/** Показывает содержимое, только если у пользователя есть право. */
export const PermissionGate: FC<PropsWithChildren<PermissionGateProps>> =
  observer(({ permission, children }) => {
    const userStore = IUserStore.useInstance();

    if (!userStore.user) return <PageLoader label="Проверка доступа…" />;

    if (!userStore.can(permission)) {
      return (
        <Empty
          icon={<Lock />}
          title="Нет доступа"
          description="Для этого раздела нужны дополнительные права."
        />
      );
    }

    return <>{children}</>;
  });
