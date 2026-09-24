import { Button, IconButton, InputFormField, useFieldArray } from "@shared/ui";
import { Plus, Trash2 } from "lucide-react";

import type { FieldArrayFormValues } from "./field-array-schema";

export const FieldArrayFields = () => {
  const contacts = useFieldArray<FieldArrayFormValues>({
    name: "contacts",
  });

  return (
    <div className="flex flex-col gap-3">
      {contacts.fields.map((contact, index) => (
        <div
          key={contact.id}
          className="grid grid-cols-[1fr_1fr_auto] items-start gap-2"
        >
          <InputFormField<FieldArrayFormValues>
            name={`contacts.${index}.label`}
            label="Тип"
            placeholder="Email"
          />
          <InputFormField<FieldArrayFormValues>
            name={`contacts.${index}.value`}
            label="Значение"
            placeholder="name@example.com"
          />
          <IconButton
            type="button"
            size="xs"
            variant="ghost"
            aria-label={`Удалить контакт ${index + 1}`}
            onClick={() => contacts.remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </IconButton>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        leftIcon={<Plus className="h-4 w-4" />}
        onClick={() => contacts.append({ label: "", value: "" })}
      >
        Добавить контакт
      </Button>
    </div>
  );
};
