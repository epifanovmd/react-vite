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
import { passwordValidation } from "@core/auth/validations";
import { useNotification } from "@core/notifications";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSecurityStore } from "@store";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    password: passwordValidation,
    confirmPassword: passwordValidation,
  })
  .refine(d => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

type FormData = z.infer<typeof schema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: FC<ChangePasswordModalProps> = ({
  open,
  onClose,
}) => {
  const security = useSecurityStore();
  const toast = useNotification();

  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) methods.reset({ password: "", confirmPassword: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = methods.handleSubmit(async data => {
    const res = await security.changePassword(data.password);

    if (res.error) {
      toast.error(res.error.message);

      return;
    }

    toast.success("Пароль изменён");
    onClose();
  });

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>Смена пароля</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 my-2">
              <InputFormField<FormData>
                name="password"
                label="Новый пароль"
                type="password"
                placeholder="••••••••"
              />
              <InputFormField<FormData>
                name="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                placeholder="••••••••"
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
