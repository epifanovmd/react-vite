import { useAuthStore, useUsersDataStore } from "@store";
import { useEffect } from "react";

export const useDashboardVM = () => {
  const authStore = useAuthStore();
  const usersStore = useUsersDataStore();

  useEffect(() => {
    usersStore.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profile = authStore.profile;

  return {
    profile,
    displayName: profile?.displayName ?? "пользователь",
    role: profile?.roleLabel,
    registeredAt: profile?.registeredAtDate.formattedDate,
    emailVerified: profile?.emailVerified,
    totalUsers: usersStore.total,
    usersLoading: usersStore.isLoading,
  };
};
