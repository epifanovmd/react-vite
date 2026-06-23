import { UserDto } from "@api/api-gen/data-contracts";
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
import { useUsersDataStore } from "@store";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z
    .string()
    .refine(
      v => !v || z.string().email().safeParse(v).success,
      "Неверный email",
    ),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface EditUserModalProps {
  open: boolean;
  user: UserDto;
  onClose: () => void;
  onSaved?: () => void;
}

export const EditUserModal: FC<EditUserModalProps> = ({
  open,
  user,
  onClose,
  onSaved,
}) => {
  const store = useUsersDataStore();
  const toast = useNotification();

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: user.email ?? "", phone: user.phone ?? "" },
  });

  useEffect(() => {
    if (open) {
      methods.reset({ email: user.email ?? "", phone: user.phone ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const onSubmit = methods.handleSubmit(async data => {
    const res = await store.updateUser(user.id, {
      email: data.email || undefined,
      phone: data.phone || undefined,
    });

    if (res.error) {
      toast.error(res.error.message);

      return;
    }

    toast.success("Данные пользователя обновлены");
    onSaved?.();
    onClose();
  });

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-lg">
        <ModalHeader>
          <ModalTitle>Редактировать пользователя</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 my-2">
              <InputFormField<FormData>
                name="email"
                label="Email"
                type="email"
                placeholder="user@example.com"
              />
              <InputFormField<FormData>
                name="phone"
                label="Телефон"
                placeholder="+79991234567"
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
