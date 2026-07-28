import * as React from "react";

export interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface UseRippleOptions {
  disabled?: boolean;
  onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
}

export interface UseRippleResult {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  ripples: Ripple[];
  handlePointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  removeRipple: (id: number) => void;
}

export const useRipple = ({
  disabled = false,
  onPointerDown,
}: UseRippleOptions = {}): UseRippleResult => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const nextRippleId = React.useRef(0);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);

      if (disabled || e.button !== 0) return;

      const rect = buttonRef.current?.getBoundingClientRect();

      if (!rect) return;

      const size = Math.hypot(rect.width, rect.height) * 2;
      const id = nextRippleId.current++;

      setRipples(prev => [
        ...prev,
        {
          id,
          x: e.clientX - rect.left - size / 2,
          y: e.clientY - rect.top - size / 2,
          size,
        },
      ]);
    },
    [disabled, onPointerDown],
  );

  const removeRipple = React.useCallback((id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  return { buttonRef, ripples, handlePointerDown, removeRipple };
};
