import { InfoFieldProps } from "@shared/ui";
import type { ReactNode } from "react";

export interface ProfileCardProps {
  name: string;
  avatar?: ReactNode;
  login?: string | null;
  roleLabel?: string;
  emailVerified?: boolean;
  fields: InfoFieldProps[];
  registeredAt?: string;
  lastOnline?: string;
  onEdit: () => void;
}
