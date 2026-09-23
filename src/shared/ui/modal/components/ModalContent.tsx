import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@shared/lib/utils/cn";
import { type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { Button, type ButtonProps } from "../../button";
import { IconButton } from "../../icon-button";
import { useModalOpen } from "../modal-open-context";
import { modalContentVariants } from "./modal-variants";
import { ModalBody } from "./ModalBody";
import { ModalDescription } from "./ModalDescription";
import { ModalFooter } from "./ModalFooter";
import { ModalHeader } from "./ModalHeader";
import { ModalOverlay } from "./ModalOverlay";
import { ModalTitle } from "./ModalTitle";

type ContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "title"
>;

type ModalVariantProps = VariantProps<typeof modalContentVariants>;

export interface ModalContentProps extends ContentProps, ModalVariantProps {
  disableInteractOutside?: boolean;
  hideCloseButton?: boolean;

  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;

  onConfirm?: () => void | Promise<void>;
  confirmLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  onCancel?: () => void;
  cancelLabel?: string;
  cancelVariant?: ButtonProps["variant"];
}

export const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      position,
      size,
      disableInteractOutside,
      hideCloseButton,
      title,
      description,
      footer,
      onConfirm,
      confirmLabel = "Confirm",
      confirmVariant = "primary",
      onCancel,
      cancelLabel = "Cancel",
      cancelVariant = "outline",
      ...props
    },
    ref,
  ) => {
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const closeRef = React.useRef<HTMLButtonElement>(null);

    /**
     * Пока играет анимация закрытия, Radix держит окно смонтированным, а
     * данные под ним уже обнулились: `open={!!model}` и `{model && <Body/>}`
     * дают пустое окно на две десятых секунды. Поэтому на время закрытия
     * содержимое замораживается — последний виденный кадр и доигрывает.
     */
    const open = useModalOpen();
    const view = { children, title, description, footer };
    const frozen = React.useRef(view);

    if (open !== false) frozen.current = view;

    const shown = open === false ? frozen.current : view;

    const isSkeletonMode =
      shown.title !== undefined ||
      shown.footer !== undefined ||
      onConfirm !== undefined ||
      onCancel !== undefined;

    const handleConfirm = async () => {
      setConfirmLoading(true);
      try {
        await onConfirm?.();
        closeRef.current?.click();
      } finally {
        setConfirmLoading(false);
      }
    };

    const handleCancel = () => {
      onCancel?.();
      closeRef.current?.click();
    };

    const resolvedFooter =
      shown.footer ??
      (onConfirm !== undefined || onCancel !== undefined ? (
        <>
          {onCancel !== undefined && (
            <Button
              variant={cancelVariant}
              onClick={handleCancel}
              disabled={confirmLoading}
            >
              {cancelLabel}
            </Button>
          )}
          {onConfirm !== undefined && (
            <Button
              variant={confirmVariant}
              onClick={handleConfirm}
              loading={confirmLoading}
            >
              {confirmLabel}
            </Button>
          )}
        </>
      ) : null);

    return (
      <DialogPrimitive.Portal>
        <ModalOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            modalContentVariants({ position, size }),
            "flex max-h-[85vh] flex-col",
            className,
          )}
          onPointerDownOutside={e => {
            if (disableInteractOutside) e.preventDefault();
          }}
          onEscapeKeyDown={e => {
            if (disableInteractOutside) e.preventDefault();
          }}
          {...props}
        >
          {isSkeletonMode ? (
            <>
              {shown.title !== undefined && (
                <ModalHeader>
                  <ModalTitle>{shown.title}</ModalTitle>
                  {shown.description && (
                    <ModalDescription>{shown.description}</ModalDescription>
                  )}
                </ModalHeader>
              )}
              {shown.children && <ModalBody>{shown.children}</ModalBody>}
              {resolvedFooter && <ModalFooter>{resolvedFooter}</ModalFooter>}
            </>
          ) : (
            shown.children
          )}

          {!hideCloseButton && (
            <DialogPrimitive.Close asChild>
              <IconButton
                size="sm"
                aria-label="Close"
                className="absolute right-3 top-3"
              >
                <X size={14} />
              </IconButton>
            </DialogPrimitive.Close>
          )}

          <DialogPrimitive.Close
            ref={closeRef}
            className="sr-only"
            tabIndex={-1}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
ModalContent.displayName = "ModalContent";
