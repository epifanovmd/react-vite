import {
  AsyncButton,
  Button,
  InputFormField,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalTitle,
} from "@components/ui";
import { useNotification } from "@core/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore, useSecurityStore } from "@store";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и подчёркивание"),
});

type FormData = z.infer<typeof schema>;

interface ChangeUsernameModalProps {
  open: boolean;
  currentUsername?: string | null;
  onClose: () => void;
}

export const ChangeUsernameModal: FC<ChangeUsernameModalProps> = ({
  open,
  currentUsername,
  onClose,
}) => {
  const security = useSecurityStore();
  const authStore = useAuthStore();
  const toast = useNotification();

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) methods.reset({ username: currentUsername ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = methods.handleSubmit(async data => {
    const res = await security.setUsername(data.username);

    if (res.error) {
      toast.error(res.error.message);

      return;
    }

    await authStore.load();
    toast.success("Username обновлён");
    onClose();
  });

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Изменить username</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 my-2">
              <InputFormField<FormData>
                name="username"
                label="Username"
                placeholder="username"
              />
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <AsyncButton onClick={() => onSubmit()}>Сохранить</AsyncButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
