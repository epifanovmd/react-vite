import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { ModalOpenContext } from "../modal-open-context";

/** Корень окна: пробрасывает `open` в контекст, чтобы тело знало, открыто ли оно. */
export const ModalRoot: React.FC<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
> = ({ open, children, ...props }) => (
  <ModalOpenContext.Provider value={open}>
    <DialogPrimitive.Root open={open} {...props}>
      {children}
    </DialogPrimitive.Root>
  </ModalOpenContext.Provider>
);
