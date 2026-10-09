import { IMainApi } from "@shared/api";
import type { NodeDto } from "@shared/api/gen/main/model";
import { notifyApiError } from "@shared/lib/http";
import { INotificationService } from "@shared/lib/notifications";
import { useZodForm } from "@shared/ui";
import { useState } from "react";

import { nodeFormSchema, type TNodeFormValues } from "./validation";

interface UseNodeFormOptions {
  onSaved: (node: NodeDto) => void;
}

const EMPTY = { name: "", host: "", description: "" };

/** Создание и изменение узла: название, адрес, описание. */
export const useNodeFormVM = ({ onSaved }: UseNodeFormOptions) => {
  const api = IMainApi.useInstance();
  const toast = INotificationService.useInstance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NodeDto | null>(null);
  const form = useZodForm(nodeFormSchema, { defaultValues: EMPTY });

  const openCreate = () => {
    setEditing(null);
    form.reset(EMPTY);
    setOpen(true);
  };

  const openEdit = (node: NodeDto) => {
    setEditing(node);
    form.reset({
      name: node.name,
      host: node.host ?? "",
      description: node.description ?? "",
    });
    setOpen(true);
  };

  const submit = async (data: TNodeFormValues) => {
    const body = {
      name: data.name,
      host: data.host || null,
      description: data.description || null,
    };
    const res = editing
      ? await api.updateNode(editing.id, body)
      : await api.createNode(body);

    if (res.error) {
      notifyApiError(toast, res.error);

      return;
    }

    onSaved(res.data);
    toast.success(editing ? "Узел сохранён" : `Узел «${res.data.name}» создан`);
    setOpen(false);
  };

  return { open, setOpen, openCreate, openEdit, editing, form, submit };
};

export type NodeFormVM = ReturnType<typeof useNodeFormVM>;
