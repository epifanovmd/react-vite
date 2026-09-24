import { cn } from "@shared/lib/utils/cn";
import { joinIds } from "@shared/lib/utils/join-ids";
import * as React from "react";

import { isInvalidVariant } from "../foundation";
import {
  type TextareaVariantProps,
  textareaVariants,
} from "./textarea-variants";
import { useTextarea } from "./use-textarea";

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    TextareaVariantProps {
  /** Подстраивать высоту под содержимое (до `maxRows`). */
  autoResize?: boolean;
  /** Синоним `rows`: минимальная высота в строках. */
  minRows?: number;
  maxRows?: number;
  /** Показывать счётчик символов (с лимитом при заданном `maxLength`). */
  showCount?: boolean;
  /** Класс корневого контейнера; `className` относится к самому textarea. */
  wrapperClassName?: string;
}

const ROOT_CLASS = "flex w-full flex-col gap-1";
const COUNTER_CLASS = "text-right text-xs tabular-nums";

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      wrapperClassName,
      size,
      variant,
      autoResize = true,
      rows,
      minRows,
      maxRows = 6,
      maxLength,
      showCount = false,
      value,
      defaultValue,
      onChange,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const {
      setRef,
      charCount,
      counterTone,
      hasValue,
      isControlled,
      handleChange,
    } = useTextarea({
      ref,
      value,
      defaultValue,
      autoResize,
      maxRows,
      maxLength,
      onChange,
    });

    const counterId = showCount ? `${generatedId}-counter` : undefined;
    const counterText =
      maxLength === undefined
        ? String(charCount)
        : `${charCount} / ${maxLength}`;
    const resizeClass = autoResize ? "resize-none overflow-hidden" : "resize-y";
    const valueProps = isControlled ? { value } : { defaultValue };

    return (
      <div
        className={cn(ROOT_CLASS, wrapperClassName)}
        data-has-value={hasValue}
        data-size={size ?? "md"}
        data-slot="input-root"
      >
        <textarea
          ref={setRef}
          rows={rows ?? minRows ?? 3}
          maxLength={maxLength}
          className={cn(
            textareaVariants({ size, variant }),
            resizeClass,
            className,
          )}
          data-slot="input"
          aria-describedby={joinIds(ariaDescribedBy, counterId)}
          aria-invalid={ariaInvalid ?? (isInvalidVariant(variant) || undefined)}
          {...valueProps}
          onChange={handleChange}
          {...props}
        />
        {showCount && (
          <p
            id={counterId}
            aria-live="polite"
            className={cn(COUNTER_CLASS, counterTone)}
            data-slot="textarea-counter"
          >
            {counterText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
