import { useApi } from "@api";
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@api/api-gen/data-contracts.ts";
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
  // Сохраненный profileId в localStorage, означает что доступен вход по биометрии
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const api = useApi();
  const { restore } = useSessionDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    const support = browserSupportsWebAuthn();

    setSupport(support);
  }, []);

  const handleRegister = useCallback(
    async (userId: string) => {
      // Получите challenge и другие данные с сервера
      const response = await api.generateRegistrationOptions({ userId });

      if (response.error) {
        notification.error({ message: response.error.message });
      } else if (response.data) {
        // Запустите процесс регистрации
        return await startRegistration({
          optionsJSON: response.data as PublicKeyCredentialCreationOptionsJSON,
        })
          .then(async data => {
            const isVerified = await api
              .verifyRegistration({
                userId,
                data: data as RegistrationResponseJSON,
              })
              .then(res => !!res.data?.verified)
              .catch(
                err =>
                  err.message === "The authenticator was previously registered",
              );

            if (isVerified) {
              localStorage.setItem("userId", userId);
              setUserId(userId);
            }

            return isVerified;
          })
          .catch(err => {
            if (err.message === "The authenticator was previously registered") {
              localStorage.setItem("userId", userId);
              setUserId(userId);
            }

            return false;
          });
      }

      return false;
    },
    [api],
  );

  const handleLogin = useCallback(async () => {
    if (!userId) {
      return;
    }

    const response = await api.generateAuthenticationOptions({ userId });

    if (response.data) {
      // Запустите процесс аутентификации
      const data = await startAuthentication({ optionsJSON: response.data });
      const verifyResponse = await api.verifyAuthentication({
        userId,
        data: data as AuthenticationResponseJSON,
      });

      if (verifyResponse.error) {
        notification.error({ message: verifyResponse.error.message });
      } else if (verifyResponse.data) {
        await restore(verifyResponse.data.tokens);
        navigate({ to: "/" }).then();
      }
    }
  }, [api, navigate, userId, restore]);

  return { userId, handleRegister, handleLogin, support };
};
