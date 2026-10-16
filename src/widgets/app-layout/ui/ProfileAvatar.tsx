import { UserAvatar } from "@entities/user";
import { FC } from "react";

interface ProfileAvatarProps {
  /** Имя пользователя: из него — инициалы и цвет фона. */
  name: string;
  /** Изображение аватара; без него — инициалы. */
  src?: string;
  size?: "sm" | "md";
}

/** Аватар текущего пользователя в шапке: `sm` — 32 px, `md` — 40 px. */
export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  name,
  src,
  size = "sm",
}) => <UserAvatar name={name} src={src} size={size === "sm" ? "md" : "lg"} />;
