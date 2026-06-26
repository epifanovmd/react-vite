import { useApi } from "@api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHotkeys } from "@mantine/hooks";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

import {
  forgotPasswordFormValidationSchema,
  TForgotPasswordForm,
} from "../../validations";

export const useForgotPasswordVM = () => {
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<TForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordFormValidationSchema),
  });

  const onBack = useCallback(() => {
    return navigate({ to: "/sign-in" });
  }, [navigate]);

  const submit = form.handleSubmit(async data => {
    setLoading(true);
    await api.requestResetPassword({ login: data.login });
    setLoading(false);
    setSent(true);
  });

  useHotkeys([["Enter", () => submit()]], []);

  return { form, submit, onBack, loading, sent };
};
