import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useModalController,
} from "@shared/ui";
import { useState } from "react";

export const ControlledModals = () => {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const modal = useModalController({
    list: { open, onOpenChange: setOpen },
    confirm: { open: confirmOpen, onOpenChange: setConfirmOpen },
  });

  const openList = () => setOpen(true);
  const closeList = () => setOpen(false);
  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="info" onClick={openList}>
        Открыть управляемое окно
      </Button>
      <span className="self-center text-xs text-muted-foreground">
        open={String(open)}, confirm={String(confirmOpen)}
      </span>

      <Modal open={modal.modals.list.open} onOpenChange={setOpen}>
        <ModalContent
          size="sm"
          title="Управляемый список"
          description="Состояние живёт во внешнем useState"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={closeList}>
                Отмена
              </Button>
              <Button size="sm" variant="destructive" onClick={openConfirm}>
                Удалить
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">
              Оба окна открыты одновременно.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal open={modal.modals.confirm.open} onOpenChange={setConfirmOpen}>
        <ModalContent
          size="sm"
          title="Подтвердите удаление"
          description="Вы уверены?"
          confirmLabel="Да"
          confirmVariant="destructive"
          onConfirm={modal.closeAll}
          onCancel={closeConfirm}
        />
      </Modal>
    </div>
  );
};
