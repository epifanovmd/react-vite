import { Switch } from "@shared/ui";
import type { FC } from "react";

export interface ToggleRowProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const ToggleRow: FC<ToggleRowProps> = ({
  label,
  checked,
  onCheckedChange,
}) => (
  <label className="flex items-center gap-2 text-xs text-foreground">
    <Switch size="sm" checked={checked} onCheckedChange={onCheckedChange} />
    {label}
  </label>
);
