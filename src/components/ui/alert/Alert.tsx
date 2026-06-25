import { type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import * as React from "react";

import { cn } from "../foundation/cn";
import {
  ALERT_ICON_COLORS,
  type AlertVariant,
  alertVariants,
} from "./alertVariants";

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
};

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  icon?: React.ReactNode | false;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, icon, onClose, children, ...props }, ref) => {
    const v = (variant ?? "default") as AlertVariant;
    const iconNode = icon === undefined ? DEFAULT_ICONS[v] : icon;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon !== false && (
          <span className={cn("mt-0.5 shrink-0", ALERT_ICON_COLORS[v])}>
            {iconNode}
          </span>
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <p className="font-medium text-foreground leading-snug">{title}</p>
          )}
          {children && (
            <div className={cn("text-muted-foreground", title && "mt-1")}>
              {children}
            </div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Dismiss"
            className="-mr-1 shrink-0 self-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export { Alert };
