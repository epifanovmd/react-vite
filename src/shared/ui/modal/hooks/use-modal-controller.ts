import { useLatestRef } from "@shared/lib/hooks";
import { useCallback, useMemo, useState } from "react";

export interface ModalConfig {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Ключи окон, которые скрываются, пока открыто это. */
  suspends?: string[];
}

export interface ModalState {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export interface ModalController<Keys extends string> {
  modals: Record<Keys, ModalState>;
  open: (key: Keys) => void;
  close: (key: Keys) => void;
  toggle: (key: Keys) => void;
  closeAll: () => void;
  isOpen: (key: Keys) => boolean;
}

const KEY_SEPARATOR = "\u0000";

/**
 * Набор связанных окон с одним состоянием: стек, `suspends` для скрытия
 * родителя, `closeAll`. Конфиг может быть inline-объектом — набор ключей
 * сравнивается по содержимому, а не по identity.
 */
export const useModalController = <Keys extends string>(
  config: Record<Keys, ModalConfig>,
): ModalController<Keys> => {
  const configRef = useLatestRef(config);

  const keysSignature = Object.keys(config).join(KEY_SEPARATOR);
  const keys = useMemo(
    () => (keysSignature ? (keysSignature.split(KEY_SEPARATOR) as Keys[]) : []),
    [keysSignature],
  );

  const [intent, setIntent] = useState<Record<Keys, boolean>>(() =>
    keys.reduce(
      (acc, key) => {
        acc[key] = Boolean(config[key].defaultOpen);

        return acc;
      },
      {} as Record<Keys, boolean>,
    ),
  );

  const resolveIntent = useCallback(
    (key: Keys): boolean => {
      const cfg = configRef.current[key];

      return cfg?.open !== undefined ? cfg.open : Boolean(intent[key]);
    },
    [configRef, intent],
  );

  const setIntentForKey = useCallback(
    (key: Keys, value: boolean) => {
      const cfg = configRef.current[key];

      if (cfg?.open !== undefined) {
        cfg.onOpenChange?.(value);

        return;
      }
      setIntent(prev =>
        prev[key] === value ? prev : { ...prev, [key]: value },
      );
    },
    [configRef],
  );

  const openModal = useCallback(
    (key: Keys) => setIntentForKey(key, true),
    [setIntentForKey],
  );

  const closeModal = useCallback(
    (key: Keys) => setIntentForKey(key, false),
    [setIntentForKey],
  );

  const toggleModal = useCallback(
    (key: Keys) => setIntentForKey(key, !resolveIntent(key)),
    [resolveIntent, setIntentForKey],
  );

  const closeAll = useCallback(() => {
    keys.forEach(key => setIntentForKey(key, false));
  }, [keys, setIntentForKey]);

  const isOpen = useCallback(
    (key: Keys): boolean => {
      if (!resolveIntent(key)) return false;

      return !keys.some(
        other =>
          other !== key &&
          resolveIntent(other) &&
          (configRef.current[other]?.suspends ?? []).includes(key),
      );
    },
    [configRef, keys, resolveIntent],
  );

  const modals = useMemo(
    () =>
      keys.reduce(
        (acc, key) => {
          acc[key] = {
            open: isOpen(key),
            onOpen: () => openModal(key),
            onClose: () => closeModal(key),
            onToggle: () => toggleModal(key),
          };

          return acc;
        },
        {} as Record<Keys, ModalState>,
      ),
    [keys, openModal, closeModal, toggleModal, isOpen],
  );

  return {
    modals,
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
    closeAll,
    isOpen,
  };
};
