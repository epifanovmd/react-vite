import { Button } from "@components/ui";
import { Pencil } from "lucide-react";
import { FC } from "react";

import { ProfileDetails } from "../profile-details";
import { ProfileIdentity } from "../profile-identity";
import { ProfileMeta } from "../profile-meta";
import { ProfileCardProps } from "./ProfileCard.types";

export const ProfileCard: FC<ProfileCardProps> = ({
  name,
  login,
  roleLabel,
  emailVerified,
  fields,
  registeredAt,
  lastOnline,
  onEdit,
}) => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <div className="flex flex-col gap-6 px-5 py-6 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <ProfileIdentity
          name={name}
          login={login}
          roleLabel={roleLabel}
          emailVerified={emailVerified}
        />

        <Button
          size="sm"
          leftIcon={<Pencil size={15} />}
          onClick={onEdit}
          className="self-start"
        >
          Редактировать
        </Button>
      </div>

      <ProfileDetails fields={fields} />

      <ProfileMeta registeredAt={registeredAt} lastOnline={lastOnline} />
    </div>
  </div>
);
