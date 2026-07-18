import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@utils/cn";
import * as React from "react";

export type ModalOverlayProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Overlay
>;

export const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 transition-all duration-200",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    style={{ backgroundColor: "var(--overlay)" }}
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";
