import { IUserStore } from "@entities/user";
import { useCallback, useEffect, useState } from "react";

export const useProfileVM = () => {
  const userStore = IUserStore.useInstance();

  const [isEditOpen, setEditOpen] = useState(false);

  // Стор — singleton: эффект срабатывает один раз при открытии.
  useEffect(() => {
    void userStore.load();
  }, [userStore]);

  const openEdit = useCallback(() => setEditOpen(true), []);
  const closeEdit = useCallback(() => setEditOpen(false), []);

  return {
    model: userStore.profile,
    profile: userStore.user?.profile,
    isEditOpen,
    openEdit,
    closeEdit,
  };
};
