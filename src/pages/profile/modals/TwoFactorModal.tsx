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
import { useSecurityStore } from "@store";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(1, "Введите пароль"),
  hint: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TwoFactorModalProps {
  open: boolean;
  mode: "enable" | "disable";
  onClose: () => void;
}

export const TwoFactorModal: FC<TwoFactorModalProps> = ({
  open,
  mode,
  onClose,
}) => {
  const security = useSecurityStore();
  const toast = useNotification();

  const isEnable = mode === "enable";
  const methods = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) methods.reset({ password: "", hint: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSubmit = methods.handleSubmit(async data => {
    const res = isEnable
      ? await security.enable2FA(data.password, data.hint || undefined)
      : await security.disable2FA(data.password);

    if (res.error) {
      toast.error(res.error.message);

      return;
    }

    toast.success(
      isEnable ? "Двухфакторная аутентификация включена" : "2FA отключена",
    );
    onClose();
  });

  return (
    <Modal open={open} onOpenChange={o => !o && onClose()}>
      <ModalOverlay />
      <ModalContent className="max-w-md">
        <ModalHeader>
          <ModalTitle>{isEnable ? "Включить 2FA" : "Отключить 2FA"}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="flex flex-col gap-4 my-2">
              <InputFormField<FormData>
                name="password"
                label="Текущий пароль"
                type="password"
                placeholder="••••••••"
              />
              {isEnable && (
                <InputFormField<FormData>
                  name="hint"
                  label="Подсказка (необязательно)"
                  placeholder="Например: приложение-аутентификатор"
                />
              )}
            </form>
          </FormProvider>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <AsyncButton
            variant={isEnable ? "primary" : "destructive"}
            onClick={() => onSubmit()}
          >
            {isEnable ? "Включить" : "Отключить"}
          </AsyncButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
