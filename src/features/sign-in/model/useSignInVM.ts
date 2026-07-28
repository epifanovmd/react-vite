import { IAuthStore } from "@entities/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { signInFormValidationSchema, TSignInForm } from "./validation";

export const useSignInVM = () => {
  const authStore = IAuthStore.useInstance();
  const navigate = useNavigate();

  const form = useForm<TSignInForm>({
    defaultValues: {
      login: "epifanovmd@gmail.com",
      password: "Epifan123",
    },
    resolver: zodResolver(signInFormValidationSchema),
  });

  const handleNavigateSignUp = useCallback(() => {
    navigate({ to: "/sign-up" });
  }, [navigate]);

  const handleNavigateRecoveryPassword = useCallback(() => {
    navigate({ to: "/forgot-password" });
  }, [navigate]);

  const handleLogin = useCallback(async () => {
    return form.handleSubmit(async data => {
      await authStore.signIn(data);

      if (authStore.isAuthenticated) {
        navigate({ to: "/" });
      }
    })();
  }, [form, navigate, authStore]);

  return {
    form,
    handleLogin,
    handleNavigateRecoveryPassword,
    handleNavigateSignUp,
  };
};
