import { useApi } from "@api";
import { useNotification } from "@lib/notifications";
import { useCallback, useEffect, useState } from "react";

import { useUserStore } from "../../store";

export const useProfileVM = () => {
  const api = useApi();
  const toast = useNotification();
  const userStore = useUserStore();

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
    const res = await api.requestVerifyEmail();

    setVerifyingEmail(false);

    if (res.error) {
      toast.error(res.error.message);
    } else {
      toast.success("Письмо с подтверждением отправлено");
    }
  }, [api, toast]);

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
