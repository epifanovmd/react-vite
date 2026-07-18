import { cn } from "@utils/cn";
import { FC, ReactNode } from "react";

export interface PageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({
  header,
  children,
  contentClassName,
}) => (
  <div className="flex h-full flex-col overflow-hidden">
    {header}
    <div className="flex min-h-0 flex-1 flex-col overflow-auto">
      <div
        className={cn(
          "mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col p-3 sm:p-6",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  </div>
);
