import { X } from "lucide-react";
import * as React from "react";

export interface TriggerClearButtonProps {
  onClear: () => void;
}

export const TriggerClearButton: React.FC<TriggerClearButtonProps> = ({
  onClear,
}) => (
  <span
    role="button"
    tabIndex={-1}
    onPointerDown={e => {
      e.preventDefault();
      e.stopPropagation();
    }}
    onClick={e => {
      e.stopPropagation();
      onClear();
    }}
    className="shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer inline-flex items-center justify-center"
  >
    <X className="h-4 w-4" />
  </span>
);
