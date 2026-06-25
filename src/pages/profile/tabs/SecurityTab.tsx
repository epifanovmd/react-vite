import { AsyncButton, Badge, Button, Card } from "@components/ui";
import { usePasskeyAuth } from "@core/auth";
import { useNotification } from "@core/notifications";
import { useAuthStore, useSecurityStore } from "@store";
import {
  Fingerprint,
  KeyRound,
  Mail,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC, ReactNode, useState } from "react";

import { ChangePasswordModal } from "../modals/ChangePasswordModal";
import { ChangeUsernameModal } from "../modals/ChangeUsernameModal";
import { TwoFactorModal } from "../modals/TwoFactorModal";

const SettingRow: FC<{
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}> = ({ icon, title, description, children }) => (
  <Card className="p-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  </Card>
);

export const SecurityTab: FC = observer(() => {
  const authStore = useAuthStore();
  const security = useSecurityStore();
  const passkey = usePasskeyAuth();
  const toast = useNotification();

  const user = authStore.user;

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [usernameOpen, setUsernameOpen] = useState(false);
  const [twoFaMode, setTwoFaMode] = useState<"enable" | "disable" | null>(null);

  const handleVerifyEmail = async () => {
    const res = await security.requestVerifyEmail();

    if (res.error) toast.error(res.error.message);
    else toast.success("Письмо с подтверждением отправлено");
  };

  const handleRegisterPasskey = async () => {
    const login = user?.email ?? user?.phone ?? user?.username;

    if (!login) {
      toast.error("Недостаточно данных для регистрации passkey");

      return;
    }

    const res = await passkey.handleRegister(login);

    if (res.ok) toast.success("Passkey зарегистрирован");
    else if (res.error) toast.error(res.error);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <SettingRow
        icon={<KeyRound size={16} />}
        title="Пароль"
        description="Используется для входа в аккаунт"
      >
        <Button
          size="sm"
          variant="outline"
          onClick={() => setPasswordOpen(true)}
        >
          Изменить пароль
        </Button>
      </SettingRow>

      <SettingRow
        icon={<UserCog size={16} />}
        title="Username"
        description={user?.username ? `@${user.username}` : "Не задан"}
      >
        <Button
          size="sm"
          variant="outline"
          onClick={() => setUsernameOpen(true)}
        >
          Изменить
        </Button>
      </SettingRow>

      <SettingRow
        icon={<Mail size={16} />}
        title="Email"
        description={user?.email ?? "Email не указан"}
      >
        {user?.emailVerified ? (
          <Badge variant="success" dot>
            Подтверждён
          </Badge>
        ) : (
          user?.email && (
            <AsyncButton
              size="sm"
              variant="outline"
              onClick={handleVerifyEmail}
            >
              Подтвердить
            </AsyncButton>
          )
        )}
      </SettingRow>

      <SettingRow
        icon={<ShieldCheck size={16} />}
        title="Двухфакторная аутентификация"
        description="Дополнительный код при входе"
      >
        <Button size="sm" onClick={() => setTwoFaMode("enable")}>
          Включить
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTwoFaMode("disable")}
        >
          Отключить
        </Button>
      </SettingRow>

      <SettingRow
        icon={<Fingerprint size={16} />}
        title="Passkey / Биометрия"
        description={
          passkey.support
            ? "Вход по отпечатку или Face ID"
            : "Не поддерживается этим устройством"
        }
      >
        {passkey.support && (
          <>
            <AsyncButton
              size="sm"
              variant="outline"
              loading={passkey.loading}
              onClick={handleRegisterPasskey}
            >
              Зарегистрировать
            </AsyncButton>
            {passkey.profileId && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  passkey.removePasskey();
                  toast.success("Passkey удалён");
                }}
              >
                Удалить
              </Button>
            )}
          </>
        )}
      </SettingRow>

      <ChangePasswordModal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
      <ChangeUsernameModal
        open={usernameOpen}
        currentUsername={user?.username}
        onClose={() => setUsernameOpen(false)}
      />
      <TwoFactorModal
        open={twoFaMode !== null}
        mode={twoFaMode ?? "enable"}
        onClose={() => setTwoFaMode(null)}
      />
    </div>
  );
});
