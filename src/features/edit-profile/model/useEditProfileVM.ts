import { IUserStore } from "@entities/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { INotificationService } from "@shared/lib/notifications";
import { parseISO } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { profileFormValidationSchema, TProfileForm } from "./validation";

interface UseEditProfileVMOptions {
  open: boolean;
  onSuccess: () => void;
}

export const useEditProfileVM = ({
  open,
  onSuccess,
}: UseEditProfileVMOptions) => {
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();

  const form = useForm<TProfileForm>({
    resolver: zodResolver(profileFormValidationSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!open) return;

    const profile = userStore.user?.profile;

    form.reset({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      gender: profile?.gender ?? "",
      birthDate: profile?.birthDate ? parseISO(profile.birthDate) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = form.handleSubmit(async data => {
    const res = await userStore.updateProfile({
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      gender: data.gender || undefined,
      birthDate: data.birthDate?.toISOString(),
    });

    if (res.error) {
      toast.error(res.error.message);

      return;
    }

    toast.success("Профиль обновлён");
    onSuccess();
  });

  return { form, submit };
};
