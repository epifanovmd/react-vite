import {
  AsyncButton,
  Button,
  Field,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { useAuthStore, usePrivacyStore } from "@store";
import { FC, useEffect, useState } from "react";

const CONFIRM_WORD = "УДАЛИТЬ";

interface DeleteAccountModalProps {
  open: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: FC<DeleteAccountModalProps> = ({
  open,
  onClose,
}) => {
  const privacy = usePrivacyStore();
  const authStore = useAuthStore();
  const toast = useNotification();

  const [value, setValue] = useState("");

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  const handleDelete = async () => {
    const ok = await privacy.deleteAccount();

    if (!ok) {
      toast.error("Не удалось удалить аккаунт");

      return;
    }

    toast.success("Аккаунт удалён");
    onClose();
    authStore.signOut();
  };

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Удаление аккаунта</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col gap-4 my-2">
            <p className="text-sm text-muted-foreground">
              Это действие необратимо. Все ваши данные будут удалены без
              возможности восстановления.
            </p>
            <Field
              label={`Введите «${CONFIRM_WORD}» для подтверждения`}
            >
              <Input
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={CONFIRM_WORD}
                variant="error"
              />
            </Field>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <AsyncButton
            variant="destructive"
            disabled={value !== CONFIRM_WORD}
            onClick={handleDelete}
          >
            Удалить навсегда
          </AsyncButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
