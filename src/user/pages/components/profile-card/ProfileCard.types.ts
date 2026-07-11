import { InfoFieldProps } from "@components/ui";

export interface ProfileCardProps {
  name: string;
  login?: string | null;
  roleLabel?: string;
  emailVerified?: boolean;
  fields: InfoFieldProps[];
  registeredAt?: string;
  lastOnline?: string;
  onEdit: () => void;
}
