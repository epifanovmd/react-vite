import { PageHeader, PageLayout } from "@components/layouts";
import { PageLoader } from "@components/shared";
import { Button, InfoFieldProps } from "@components/ui";
import { MailCheck } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { EditProfileModal, ProfileCard } from "./components";
import { useProfileVM } from "./hooks";

const header = (
  <PageHeader title="Мой профиль" subtitle="Личные данные профиля" />
);

export const Profile: FC = observer(() => {
  const {
    model,
    profile,
    isEditOpen,
    openEdit,
    closeEdit,
    isVerifyingEmail,
    handleVerifyEmail,
  } = useProfileVM();

  if (!model) {
    return (
      <PageLayout header={header}>
        <PageLoader label="Загрузка профиля…" />
      </PageLayout>
    );
  }

  const fields: InfoFieldProps[] = [
    { label: "Имя", value: profile?.firstName },
    { label: "Фамилия", value: profile?.lastName },
    { label: "Пол", value: profile?.gender },
    { label: "Дата рождения", value: model.birthDateModel.formattedDate },
    {
      label: "Email",
      value: model.email,
      action:
        model.email && !model.emailVerified ? (
          <Button
            size="sm"
            variant="outline"
            loading={isVerifyingEmail}
            leftIcon={<MailCheck size={14} />}
            onClick={handleVerifyEmail}
          >
            Подтвердить
          </Button>
        ) : undefined,
    },
    { label: "Телефон", value: model.phone },
  ];

  return (
    <PageLayout header={header}>
      <div className="mx-auto w-full max-w-3xl">
        <ProfileCard
          name={model.displayName}
          login={model.login}
          roleLabel={model.roleLabel}
          emailVerified={model.emailVerified}
          fields={fields}
          registeredAt={model.registeredAt}
          lastOnline={model.lastOnlineDate.formattedDate}
          onEdit={openEdit}
        />
      </div>

      <EditProfileModal open={isEditOpen} onClose={closeEdit} />
    </PageLayout>
  );
});
