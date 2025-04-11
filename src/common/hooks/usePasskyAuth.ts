import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
  useApi,
} from "@api";
import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";
import { useSessionDataStore } from "@store";
import { useNavigate } from "@tanstack/react-router";
import { notification } from "antd";
import { useCallback, useEffect, useState } from "react";

export const usePasskeyAuth = () => {
  const [support, setSupport] = useState<boolean>(false);

  const api = useApi();

  // Сохраненный profileId в localStorage, означает что доступен вход по биометрии
  const profileId = localStorage.getItem("profileId");

  const { restore } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const support = browserSupportsWebAuthn();

    setSupport(support);
  }, []);

  const handleRegister = useCallback(
    async (profileId: string) => {
      localStorage.setItem("profileId", profileId);

      // Получите challenge и другие данные с сервера
      const response = await api.generateRegistrationOptions({ profileId });

      if (response.error) {
        notification.error({ message: response.error.message });
      } else if (response.data) {
        // Запустите процесс регистрации
        const data = await startRegistration({
          optionsJSON: response.data as PublicKeyCredentialCreationOptionsJSON,
        });
        // Отправьте результат обратно на сервер

        const verifyResponse = await api.verifyRegistration({
          profileId,
          data: data as RegistrationResponseJSON,
        });

        return !!verifyResponse.data?.verified;
      }

      return false;
    },
    [api],
  );

  const handleLogin = useCallback(async () => {
    if (!profileId) {
      return;
    }

    const response = await api.generateAuthenticationOptions({ profileId });

    if (response.data) {
      // Запустите процесс аутентификации
      const data = await startAuthentication({ optionsJSON: response.data });
      const verifyResponse = await api.verifyAuthentication({
        profileId,
        data: data as AuthenticationResponseJSON,
      });

      if (verifyResponse.error) {
        notification.error({ message: verifyResponse.error.message });
      } else if (verifyResponse.data) {
        await restore(verifyResponse.data.tokens);
        navigate({ to: "/" }).then();
      }
    }
  }, [api, navigate, profileId, restore]);

  return { profileId, handleRegister, handleLogin, support };
};
