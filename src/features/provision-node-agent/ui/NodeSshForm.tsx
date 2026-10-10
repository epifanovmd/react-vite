import {
  Alert,
  Collapse,
  Form,
  InputFormField,
  NumberInputFormField,
  PLAIN_NUMBER_FORMAT,
  SegmentedFormField,
  SwitchFormField,
  TextareaFormField,
} from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useWatch } from "react-hook-form";

import type { ProvisionNodeAgentVM } from "../model/useProvisionNodeAgentVM";
import { SSH_AUTH_OPTIONS, type TSshForm } from "../model/validation";

interface NodeSshFormProps {
  vm: ProvisionNodeAgentVM;
  /** id формы: кнопка отправки — в подвале окна. */
  formId: string;
}

/** Вход по SSH: адрес, пользователь, пароль или ключ, sudo и параметры. */
export const NodeSshForm: FC<NodeSshFormProps> = observer(({ vm, formId }) => {
  const auth = useWatch({ control: vm.sshForm.control, name: "auth" });
  const username = useWatch({ control: vm.sshForm.control, name: "username" });
  const uninstall = vm.mode === "uninstall";

  return (
    <Form
      id={formId}
      form={vm.sshForm}
      onSubmit={vm.submitSsh}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
        <InputFormField<TSshForm>
          name="host"
          label="Адрес SSH"
          placeholder={vm.node?.host ?? "203.0.113.10"}
          description="Пусто — адрес узла"
        />
        <NumberInputFormField<TSshForm>
          name="port"
          label="Порт"
          formatOptions={PLAIN_NUMBER_FORMAT}
        />
      </div>
      <InputFormField<TSshForm> name="username" label="Пользователь" />
      <SegmentedFormField<TSshForm>
        name="auth"
        label="Вход"
        options={[...SSH_AUTH_OPTIONS]}
      />
      {auth === "key" ? (
        <>
          <TextareaFormField<TSshForm>
            name="privateKey"
            label="Приватный ключ (PEM)"
            rows={4}
            placeholder="-----BEGIN OPENSSH PRIVATE KEY-----"
          />
          <InputFormField<TSshForm>
            name="passphrase"
            label="Пароль ключа"
            type="password"
            description="Если ключ защищён паролем"
          />
        </>
      ) : (
        <InputFormField<TSshForm>
          name="password"
          label="Пароль"
          type="password"
          description="Он же — для sudo, если sudo спрашивает пароль"
        />
      )}
      {username !== "root" && (
        <SwitchFormField<TSshForm>
          name="sudo"
          label="Через sudo"
          description="Пользователю не root нужны права администратора"
        />
      )}
      {uninstall && (
        <SwitchFormField<TSshForm>
          name="purge"
          label="Удалить всё"
          description="Вместе с программой — данные, настройки, пакеты и пользователя службы"
        />
      )}
      <Collapse size="sm">
        <Collapse.Trigger>Дополнительно</Collapse.Trigger>
        <Collapse.Content innerClassName="flex flex-col gap-4 pt-2">
          <InputFormField<TSshForm>
            name="backendUrl"
            label="Адрес сервера для узла"
            placeholder="https://api.example.com"
            description="Пусто — публичный адрес из настроек сервера"
          />
        </Collapse.Content>
      </Collapse>
      <Alert variant="info">
        Данные для входа используются один раз и в открытом виде не хранятся.
      </Alert>
    </Form>
  );
});
