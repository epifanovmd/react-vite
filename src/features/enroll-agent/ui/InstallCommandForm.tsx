import { Button, Collapse, Form, InputFormField } from "@shared/ui";
import { Terminal } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { EnrollAgentVM } from "../model/useEnrollAgentVM";
import type { TInstallCommandForm } from "../model/validation";

interface InstallCommandFormProps {
  vm: EnrollAgentVM;
}

/**
 * Команда установки агента на узел: архив папки агента с сервера (что ставить —
 * в его настройках) и токен регистрации.
 */
export const InstallCommandForm: FC<InstallCommandFormProps> = observer(
  ({ vm }) => (
    <Form
      form={vm.installForm}
      onSubmit={vm.createCommand}
      className="flex flex-col gap-4"
    >
      <InputFormField<TInstallCommandForm>
        name="token"
        label="Токен регистрации"
        description="Подставляется сам после создания токена"
        placeholder="prefix.secret"
      />
      <Collapse size="sm">
        <Collapse.Trigger>Дополнительно</Collapse.Trigger>
        <Collapse.Content innerClassName="flex flex-col gap-4 pt-2">
          <InputFormField<TInstallCommandForm>
            name="baseUrl"
            label="Адрес сервера"
            description="Без него — публичный адрес из настроек сервера"
            placeholder="https://example.com"
          />
          <InputFormField<TInstallCommandForm>
            name="tokenFile"
            label="Файл с токеном на узле"
            description="Вместо токена в команде — путь к файлу"
            placeholder="/etc/agent/token"
          />
        </Collapse.Content>
      </Collapse>
      <Button
        type="submit"
        className="self-start"
        leftIcon={<Terminal size={15} />}
        loading={vm.installForm.formState.isSubmitting}
      >
        Получить команду
      </Button>
    </Form>
  ),
);
