import { useMergedRef } from "@mantine/hooks";
import * as React from "react";

type TextareaValue = React.TextareaHTMLAttributes<HTMLTextAreaElement>["value"];

interface UseTextareaOptions {
  ref: React.ForwardedRef<HTMLTextAreaElement>;
  value: TextareaValue;
  defaultValue: React.TextareaHTMLAttributes<HTMLTextAreaElement>["defaultValue"];
  autoResize: boolean;
  maxRows: number;
  maxLength: number | undefined;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
}

interface UseTextareaResult {
  setRef: (el: HTMLTextAreaElement | null) => void;
  charCount: number;
  counterTone: string;
  hasValue: boolean;
  isControlled: boolean;
  handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

/** Доля лимита, после которой счётчик подсвечивается как предупреждение. */
const COUNTER_WARN_RATIO = 0.8;
const FALLBACK_LINE_HEIGHT = 20;

const getLength = (value: TextareaValue): number => String(value ?? "").length;

const getCounterTone = (
  charCount: number,
  maxLength: number | undefined,
): string => {
  if (maxLength === undefined) return "text-muted-foreground";
  if (charCount >= maxLength) return "text-destructive";
  if (charCount >= maxLength * COUNTER_WARN_RATIO) return "text-warning";

  return "text-muted-foreground";
};

/**
 * Внутренняя логика Textarea: автоподбор высоты до `maxRows`, счётчик символов
 * для controlled и uncontrolled режима.
 */
export const useTextarea = ({
  ref,
  value,
  defaultValue,
  autoResize,
  maxRows,
  maxLength,
  onChange,
}: UseTextareaOptions): UseTextareaResult => {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  const setRef = useMergedRef(ref, innerRef);
  const isControlled = value !== undefined;

  const [uncontrolledCount, setUncontrolledCount] = React.useState(() =>
    getLength(defaultValue),
  );
  const charCount = isControlled ? getLength(value) : uncontrolledCount;
  const counterTone = getCounterTone(charCount, maxLength);

  const adjustHeight = React.useCallback(() => {
    const el = innerRef.current;

    if (!el) return;

    el.style.height = "auto";

    const scrollHeight = el.scrollHeight;
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || FALLBACK_LINE_HEIGHT;
    const paddingTop = parseFloat(style.paddingTop) || 0;
    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

    if (scrollHeight > maxHeight) {
      el.style.height = `${maxHeight}px`;
      el.style.overflowY = "auto";
    } else {
      el.style.height = `${scrollHeight}px`;
      el.style.overflowY = "hidden";
    }
  }, [maxRows]);

  React.useLayoutEffect(() => {
    if (autoResize) adjustHeight();
  }, [autoResize, adjustHeight, value]);

  React.useEffect(() => {
    if (!autoResize) return;

    const parent = innerRef.current?.parentElement;

    if (!parent) return;

    let prevWidth = parent.offsetWidth;

    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;

      if (width !== prevWidth) {
        prevWidth = width;
        adjustHeight();
      }
    });

    observer.observe(parent);

    return () => observer.disconnect();
  }, [autoResize, adjustHeight]);

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >(
    event => {
      if (autoResize) adjustHeight();
      if (!isControlled) setUncontrolledCount(event.currentTarget.value.length);
      onChange?.(event);
    },
    [adjustHeight, autoResize, isControlled, onChange],
  );

  return {
    setRef,
    charCount,
    counterTone,
    hasValue: charCount > 0,
    isControlled,
    handleChange,
  };
};
