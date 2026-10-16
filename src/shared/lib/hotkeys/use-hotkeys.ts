import { useLatestRef } from "@shared/lib/hooks";
import { type RefObject, useEffect, useRef } from "react";

import { type HotkeyBinding, runHotkeys } from "./run-hotkeys";

export type { HotkeyBinding, HotkeyOptions } from "./run-hotkeys";

export interface UseHotkeysOptions {
  enabled?: boolean;
  /** Слушать нажатия только внутри элемента; по умолчанию — весь документ. */
  target?: RefObject<HTMLElement | null>;
}

interface IHotkeysSubscription {
  element: HTMLElement | Document;
  dispose: () => void;
}

/**
 * Горячие клавиши: `useHotkeys([["mod+k", open], [["backspace", "delete"], remove]])`.
 * Привязки можно передавать inline — обработчики читаются в момент нажатия.
 * В полях ввода сочетания игнорируются, пока у привязки нет `allowInInputs`.
 * Элемент `target` сверяется после каждого коммита: появившийся позже или
 * заменённый элемент подхватывается без смены ref.
 */
export const useHotkeys = (
  bindings: HotkeyBinding[],
  { enabled = true, target }: UseHotkeysOptions = {},
): void => {
  const bindingsRef = useLatestRef(bindings);
  const subscriptionRef = useRef<IHotkeysSubscription | null>(null);

  useEffect(() => {
    const element = enabled ? (target ? target.current : document) : null;

    if (subscriptionRef.current?.element === element) return;

    subscriptionRef.current?.dispose();
    subscriptionRef.current = null;

    if (!element) return;

    const handleKeyDown = (event: Event) =>
      runHotkeys(bindingsRef.current, event as KeyboardEvent);

    element.addEventListener("keydown", handleKeyDown);
    subscriptionRef.current = {
      element,
      dispose: () => element.removeEventListener("keydown", handleKeyDown),
    };
  });

  useEffect(
    () => () => {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = null;
    },
    [],
  );
};
