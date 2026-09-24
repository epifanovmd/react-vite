import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useModalController,
} from "@shared/ui";

export const StackedModals = () => {
  const modal = useModalController({
    list: {},
    create: {},
    confirm: {},
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={modal.modals.list.onOpen}>
        Открыть список
      </Button>

      <Modal
        open={modal.modals.list.open}
        onOpenChange={modal.modals.list.onToggle}
      >
        <ModalContent
          size="md"
          title="Правила"
          description="Выберите или создайте правило"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={modal.modals.list.onClose}
              >
                Отмена
              </Button>
              <Button size="sm" onClick={modal.modals.create.onOpen}>
                Создать правило
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">Список правил…</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.create.open}
        onOpenChange={modal.modals.create.onToggle}
      >
        <ModalContent
          size="sm"
          title="Создание правила"
          description="Заполните параметры правила"
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={modal.modals.create.onClose}
              >
                Назад
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={modal.modals.confirm.onOpen}
              >
                Удалить
              </Button>
            </>
          }
        >
          <ModalBody>
            <p className="text-sm text-muted-foreground">Поля формы…</p>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        open={modal.modals.confirm.open}
        onOpenChange={modal.modals.confirm.onToggle}
      >
        <ModalContent
          size="sm"
          title="Удалить правило?"
          description="Это действие нельзя отменить."
          confirmLabel="Удалить"
          confirmVariant="destructive"
          onConfirm={modal.closeAll}
          onCancel={modal.modals.confirm.onClose}
        />
      </Modal>
    </div>
  );
};
