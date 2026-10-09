import { formatter } from "@shared/lib/utils";
import {
  Alert,
  Button,
  CopyableText,
  Form,
  InputFormField,
  NumberInputFormField,
  PLAIN_NUMBER_FORMAT,
} from "@shared/ui";
import { Terminal } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { ProvisionNodeAgentVM } from "../model/useProvisionNodeAgentVM";
import type { TInstallCommandForm } from "../model/validation";

interface InstallCommandPanelProps {
  vm: ProvisionNodeAgentVM;
}

/** Команда установки: выполнить на узле, агент сам привяжется к узлу. */
export const InstallCommandPanel: FC<InstallCommandPanelProps> = observer(
  ({ vm }) => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Выполните команду на узле от root: установщик скачает агента с сервера,
        агент зарегистрируется по одноразовому токену и привяжется к этому узлу.
      </p>
      <Form
        form={vm.commandForm}
        onSubmit={vm.createCommand}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NumberInputFormField<TInstallCommandForm>
            name="expiresInMinutes"
            label="Срок токена, минут"
            formatOptions={PLAIN_NUMBER_FORMAT}
          />
          <InputFormField<TInstallCommandForm>
            name="workers"
            label="Воркеры"
            placeholder="netprobe"
            description="Через запятую; пусто — проверка сети"
          />
        </div>
        <InputFormField<TInstallCommandForm>
          name="baseUrl"
          label="Адрес сервера для узла"
          placeholder="https://api.example.com"
          description="Пусто — публичный адрес из настроек сервера"
        />
        <Button
          type="submit"
          variant={vm.command ? "outline" : "primary"}
          className="self-start"
          leftIcon={<Terminal size={15} />}
          loading={vm.commandForm.formState.isSubmitting}
        >
          {vm.command ? "Получить новую команду" : "Получить команду"}
        </Button>
      </Form>
      {vm.command && (
        <div className="flex flex-col gap-2">
          <Alert variant="warning">
            Токен в команде одноразовый и показывается только сейчас. Действует
            до {formatter.date.format(vm.command.expiresAt)}.
          </Alert>
          <pre className="overflow-auto whitespace-pre-wrap break-all rounded-lg bg-muted p-3 text-xs">
            {vm.command.command}
          </pre>
          <CopyableText
            text={vm.command.command}
            displayText="Скопировать команду"
            className="self-start text-sm"
          />
        </div>
      )}
    </div>
  ),
);
