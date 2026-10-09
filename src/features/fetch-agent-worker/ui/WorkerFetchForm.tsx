import { SchemaHint } from "@entities/agent";
import {
  Alert,
  Badge,
  Button,
  Collapse,
  Form,
  InputFormField,
  NumberInputFormField,
  PLAIN_NUMBER_FORMAT,
  Segmented,
  SelectFormField,
  TextareaFormField,
} from "@shared/ui";
import { Send, Square } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { WorkerFetchVM } from "../model/useWorkerFetchVM";
import {
  BODY_MODES,
  type TBodyMode,
  type TWorkerFetchForm,
} from "../model/validation";
import { WorkerBodyFields } from "./WorkerBodyFields";
import { WorkerRoutePicker } from "./WorkerRoutePicker";

interface WorkerFetchFormProps {
  vm: WorkerFetchVM;
}

/**
 * Запрос к воркеру: воркер, маршрут из его манифеста (других агент не
 * пропустит), подстановки и параметры, тело — формой по схеме маршрута или
 * JSON; подсказка по ответу.
 */
export const WorkerFetchForm: FC<WorkerFetchFormProps> = observer(({ vm }) => {
  const { route, fields, bodyMode } = vm;
  const routeError = vm.form.formState.errors.route?.message;

  return (
    <Form form={vm.form} onSubmit={vm.submit} className="flex flex-col gap-4">
      <SelectFormField<TWorkerFetchForm>
        name="worker"
        label="Воркер"
        clearable={false}
        options={vm.workers.map(worker => ({
          value: worker.name,
          label: worker.name,
        }))}
      />
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium">Маршрут</p>
        {vm.routes.length === 0 ? (
          <Alert variant="warning" title="Маршрутов нет">
            Воркер не объявил маршрутов в манифесте — агент не пропустит к нему
            запросы.
          </Alert>
        ) : (
          <WorkerRoutePicker
            routes={vm.routes}
            value={route?.key ?? ""}
            onPick={vm.pickRoute}
          />
        )}
        {routeError && <p className="text-xs text-destructive">{routeError}</p>}
      </div>
      {route && (
        <>
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="primary" className="font-mono">
              {route.method}
            </Badge>
            <span className="font-mono">{route.path}</span>
          </p>
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
          <InputFormField<TWorkerFetchForm>
            name="query"
            label="Параметры после «?»"
            placeholder="n=3&full=1"
            className="font-mono"
          />
          {vm.bodyModes.length > 1 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium">Тело</p>
              <Segmented<TBodyMode>
                aria-label="Тело"
                value={bodyMode}
                onValueChange={vm.setBodyMode}
                options={BODY_MODES.filter(mode =>
                  vm.bodyModes.includes(mode.value),
                ).map(mode => ({ value: mode.value, label: mode.label }))}
              />
            </div>
          )}
          {bodyMode === "form" && fields && (
            <WorkerBodyFields fields={fields} />
          )}
          {(bodyMode === "json" || bodyMode === "text") && (
            <TextareaFormField<TWorkerFetchForm>
              name="body"
              label={vm.bodyModes.length > 1 ? undefined : "Тело (JSON)"}
              rows={6}
              className="font-mono text-xs"
              placeholder={bodyMode === "json" ? '{ "text": "привет" }' : ""}
            />
          )}
          {route.request && (
            <Collapse size="sm">
              <Collapse.Trigger>Схема тела</Collapse.Trigger>
              <Collapse.Content>
                <SchemaHint schema={route.request} label="тело запроса" />
              </Collapse.Content>
            </Collapse>
          )}
          {route.response && (
            <SchemaHint schema={route.response} label="ответ" />
          )}
        </>
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
          disabled={vm.routes.length === 0}
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
