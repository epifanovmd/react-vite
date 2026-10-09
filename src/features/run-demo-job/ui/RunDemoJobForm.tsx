import {
  Button,
  Form,
  InputFormField,
  NumberInputFormField,
  PLAIN_NUMBER_FORMAT,
  SegmentedFormField,
  SwitchFormField,
  useFormValue,
} from "@shared/ui";
import { Play } from "lucide-react";
import { FC } from "react";

import {
  DEMO_JOB_KIND_OPTIONS,
  TDemoJobForm,
  useRunDemoJobVM,
} from "../model/useRunDemoJobVM";

const KIND_HINT = {
  quick: "Итог — сразу в ответе воркера, без хода",
  long: "Шаги с ходом в реальном времени; задачу можно отменить",
};

/** Параметры долгой задачи `echo.long`. */
const LongJobFields: FC = () => {
  const kind = useFormValue<TDemoJobForm, "kind">("kind");

  if (kind !== "long") return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberInputFormField<TDemoJobForm>
          name="steps"
          label="Шагов"
          description="Ход — на каждом шаге"
          formatOptions={PLAIN_NUMBER_FORMAT}
          min={1}
          max={100}
        />
        <NumberInputFormField<TDemoJobForm>
          name="delayMs"
          label="Пауза шага, мс"
          formatOptions={PLAIN_NUMBER_FORMAT}
          min={0}
          max={60_000}
        />
      </div>
      <SwitchFormField<TDemoJobForm>
        name="fail"
        label="Провалиться после шагов"
      />
      <SwitchFormField<TDemoJobForm>
        name="withOutput"
        label="Записать итог в файл"
      />
    </>
  );
};

const KindHint: FC = () => {
  const kind = useFormValue<TDemoJobForm, "kind">("kind");

  return (
    <p className="-mt-2 text-xs text-muted-foreground">{KIND_HINT[kind]}</p>
  );
};

/** Форма демо-задачи воркеру `echo`: тип задачи и её параметры. */
export const RunDemoJobForm: FC = () => {
  const { form, submit } = useRunDemoJobVM();

  return (
    <Form form={form} onSubmit={submit} className="flex flex-col gap-4">
      <SegmentedFormField<TDemoJobForm>
        name="kind"
        label="Тип задачи"
        options={DEMO_JOB_KIND_OPTIONS}
      />
      <KindHint />
      <InputFormField<TDemoJobForm> name="text" label="Текст для воркера" />
      <LongJobFields />
      <Button
        type="submit"
        className="self-start"
        leftIcon={<Play size={15} />}
        loading={form.formState.isSubmitting}
      >
        Запустить
      </Button>
    </Form>
  );
};
