import {
  EPrivacyLevel,
  UpdatePrivacySettingsPayload,
} from "@api/api-gen/data-contracts";
import { Button, Card, Select, Spinner } from "@components/ui";
import { useNotification } from "@core/notifications";
import { usePrivacyStore } from "@store";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { DeleteAccountModal } from "../modals/DeleteAccountModal";

const LEVEL_OPTIONS = [
  { value: EPrivacyLevel.Everyone, label: "Все" },
  { value: EPrivacyLevel.Contacts, label: "Контакты" },
  { value: EPrivacyLevel.Nobody, label: "Никто" },
];

const PRIVACY_FIELDS: {
  key: keyof UpdatePrivacySettingsPayload;
  title: string;
  description: string;
}[] = [
  {
    key: "showLastOnline",
    title: "Время последнего визита",
    description: "Кто видит, когда вы были онлайн",
  },
  {
    key: "showPhone",
    title: "Номер телефона",
    description: "Кто видит ваш номер телефона",
  },
  {
    key: "showAvatar",
    title: "Аватар",
    description: "Кто видит вашу фотографию профиля",
  },
];

export const PrivacyTab: FC = observer(() => {
  const store = usePrivacyStore();
  const toast = useNotification();

  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    store.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = async (
    key: keyof UpdatePrivacySettingsPayload,
    value: EPrivacyLevel,
  ) => {
    const ok = await store.update({ [key]: value });

    if (ok) toast.success("Настройки приватности обновлены");
    else toast.error("Не удалось обновить настройки");
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <Card title="Видимость данных" className="p-5">
        {store.isLoading && !store.settings ? (
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {PRIVACY_FIELDS.map(field => (
              <div
                key={field.key}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {field.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {field.description}
                  </p>
                </div>
                <div className="w-40 flex-shrink-0">
                  <Select<EPrivacyLevel>
                    size="sm"
                    options={LEVEL_OPTIONS}
                    value={store.settings?.[field.key]}
                    onChange={v => handleChange(field.key, v)}
                    placeholder="—"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="border-destructive/30 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-destructive">
              Удаление аккаунта
            </p>
            <p className="text-xs text-muted-foreground">
              Безвозвратное удаление аккаунта и всех данных
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteOpen(true)}
          >
            Удалить аккаунт
          </Button>
        </div>
      </Card>

      <DeleteAccountModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
});
