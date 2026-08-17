import { IAuthStore } from "@entities/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmail, isPhone } from "@shared/lib/utils";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { signUpFormValidationSchema, TSignUpForm } from "./validation";

export const useSignUpVM = (onSuccess: () => void) => {
  const authStore = IAuthStore.useInstance();

  const form = useForm<TSignUpForm>({
    defaultValues: {},
    resolver: zodResolver(signUpFormValidationSchema),
  });

  const handleSignUp = useCallback(async () => {
    return form.handleSubmit(async data => {
      const email = isEmail(data.login) ? data.login : undefined;
      const phone = isPhone(data.login) ? data.login : undefined;

      if (email) {
        await authStore.signUp({
          email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      } else if (phone) {
        await authStore.signUp({
          phone,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      }

      if (authStore.isAuthenticated) {
        onSuccess();
      }
    })();
  }, [form, onSuccess, authStore]);

  return {
    form,
    handleSignUp,
  };
};
