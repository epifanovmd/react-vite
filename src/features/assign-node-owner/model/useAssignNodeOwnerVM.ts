import { ADMIN_PERMISSIONS, IUserStore } from "@entities/user";
import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { useCollection } from "@shared/lib/holders";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import type { SelectOption } from "@shared/ui";
import { useState } from "react";

interface UseAssignNodeOwnerOptions {
  onSaved: (node: NodeDto) => void;
}

/** Опция пользователя без повторов по id. */
const uniqueOptions = (options: SelectOption[]): SelectOption[] => [
  ...new Map(options.map(option => [option.value, option])).values(),
];

/**
 * Назначение и снятие владельца узла. Список пользователей — с правом на их
 * просмотр; без него на выбор — текущий владелец и сам пользователь.
 */
export const useAssignNodeOwnerVM = ({
  onSaved,
}: UseAssignNodeOwnerOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const userStore = IUserStore.useInstance();
  const [node, setNode] = useState<NodeDto | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);
  const canListUsers = userStore.can(ADMIN_PERMISSIONS.USER_VIEW);
  const open = node !== null;

  const users = useCollection<SelectOption, boolean>({
    queryFn: async () => {
      const { data, error } = await api.getUserOptions();

      return {
        data:
          data?.data.map(option => ({
            value: option.id,
            label: option.name ?? option.id,
          })) ?? null,
        error,
      };
    },
    enabled: open && canListUsers,
    watch: [open],
  });

  const me = userStore.user;
  const fallback: SelectOption[] = [
    // Владелец — сам пользователь: одна запись с пометкой «(вы)».
    ...(node?.ownerId && node.ownerId !== me?.id
      ? [{ value: node.ownerId, label: node.ownerName ?? node.ownerId }]
      : []),
    ...(me
      ? [{ value: me.id, label: me.email ? `${me.email} (вы)` : "Вы" }]
      : []),
  ];

  const openFor = (target: NodeDto) => {
    setUserId(target.ownerId);
    setNode(target);
  };

  const close = () => setNode(null);

  const save = async () => {
    if (!node) return;
    if (userId === node.ownerId) {
      close();

      return;
    }

    setSaving(true);

    const res = userId
      ? await api.assignNodeOwner(node.id, { userId })
      : await api.unassignNodeOwner(node.id);

    setSaving(false);

    if (res.error) {
      notifyApiError(toast, res.error);

      return;
    }

    onSaved(res.data);
    toast.success(userId ? "Владелец назначен" : "Владелец снят");
    close();
  };

  return {
    node,
    userId,
    setUserId,
    userOptions: uniqueOptions(
      canListUsers ? [...fallback, ...users.items] : fallback,
    ),
    isLoadingUsers: users.isLoading,
    canListUsers,
    isSaving,
    openFor,
    close,
    save,
  };
};

export type AssignNodeOwnerVM = ReturnType<typeof useAssignNodeOwnerVM>;
