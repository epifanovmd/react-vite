import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ComponentProps, FC } from "react";

import { cn } from "../../ui";

interface AppLogoLinkProps extends ComponentProps<typeof Link> {
  size?: "sm" | "md";
  className?: string;
}

export const AppLogoLink: FC<AppLogoLinkProps> = ({
  size = "sm",
  className,
  ...rest
}) => (
  <Link
    to="/"
    className={cn("group flex items-center gap-2.5", className)}
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
    <div className="leading-tight">
      <p
        className={cn(
          "font-semibold tracking-tight text-foreground",
          size === "sm" ? "text-sm" : "text-lg",
        )}
      >
        React Vite App
      </p>
      <p
        className={cn(
          "text-muted-foreground",
          size === "sm" ? "text-[11px]" : "text-xs",
        )}
      >
        Панель управления
      </p>
    </div>
  </Link>
);
