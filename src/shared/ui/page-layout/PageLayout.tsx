import { cn } from "@shared/lib/utils/cn";
import * as React from "react";

import { PAGE_CONTAINER_CLASS } from "./page-container";

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Шапка вне области прокрутки (обычно `PageHeader`). */
  header?: React.ReactNode;
  contentClassName?: string;
}

const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ header, children, className, contentClassName, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-full flex-col overflow-hidden", className)}
      {...props}
    >
      {header}
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div
          className={cn(
            PAGE_CONTAINER_CLASS,
            "flex min-h-0 flex-1 flex-col p-3 sm:p-6",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  ),
);

PageLayout.displayName = "PageLayout";

export { PageLayout };
