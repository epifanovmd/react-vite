import {
  Button,
  Form,
  InputFormField,
  Modal,
  ModalContent,
  TextareaFormField,
} from "@shared/ui";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { NodeFormVM } from "../model/useNodeFormVM";
import type { TNodeForm } from "../model/validation";

interface NodeFormModalProps {
  vm: NodeFormVM;
}

const FORM_ID = "node-form";

/** Окно создания и изменения узла; открывается методами VM. */
export const NodeFormModal: FC<NodeFormModalProps> = observer(({ vm }) => (
  <Modal open={vm.open} onOpenChange={vm.setOpen}>
    <ModalContent
      size="md"
      title={vm.editing ? "Изменение узла" : "Новый узел"}
      description="Машина, на которой работает агент"
      footer={
        <>
          <Button variant="outline" onClick={() => vm.setOpen(false)}>
            Отмена
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            loading={vm.form.formState.isSubmitting}
          >
            {vm.editing ? "Сохранить" : "Создать"}
          </Button>
        </>
      }
    >
      <Form
        id={FORM_ID}
        form={vm.form}
        onSubmit={vm.submit}
        className="flex flex-col gap-4"
      >
        <InputFormField<TNodeForm>
          name="name"
          label="Название"
          placeholder="node-01"
        />
        <InputFormField<TNodeForm>
          name="host"
          label="Адрес"
          placeholder="203.0.113.10 или node.example.com"
          description="Публичный адрес: для входа по SSH и проверки связи между узлами"
        />
        <TextareaFormField<TNodeForm>
          name="description"
          label="Описание"
          rows={2}
        />
      </Form>
    </ModalContent>
  </Modal>
));
