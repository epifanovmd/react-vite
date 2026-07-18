import { cn } from "@utils/cn";
import * as React from "react";

import { Spinner } from "../../spinner";

export const SelectLoading = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center px-2 py-6", className)}>
    <Spinner size="md" />
  </div>
);
SelectLoading.displayName = "SelectLoading";
