import { useApi } from "@api";
import { useNotification } from "@core/notifications";
import { useAuthStore } from "@store";
import { useCallback, useEffect, useState } from "react";

export const useProfileVM = () => {
  const api = useApi();
  const toast = useNotification();
  const authStore = useAuthStore();

  const [isEditOpen, setEditOpen] = useState(false);
  const [isVerifyingEmail, setVerifyingEmail] = useState(false);

  useEffect(() => {
    authStore.load().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = useCallback(() => setEditOpen(true), []);
  const closeEdit = useCallback(() => setEditOpen(false), []);

  const handleVerifyEmail = useCallback(async () => {
    setVerifyingEmail(true);
    const res = await api.requestVerifyEmail();

    setVerifyingEmail(false);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Письмо с подтверждением отправлено");
    }
  }, [api, toast]);

  return {
    model: authStore.profile,
    profile: authStore.user?.profile,
    isEditOpen,
    openEdit,
    closeEdit,
    isVerifyingEmail,
    handleVerifyEmail,
  };
};
