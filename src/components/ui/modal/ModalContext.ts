import * as React from "react";

import { type ButtonProps } from "../button";

export interface ModalRenderProps {
  id: string;
  onClose: () => void;
}

export type ModalContent =
  | React.ReactNode
  | ((props: ModalRenderProps) => React.ReactNode);

export interface ModalOptions {
  content?: ModalContent;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  position?: "center" | "top" | "bottom";
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

  onClose?: () => void;
}

export interface ConfirmOptions {
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: ButtonProps["variant"];
  size?: "sm" | "md";
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface ModalEntry {
  id: string;
  open: boolean;
  options: ModalOptions;
}

export interface ModalContextValue {
  openModal: (options: ModalOptions) => string;
  closeModal: (id: string) => void;
  closeAll: () => void;
  confirm: (options: ConfirmOptions) => void;
}

export const ModalContext = React.createContext<ModalContextValue | null>(null);
