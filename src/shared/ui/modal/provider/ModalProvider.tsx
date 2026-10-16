import * as React from "react";

import {
  ModalContext,
  type ModalContextValue,
  type ModalEntry,
  type ModalOptions,
} from "./modal-context";
import { ProviderModal } from "./ProviderModal";

/** Длительность анимации закрытия из `modalContentVariants` (duration-200). */
const CLOSE_ANIMATION_DURATION = 200;

const generateId = () =>
  `modal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modals, setModals] = React.useState<ModalEntry[]>([]);
  const modalsRef = React.useRef<ModalEntry[]>([]);
  const timersRef = React.useRef(new Set<ReturnType<typeof setTimeout>>());

  React.useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  /** Синхронно обновляет список: open/close в одном обработчике видят друг друга. */
  const updateModals = React.useCallback(
    (update: (prev: ModalEntry[]) => ModalEntry[]) => {
      modalsRef.current = update(modalsRef.current);
      setModals(modalsRef.current);
    },
    [],
  );

  const scheduleRemoval = React.useCallback(
    (id: string) => {
      const timer = setTimeout(() => {
        timersRef.current.delete(timer);
        updateModals(prev => prev.filter(m => m.id !== id));
      }, CLOSE_ANIMATION_DURATION);

      timersRef.current.add(timer);
    },
    [updateModals],
  );

  const openModal = React.useCallback(
    (options: ModalOptions): string => {
      const id = generateId();

      updateModals(prev => [...prev, { id, open: true, options }]);

      return id;
    },
    [updateModals],
  );

  const closeModal = React.useCallback(
    (id: string) => {
      const entry = modalsRef.current.find(m => m.id === id);

      if (!entry?.open) return;

      updateModals(prev =>
        prev.map(m => (m.id === id ? { ...m, open: false } : m)),
      );
      entry.options.onClose?.();
      scheduleRemoval(id);
    },
    [updateModals, scheduleRemoval],
  );

  const closeAll = React.useCallback(() => {
    modalsRef.current.forEach(m => closeModal(m.id));
  }, [closeModal]);

  const confirm = React.useCallback<ModalContextValue["confirm"]>(
    options =>
      new Promise<boolean>(resolve => {
        openModal({
          size: options.size ?? "sm",
          disableInteractOutside: true,
          hideCloseButton: true,
          title: options.title,
          description: options.description,
          confirmLabel: options.confirmLabel,
          confirmVariant: options.confirmVariant,
          cancelLabel: options.cancelLabel,
          onConfirmError: options.onConfirmError,
          onConfirm: async () => {
            await options.onConfirm?.();
            resolve(true);
          },
          onCancel: () => resolve(false),
          onClose: () => resolve(false),
        });
      }),
    [openModal],
  );

  const value = React.useMemo<ModalContextValue>(
    () => ({ openModal, closeModal, closeAll, confirm }),
    [openModal, closeModal, closeAll, confirm],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modals.map(entry => (
        <ProviderModal key={entry.id} entry={entry} onClose={closeModal} />
      ))}
    </ModalContext.Provider>
  );
};
