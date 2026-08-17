import { cn } from "@shared/lib/utils/cn";
import { Info } from "lucide-react";
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../tooltip";
import type { FieldProps } from "../types";

export type { FieldProps };

export const Field = React.forwardRef<
  HTMLDivElement,
  FieldProps & React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      label,
      labelPlacement = "outside",
      hint,
      description,
      error,
      required,
      htmlFor,
      labelId,
      descriptionId,
      errorId,
      fieldClassName,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const hasFloatingLabel =
      labelPlacement === "floating" && label !== undefined;
    const labelContent = label !== undefined && (
      <>
        <label
          id={labelId}
          htmlFor={htmlFor}
          data-slot="field-label"
          className={cn(
            "font-medium leading-none select-none",
            hasFloatingLabel
              ? [
                  "cursor-text text-sm text-muted-foreground transition-all duration-200",
                  "group-focus-within/floating:text-xs group-focus-within/floating:text-foreground",
                  "group-has-[[data-has-value=true]]/floating:text-xs",
                  "group-has-[[aria-invalid=true]]/floating:text-destructive",
                ]
              : "text-sm text-foreground",
            !htmlFor && "cursor-default",
          )}
        >
          {label}
          {required && (
            <span className="text-destructive ml-0.5" aria-hidden>
              *
            </span>
          )}
        </label>

        {hint !== undefined && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  role="img"
                  aria-label="Hint"
                  className="inline-flex items-center cursor-help text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-[260px] text-xs">
                {hint}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </>
    );

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1.5", fieldClassName ?? className)}
        data-label-placement={hasFloatingLabel ? "floating" : "outside"}
        data-slot="field"
        {...props}
      >
        {hasFloatingLabel ? (
          <div
            className={cn(
              "group/floating relative",
              "[&_[data-slot=input]]:h-14 [&_[data-slot=input]]:pt-6 [&_[data-slot=input]]:pb-1.5",
              "[&_[data-slot=input]]:placeholder:opacity-0 focus-within:[&_[data-slot=input]]:placeholder:opacity-100",
              "[&:has([data-size=sm])_[data-slot=input]]:h-12 [&:has([data-size=sm])_[data-slot=input]]:pt-5 [&:has([data-size=sm])_[data-slot=input]]:pb-1",
              "[&:has([data-size=lg])_[data-slot=input]]:h-16 [&:has([data-size=lg])_[data-slot=input]]:pt-7 [&:has([data-size=lg])_[data-slot=input]]:pb-2",
              "[&_[data-slot=input-left-icon]]:top-[62%] [&_[data-slot=input-actions]]:top-[62%]",
            )}
            data-slot="field-control"
          >
            {children}
            <div
              className={cn(
                "absolute left-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1.5 transition-all duration-200",
                "group-focus-within/floating:top-2 group-focus-within/floating:translate-y-0",
                "group-has-[[data-has-value=true]]/floating:top-2 group-has-[[data-has-value=true]]/floating:translate-y-0",
                "group-has-[[data-size=sm]]/floating:left-2 group-has-[[data-size=lg]]/floating:left-4",
                "group-has-[[data-slot=input-left-icon]]/floating:left-10",
                "group-has-[:disabled]/floating:opacity-50",
              )}
              data-slot="field-label-container"
            >
              {labelContent}
            </div>
          </div>
        ) : (
          <>
            {labelContent && (
              <div className="flex min-h-[1.25rem] items-center gap-1.5">
                {labelContent}
              </div>
            )}
            {children}
          </>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            className="text-xs text-destructive leading-tight"
          >
            {error}
          </p>
        )}
        {description !== undefined && (
          <p
            id={descriptionId}
            className="text-xs text-muted-foreground leading-tight"
          >
            {description}
          </p>
        )}
      </div>
    );
  },
);
Field.displayName = "Field";
