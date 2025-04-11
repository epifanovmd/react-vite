import { isEmail, isPhone } from "@common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfileDataStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

import { signUpFormValidationSchema, TSignUpForm } from "../validations";

export const useSignUpVM = () => {
  const profileDataStore = useProfileDataStore();
  const navigate = useNavigate();

  const form = useForm<TSignUpForm>({
    defaultValues: {},
    resolver: zodResolver(signUpFormValidationSchema),
  });

  const handleSignUp = useCallback(async () => {
    return form.handleSubmit(async data => {
      const email = isEmail(data.login) ? data.login : undefined;
      const phone = isPhone(data.login) ? data.login : undefined;

      if (email) {
        await profileDataStore.signUp({
          email,
          password: data.password,
        });
      } else if (phone) {
        await profileDataStore.signUp({
          phone,
          password: data.password,
        });
      }

      if (profileDataStore.isError) {
        notification.error({ message: profileDataStore.holder.error?.msg });
      }

      if (profileDataStore.profile) {
        navigate({ to: "/" }).then();
      }
    })();
  }, [form, navigate, profileDataStore]);

  return {
    form,
    handleSignUp,
  };
};
