import { IUserStore } from "@entities/user";
import {
  EPrivacyLevel,
  type PrivacySettingsDto,
} from "@shared/api/gen/main/model";
import { INotificationService } from "@shared/lib/notifications";
import { useEffect, useState } from "react";

export const PRIVACY_LEVEL_OPTIONS = [
  { value: EPrivacyLevel.everyone, label: "Все" },
  { value: EPrivacyLevel.contacts, label: "Контакты" },
  { value: EPrivacyLevel.nobody, label: "Никто" },
];

export const PRIVACY_FIELDS: {
  key: keyof PrivacySettingsDto;
  label: string;
}[] = [
  { key: "showAvatar", label: "Аватар" },
  { key: "showPhone", label: "Телефон" },
  { key: "showLastOnline", label: "Время последнего визита" },
];

/** Настройки приватности: каждое изменение сохраняется сразу. */
export const useEditPrivacy = () => {
  const userStore = IUserStore.useInstance();
  const toast = INotificationService.useInstance();
  const [saving, setSaving] = useState<keyof PrivacySettingsDto | null>(null);

  useEffect(() => {
    userStore.loadPrivacy().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const change = async (
    key: keyof PrivacySettingsDto,
    value: EPrivacyLevel,
  ) => {
    setSaving(key);

    const saved = await userStore.updatePrivacy({ [key]: value });

    setSaving(null);
    if (saved) toast.success("Настройки приватности сохранены");
  };

  return { privacy: userStore.privacy, saving, change };
};
