import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "../../foundation/cn";
import { selectContentClasses } from "../selectVariants";
import type {
  DropdownAlign,
  DropdownCollisionPadding,
  DropdownMaxWidth,
  DropdownSide,
  DropdownWidth,
} from "../types";

export interface SelectPopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  children?: React.ReactNode;
  dropdownSide?: DropdownSide;
  dropdownAlign?: DropdownAlign;
  dropdownSideOffset?: number;
  dropdownAlignOffset?: number;
  dropdownAvoidCollisions?: boolean;
  dropdownCollisionPadding?: DropdownCollisionPadding;
  dropdownWidth?: DropdownWidth;
  dropdownMaxWidth?: DropdownMaxWidth;
  dropdownContainer?: HTMLElement | null;
}

export const SelectPopoverContent = ({
  className,
  children,
  sideOffset = 4,
  align = "start",
  side: sideProp,
  alignOffset,
  avoidCollisions,
  collisionPadding,
  dropdownSide,
  dropdownAlign,
  dropdownSideOffset,
  dropdownAlignOffset,
  dropdownAvoidCollisions,
  dropdownCollisionPadding,
  dropdownWidth = "trigger",
  dropdownMaxWidth,
  dropdownContainer,
  onOpenAutoFocus,
  ...props
}: SelectPopoverContentProps) => {
  const resolvedSide = dropdownSide ?? sideProp;
  const resolvedAlign = dropdownAlign ?? align;
  const resolvedSideOffset = dropdownSideOffset ?? sideOffset;
  const resolvedAlignOffset = dropdownAlignOffset ?? alignOffset;
  const resolvedAvoidCollisions =
    dropdownAvoidCollisions ?? avoidCollisions ?? true;
  const resolvedCollisionPadding =
    dropdownCollisionPadding ?? (collisionPadding as DropdownCollisionPadding);

  const hasMaxWidth = dropdownMaxWidth != null && dropdownMaxWidth !== "trigger";
  const hasWidth = dropdownWidth != null;

  const widthClass =
    dropdownWidth === "trigger"
      ? "w-[var(--radix-popover-trigger-width)]"
      : dropdownWidth === "auto"
        ? hasMaxWidth
          ? undefined
          : "min-w-[var(--radix-popover-trigger-width)]"
        : undefined;

  const maxWidthClass =
    dropdownMaxWidth === "trigger"
      ? "max-w-[var(--radix-popover-trigger-width)]"
      : undefined;

  const widthStyle: React.CSSProperties | undefined =
    typeof dropdownWidth === "number"
      ? { width: dropdownWidth }
      : undefined;

  const maxWidthStyle: React.CSSProperties | undefined =
    typeof dropdownMaxWidth === "number"
      ? { maxWidth: dropdownMaxWidth }
      : undefined;

  const content = (
    <PopoverPrimitive.Content
      side={resolvedSide}
      align={resolvedAlign}
      sideOffset={resolvedSideOffset}
      alignOffset={resolvedAlignOffset}
      avoidCollisions={resolvedAvoidCollisions}
      collisionPadding={resolvedCollisionPadding}
      onOpenAutoFocus={e => {
        e.preventDefault();
        onOpenAutoFocus?.(e);
      }}
      className={cn(
        selectContentClasses,
        widthClass,
        maxWidthClass,
        "max-h-60",
        className,
      )}
      style={{ ...widthStyle, ...maxWidthStyle } as React.CSSProperties}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  );

  if (dropdownContainer === null) return content;

  return (
    <PopoverPrimitive.Portal container={dropdownContainer ?? undefined}>
      {content}
    </PopoverPrimitive.Portal>
  );
};

SelectPopoverContent.displayName = "SelectPopoverContent";
