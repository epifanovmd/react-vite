import {
  Button,
  Collapse,
  Form,
  InputFormField,
  NumberInputFormField,
  PLAIN_NUMBER_FORMAT,
  SegmentedFormField,
  SelectFormField,
  TextareaFormField,
} from "@shared/ui";
import { Send, Square } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { useWatch } from "react-hook-form";

import type { WorkerFetchVM } from "../model/useWorkerFetchVM";
import {
  BODY_MODES,
  FETCH_METHODS,
  type TWorkerFetchForm,
} from "../model/validation";
import { WorkerRoutePicker } from "./WorkerRoutePicker";

interface WorkerFetchFormProps {
  vm: WorkerFetchVM;
}

const METHOD_OPTIONS = FETCH_METHODS.map(method => ({
  value: method,
  label: method,
}));

/** Запрос к воркеру: воркер, маршрут из манифеста, подстановки, тело. */
export const WorkerFetchForm: FC<WorkerFetchFormProps> = observer(({ vm }) => {
  const bodyMode = useWatch({ control: vm.form.control, name: "bodyMode" });

  return (
    <Form form={vm.form} onSubmit={vm.submit} className="flex flex-col gap-4">
      <SelectFormField<TWorkerFetchForm>
        name="worker"
        label="Воркер"
        options={vm.workers.map(worker => ({
          value: worker.name,
          label: worker.name,
        }))}
      />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium">Маршруты воркера</p>
        <WorkerRoutePicker routes={vm.routes} onPick={vm.pickRoute} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[9rem_minmax(0,1fr)]">
        <SelectFormField<TWorkerFetchForm>
          name="method"
          label="Метод"
          options={METHOD_OPTIONS}
        />
        <InputFormField<TWorkerFetchForm>
          name="path"
          label="Путь"
          placeholder="/items/{id}?limit=10"
          className="font-mono"
        />
      </div>
      {vm.params.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vm.params.map(name => (
            <InputFormField<TWorkerFetchForm>
              key={name}
              name={`params.${name}`}
              label={`{${name}}`}
            />
          ))}
        </div>
      )}
      <SegmentedFormField<TWorkerFetchForm>
        name="bodyMode"
        label="Тело"
        options={[...BODY_MODES]}
      />
      {bodyMode !== "none" && (
        <TextareaFormField<TWorkerFetchForm>
          name="body"
          rows={6}
          className="font-mono text-xs"
          placeholder={bodyMode === "json" ? '{ "text": "привет" }' : ""}
        />
      )}
      <Collapse size="sm">
        <Collapse.Trigger>Заголовки и срок</Collapse.Trigger>
        <Collapse.Content innerClassName="flex flex-col gap-4 pt-2">
          <TextareaFormField<TWorkerFetchForm>
            name="headers"
            label="Заголовки"
            description="По одному на строку: Имя: значение"
            rows={3}
            className="font-mono text-xs"
            placeholder="accept: application/json"
          />
          <NumberInputFormField<TWorkerFetchForm>
            name="timeoutSec"
            label="Ждать ответа, с"
            description="По умолчанию — 30 с, не больше 600"
            formatOptions={PLAIN_NUMBER_FORMAT}
            min={1}
            max={600}
          />
        </Collapse.Content>
      </Collapse>
      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          leftIcon={<Send size={15} />}
          loading={vm.session.isRunning}
          disabled={vm.workers.length === 0}
        >
          Отправить
        </Button>
        {vm.session.isRunning && (
          <Button
            variant="outline"
            leftIcon={<Square size={15} />}
            onClick={vm.cancel}
          >
            Прервать
          </Button>
        )}
      </div>
    </Form>
  );
});
