import { IUserStore } from "@entities/user";
import { INotificationService } from "@shared/lib/notifications";
import { useCallback, useEffect, useState } from "react";

export const useProfileVM = () => {
  const toast = INotificationService.useInstance();
  const userStore = IUserStore.useInstance();

  const [isEditOpen, setEditOpen] = useState(false);
  const [isVerifyingEmail, setVerifyingEmail] = useState(false);

  useEffect(() => {
    userStore.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = useCallback(() => setEditOpen(true), []);
  const closeEdit = useCallback(() => setEditOpen(false), []);

  const handleVerifyEmail = useCallback(async () => {
    setVerifyingEmail(true);
    const res = await userStore.requestVerifyEmail();

    setVerifyingEmail(false);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Письмо с подтверждением отправлено");
    }
  }, [userStore, toast]);

  return {
    model: userStore.profile,
    profile: userStore.user?.profile,
    isEditOpen,
    openEdit,
    closeEdit,
    isVerifyingEmail,
    handleVerifyEmail,
  };
};
