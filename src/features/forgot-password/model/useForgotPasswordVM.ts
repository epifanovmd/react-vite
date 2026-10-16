import { IMainApi } from "@shared/api";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { useState } from "react";

import {
  forgotPasswordFormValidationSchema,
  TForgotPasswordForm,
} from "./validation";

export const useForgotPasswordVM = () => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [sent, setSent] = useState(false);

  const form = useZodForm(forgotPasswordFormValidationSchema);

  const submit = async (data: TForgotPasswordForm) => {
    const res = await api.requestResetPassword({ login: data.login });

    if (res.error) {
      notifyApiError(toast, res.error);

      return;
    }
    setSent(true);
  };

  return { form, submit, sent };
};
