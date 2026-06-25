import { PageHeader, PageLayout } from "@components/layouts";
import { UserInfoCard } from "@components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui";
import { useAuthStore } from "@store";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import { DevicesTab } from "./tabs/DevicesTab";
import { PrivacyTab } from "./tabs/PrivacyTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { SecurityTab } from "./tabs/SecurityTab";
import { SessionsTab } from "./tabs/SessionsTab";

export const Profile: FC = observer(() => {
  const authStore = useAuthStore();
  const model = authStore.profile;

  return (
    <PageLayout
      header={
        <PageHeader
          title="Мой профиль"
          subtitle="Управление аккаунтом и безопасностью"
        />
      }
    >
      <div className="flex flex-col gap-3 sm:gap-6 xl:flex-row">
        <div className="w-full flex-shrink-0 xl:w-64">
          <UserInfoCard
            displayName={model?.displayName ?? "Профиль"}
            login={model?.login}
            role={model?.roleLabel}
            emailVerified={model?.emailVerified}
            registeredAt={model?.registeredAt}
            lastOnline={model?.lastOnlineDate.formattedDate}
          />
        </div>

        <div className="min-w-0 flex-1">
          <Tabs defaultValue="profile">
            <TabsList variant="underline">
              <TabsTrigger value="profile" variant="underline">
                Профиль
              </TabsTrigger>
              <TabsTrigger value="security" variant="underline">
                Безопасность
              </TabsTrigger>
              <TabsTrigger value="sessions" variant="underline">
                Сессии
              </TabsTrigger>
              <TabsTrigger value="devices" variant="underline">
                Устройства
              </TabsTrigger>
              <TabsTrigger value="privacy" variant="underline">
                Приватность
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="pt-4">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="security" className="pt-4">
              <SecurityTab />
            </TabsContent>
            <TabsContent value="sessions" className="pt-4">
              <SessionsTab />
            </TabsContent>
            <TabsContent value="devices" className="pt-4">
              <DevicesTab />
            </TabsContent>
            <TabsContent value="privacy" className="pt-4">
              <PrivacyTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
});
