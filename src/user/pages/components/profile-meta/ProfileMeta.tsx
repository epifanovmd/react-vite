import { FC } from "react";

import { ProfileMetaProps } from "./ProfileMeta.types";

export const ProfileMeta: FC<ProfileMetaProps> = ({
  registeredAt,
  lastOnline,
}) => {
  if (!registeredAt && !lastOnline) return null;

  return (
    <div className="flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:justify-between">
      {registeredAt && <span>Зарегистрирован: {registeredAt}</span>}
      {lastOnline && <span>Последний визит: {lastOnline}</span>}
    </div>
  );
};
