import {
  Button,
  Collapse,
  Form,
  InputFormField,
  MultiSelectFormField,
  SegmentedFormField,
  SwitchFormField,
  TextareaFormField,
} from "@shared/ui";
import { Terminal } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { EnrollAgentVM } from "../model/useEnrollAgentVM";
import {
  KILL_MODE_OPTIONS,
  type TInstallCommandForm,
} from "../model/validation";

interface InstallCommandFormProps {
  vm: EnrollAgentVM;
}

/** Параметры установки агента на узел: из них сервер собирает команду. */
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
        description="Подставляется сам после выпуска токена"
        placeholder="prefix.secret"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputFormField<TInstallCommandForm>
          name="name"
          label="Имя агента"
          description="Без него — имя узла"
          placeholder="node-01"
        />
        <InputFormField<TInstallCommandForm>
          name="user"
          label="Пользователь службы"
          description="Без него — по умолчанию установщика"
          placeholder="agent"
        />
      </div>
      <MultiSelectFormField<TInstallCommandForm>
        name="workers"
        label="Воркеры из выпуска"
        description={
          vm.releaseWorkers.length
            ? "Установятся вместе с агентом"
            : "В выпуске на сервере воркеров нет"
        }
        options={vm.releaseWorkers.map(name => ({ value: name, label: name }))}
        disabled={vm.releaseWorkers.length === 0}
        clearable
      />
      <SwitchFormField<TInstallCommandForm>
        name="privileged"
        label="Полные права службы"
        description="Нужны воркерам, которые меняют сеть или настройки узла"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InputFormField<TInstallCommandForm>
              name="config"
              label="Путь к agent.yaml"
              placeholder="/etc/agent/agent.yaml"
            />
            <InputFormField<TInstallCommandForm>
              name="stopTimeout"
              label="Время на остановку"
              placeholder="30s"
            />
          </div>
          <SegmentedFormField<TInstallCommandForm>
            name="killMode"
            label="Что останавливать вместе со службой"
            options={[...KILL_MODE_OPTIONS]}
          />
          <InputFormField<TInstallCommandForm>
            name="packages"
            label="Пакеты"
            description="Через запятую или пробел"
            placeholder="curl jq"
          />
          <InputFormField<TInstallCommandForm>
            name="rwPaths"
            label="Каталоги для записи"
            description="Через запятую или пробел"
            placeholder="/var/lib/example"
          />
          <TextareaFormField<TInstallCommandForm>
            name="sysctl"
            label="Настройки ядра (sysctl)"
            description="ключ=значение через запятую"
            placeholder="net.ipv4.ip_forward=1"
            rows={2}
          />
          <InputFormField<TInstallCommandForm>
            name="caFile"
            label="Сертификат центра (CA) на узле"
            placeholder="/etc/ssl/example-ca.pem"
          />
          <InputFormField<TInstallCommandForm>
            name="releases"
            label="Источник сборок воркеров"
            description="Без него — выпуск этого сервера"
            placeholder="https://example.com/releases"
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
