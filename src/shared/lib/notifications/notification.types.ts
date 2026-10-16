import { createInjectDecorator } from "@shared/lib/di";
import type * as React from "react";

/** Кнопка в тосте; `dismiss: false` оставляет тост открытым после нажатия. */
export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?:
    | "primary"
    | "secondary"
    | "destructive"
    | "success"
    | "warning"
    | "info"
    | "outline"
    | "ghost"
    | "link";
  dismiss?: boolean;
}

export interface NotificationOptions {
  id?: string;
  title?: React.ReactNode;
  duration?: number;
  action?: ToastAction | ToastAction[];
}

export interface PromiseMessages<T> {
  loading: string;
  success: string | ((value: T) => string);
  error: string | ((error: unknown) => string);
}

export const INotificationService = createInjectDecorator<INotificationService>(
  "INotificationService",
);

export interface INotificationService {
  success(message: React.ReactNode, options?: NotificationOptions): string;
  error(message: React.ReactNode, options?: NotificationOptions): string;
  warning(message: React.ReactNode, options?: NotificationOptions): string;
  info(message: React.ReactNode, options?: NotificationOptions): string;
  loading(message: React.ReactNode, options?: NotificationOptions): string;
  promise<T>(
    promise: Promise<T>,
    messages: PromiseMessages<T>,
    options?: NotificationOptions,
  ): Promise<T>;
  dismiss(id?: string): void;
}
