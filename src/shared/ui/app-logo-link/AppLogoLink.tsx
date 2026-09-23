import { APP_NAME } from "@shared/config/env";
import { cn } from "@shared/lib/utils/cn";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComponentProps, FC } from "react";

interface AppLogoLinkProps extends ComponentProps<typeof Link> {
  size?: "sm" | "md";
  /** Только значок и имя: для узкой шапки, где подпись ни к чему */
  compact?: boolean;
  className?: string;
}

export const AppLogoLink: FC<AppLogoLinkProps> = ({
  size = "sm",
  compact = false,
  className,
  ...rest
}) => (
  <Link
    to="/"
    className={cn(
      "group flex items-center rounded-lg transition-colors",
      compact ? "gap-2 px-1 py-1 hover:bg-accent" : "gap-2.5",
      className,
    )}
    title={APP_NAME}
    {...rest}
  >
    <div
      className={cn(
        "relative flex flex-shrink-0 items-center justify-center rounded-xl",
        "bg-gradient-to-br from-brand to-brand/70 text-brand-foreground",
        "shadow-sm shadow-brand/30 ring-1 ring-inset ring-white/15",
        "transition-transform duration-200 group-hover:scale-105",
        size === "sm" ? "h-8 w-8" : "h-11 w-11",
      )}
    >
      <ShieldCheck size={size === "sm" ? 16 : 24} strokeWidth={2.2} />
    </div>
    <div className={cn("leading-tight", compact && "hidden xl:block")}>
      <p
        className={cn(
          "font-semibold tracking-tight text-foreground",
          size === "sm" ? "text-sm" : "text-lg",
        )}
      >
        {APP_NAME}
      </p>
      {!compact && (
        <p
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-[11px]" : "text-xs",
          )}
        >
          Панель управления
        </p>
      )}
    </div>
  </Link>
);
