import { Alert, Button, Modal, ModalContent, Select } from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { AssignNodeOwnerVM } from "../model/useAssignNodeOwnerVM";

interface AssignNodeOwnerModalProps {
  vm: AssignNodeOwnerVM;
}

/** Выбор владельца узла; пустой выбор снимает владельца. */
export const AssignNodeOwnerModal: FC<AssignNodeOwnerModalProps> = observer(
  ({ vm }) => (
    <Modal open={vm.node !== null} onOpenChange={open => !open && vm.close()}>
      <ModalContent
        size="sm"
        title="Владелец"
        description={
          vm.node
            ? `Узел ${vm.node.name}: владелец видит и обслуживает его по правам «свои»`
            : undefined
        }
        footer={
          <>
            <Button variant="outline" onClick={vm.close}>
              Отмена
            </Button>
            <Button loading={vm.isSaving} onClick={() => void vm.save()}>
              Сохранить
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <Select
            aria-label="Владелец"
            placeholder="не назначен"
            options={vm.userOptions}
            loading={vm.isLoadingUsers}
            value={vm.userId}
            search
            clearable
            onChange={value => vm.setUserId(value ?? null)}
          />
          {!vm.canListUsers && (
            <Alert variant="info">
              Нет права на список пользователей: можно назначить себя или снять
              владельца.
            </Alert>
          )}
        </div>
      </ModalContent>
    </Modal>
  ),
);
