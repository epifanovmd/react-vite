import type { ReactNode } from "react";

export interface ProfileIdentityProps {
  name: string;
  /** Аватар с действиями; без него — аватар по инициалам. */
  avatar?: ReactNode;
  login?: string | null;
  roleLabel?: string;
  emailVerified?: boolean;
}
