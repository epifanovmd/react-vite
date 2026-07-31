import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import type { DropdownPlacementProps } from "../types";
import { SelectPopoverContent } from "./SelectPopoverContent";

export interface SelectDropdownProps extends DropdownPlacementProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  /** Не рендерить контент дропдауна. */
  hidden?: boolean;
  onInteractOutside?: (e: Event) => void;
  /** Триггер — любой элемент, принимающий ref и пропсы (asChild). */
  trigger: React.ReactNode;
  children: React.ReactNode;
}

/** Оболочка выпадающего списка: Popover + позиционирование контента. */
export const SelectDropdown = ({
  open,
  onOpenChange,
  disabled,
  hidden,
  onInteractOutside,
  trigger,
  children,
  ...placement
}: SelectDropdownProps) => (
  <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <PopoverPrimitive.Trigger asChild disabled={disabled}>
      {trigger}
    </PopoverPrimitive.Trigger>

    {hidden ? null : (
      <SelectPopoverContent onInteractOutside={onInteractOutside} {...placement}>
        {children}
      </SelectPopoverContent>
    )}
  </PopoverPrimitive.Root>
);

SelectDropdown.displayName = "SelectDropdown";
