import { useConfirm } from "@components/ui";
import { useNotification } from "@core/notifications";
import { useUsersDataStore } from "@store";
import { useCallback, useEffect, useState } from "react";

interface UseUserDetailVMParams {
  userId: string;
  onBack: () => void;
}

export const useUserDetailVM = ({ userId, onBack }: UseUserDetailVMParams) => {
  const store = useUsersDataStore();
  const confirm = useConfirm();
  const toast = useNotification();

  const [editOpen, setEditOpen] = useState(false);
  const [privilegesOpen, setPrivilegesOpen] = useState(false);

  useEffect(() => {
    store.loadUser(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleDeleteUser = useCallback(async () => {
    const ok = await confirm({
      title: "Удалить пользователя",
      message: "Удалить этого пользователя навсегда? Действие необратимо.",
      variant: "danger",
    });

    if (!ok) return;
    const res = await store.deleteUser(userId);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Пользователь удалён");
      onBack();
    }
  }, [store, userId, confirm, toast, onBack]);

  return {
    isLoading: store.userHolder.isLoading || !store.userHolder.isReady,
    user: store.user,
    model: store.userModel,
    isSavingPrivileges: store.setPrivilegesMutation.isLoading,
    isDeletingUser: store.deleteUserMutation.isLoading,
    editOpen,
    setEditOpen,
    privilegesOpen,
    setPrivilegesOpen,
    handleDeleteUser,
  };
};
