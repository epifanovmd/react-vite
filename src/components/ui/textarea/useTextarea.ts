import { useMergedRef } from "@mantine/hooks";
import * as React from "react";

interface UseTextareaOptions {
  ref: React.ForwardedRef<HTMLTextAreaElement>;
  value: React.TextareaHTMLAttributes<HTMLTextAreaElement>["value"];
  defaultValue: React.TextareaHTMLAttributes<HTMLTextAreaElement>["defaultValue"];
  autoResize: boolean;
  maxRows: number;
  maxLength: number | undefined;
  showCount: boolean;
  onChange: React.TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"];
  onInput: React.TextareaHTMLAttributes<HTMLTextAreaElement>["onInput"];
}

interface UseTextareaReturn {
  setRef: (el: HTMLTextAreaElement | null) => void;
  charCount: number;
  counterClass: string;
  handleChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  handleInput: React.FormEventHandler<HTMLTextAreaElement>;
}

const getLength = (
  v: React.TextareaHTMLAttributes<HTMLTextAreaElement>["value"],
): number =>
  typeof v === "string"
    ? v.length
    : typeof v === "number"
      ? String(v).length
      : 0;

export const useTextarea = ({
  ref,
  value,
  defaultValue,
  autoResize,
  maxRows,
  maxLength,
  showCount,
  onChange,
  onInput,
}: UseTextareaOptions): UseTextareaReturn => {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const setRef = useMergedRef(ref, innerRef);

  const [charCount, setCharCount] = React.useState(() =>
    value !== undefined ? getLength(value) : getLength(defaultValue),
  );

  React.useEffect(() => {
    if (value !== undefined) setCharCount(getLength(value));
  }, [value]);

  const counterClass =
    maxLength === undefined
      ? "text-muted-foreground"
      : charCount >= maxLength
        ? "text-destructive"
        : charCount >= maxLength * 0.8
          ? "text-warning"
          : "text-muted-foreground";

  const adjustHeight = React.useCallback(() => {
    const el = innerRef.current;

    if (!el) return;

    el.style.height = "auto";

    const scrollHeight = el.scrollHeight;
    const style = window.getComputedStyle(el);
    const lineHeight = parseFloat(style.lineHeight) || 20;
    const pt = parseFloat(style.paddingTop);
    const pb = parseFloat(style.paddingBottom);
    const maxHeight = lineHeight * maxRows + pt + pb;

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

    const el = innerRef.current;

    if (!el?.parentElement) return;

    let prevWidth = el.parentElement.offsetWidth;

    const ro = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;

      if (width !== prevWidth) {
        prevWidth = width;
        adjustHeight();
      }
    });

    ro.observe(el.parentElement);

    return () => ro.disconnect();
  }, [autoResize, adjustHeight]);

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >(
    e => {
      onChange?.(e);
    },
    [onChange],
  );

  const handleInput = React.useCallback<
    React.FormEventHandler<HTMLTextAreaElement>
  >(
    e => {
      if (autoResize) adjustHeight();
      if (showCount || maxLength !== undefined)
        setCharCount(e.currentTarget.value.length);
      onInput?.(e);
    },
    [autoResize, adjustHeight, showCount, maxLength, onInput],
  );

  return { setRef, charCount, counterClass, handleChange, handleInput };
};
