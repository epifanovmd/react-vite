import { useApi } from "@api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  resetPasswordFormValidationSchema,
  TResetPasswordForm,
} from "../validations";

interface UseResetPasswordVMOptions {
  token: string;
  onSuccess: () => void;
}

export const useResetPasswordVM = ({
  token,
  onSuccess,
}: UseResetPasswordVMOptions) => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<TResetPasswordForm>({
    resolver: zodResolver(resetPasswordFormValidationSchema),
  });

  const submit = form.handleSubmit(async data => {
    setLoading(true);
    setError(null);

    const res = await api.resetPassword({ token, password: data.password });

    setLoading(false);

    if (res.error) {
      setError(res.error.message);
    } else {
      onSuccess();
    }
  });

  return { form, submit, loading, error };
};
