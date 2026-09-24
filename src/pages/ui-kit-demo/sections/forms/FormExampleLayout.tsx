import type { ReactNode } from "react";
import { useFormContext, useFormState, useWatch } from "react-hook-form";

export interface FormExampleLayoutProps {
  children: ReactNode;
  submittedValues?: unknown;
}

const toJson = (value: unknown): string =>
  JSON.stringify(
    value,
    (key, nestedValue: unknown) => (key === "ref" ? undefined : nestedValue),
    2,
  ) ?? "undefined";

/** Двухколоночный демо-макет: форма и живые значения/состояние React Hook Form. */
export const FormExampleLayout = ({
  children,
  submittedValues,
}: FormExampleLayoutProps) => {
  const { control } = useFormContext();
  const values = useWatch({ control });
  const {
    dirtyFields,
    errors,
    isDirty,
    isSubmitted,
    isSubmitting,
    isValid,
    submitCount,
    touchedFields,
  } = useFormState({ control });

  const formState = {
    isDirty,
    isValid,
    isSubmitting,
    isSubmitted,
    submitCount,
    dirtyFields,
    touchedFields,
    errors,
  };

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
      <div className="flex min-w-0 flex-col gap-4">{children}</div>

      <aside className="min-w-0 space-y-4 border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
        <section className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Текущие значения
          </h4>
          <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {toJson(values)}
          </pre>
        </section>

        {submittedValues !== undefined && (
          <section className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              Последний submit
            </h4>
            <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-3 text-xs">
              {toJson(submittedValues)}
            </pre>
          </section>
        )}

        <section className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">
            Состояние формы
          </h4>
          <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {toJson(formState)}
          </pre>
        </section>
      </aside>
    </div>
  );
};
