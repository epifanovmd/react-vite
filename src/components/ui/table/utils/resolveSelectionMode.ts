import type { SelectionMode } from "../Table.types";

export interface SelMode {
  enabled: boolean;
  multi: boolean;
}

export const resolveSelectionMode = (selection: SelectionMode | undefined): SelMode => {
  if (!selection) return { enabled: false, multi: false };
  if (selection === "single") return { enabled: true, multi: false };

  return { enabled: true, multi: true };
};
