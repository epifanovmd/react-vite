import * as React from "react";

/**
 * Открыто ли окно. Radix держит это у себя и наружу не отдаёт, а содержимому
 * знать нужно: пока играет анимация закрытия, оно рисует замороженную копию
 * (см. `ModalContent`). `undefined` — окно неуправляемое, морозить нечего.
 */
export const ModalOpenContext = React.createContext<boolean | undefined>(
  undefined,
);

export const useModalOpen = () => React.useContext(ModalOpenContext);
