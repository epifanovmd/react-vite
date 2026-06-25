import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DatePicker,
  DateRange,
  DateRangePicker,
} from "@components/ui";
import { type FC, type ReactNode, useState } from "react";

const Row = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
    {children}
  </div>
);

const Field = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <p className="text-[10px] text-muted-foreground">{label}</p>
    {children}
  </div>
);

export const DatePickersSection: FC = () => {
  const [date, setDate] = useState<Date | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Date Pickers</CardTitle>
        <CardDescription className="text-xs">
          DatePicker и DateRangePicker
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* ── DatePicker ─────────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            DatePicker — выбор даты
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground mb-2">Размеры</p>
              <Row>
                <Field label="sm">
                  <DatePicker value={date} onChange={setDate} size="sm" placeholder="sm" />
                </Field>
                <Field label="md (default)">
                  <DatePicker value={date} onChange={setDate} size="md" placeholder="md" />
                </Field>
                <Field label="lg">
                  <DatePicker value={date} onChange={setDate} size="lg" placeholder="lg" />
                </Field>
              </Row>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2">Варианты</p>
              <Row>
                <Field label="default">
                  <DatePicker value={date} onChange={setDate} variant="default" placeholder="default" />
                </Field>
                <Field label="filled">
                  <DatePicker value={date} onChange={setDate} variant="filled" placeholder="filled" />
                </Field>
                <Field label="filled-error">
                  <DatePicker value={date} onChange={setDate} variant="filled-error" placeholder="filled error" />
                </Field>
                <Field label="filled-success">
                  <DatePicker value={date} onChange={setDate} variant="filled-success" placeholder="filled success" />
                </Field>
                <Field label="error">
                  <DatePicker value={date} onChange={setDate} variant="error" placeholder="error" />
                </Field>
                <Field label="success">
                  <DatePicker value={date} onChange={setDate} variant="success" placeholder="success" />
                </Field>
                <Field label="disabled">
                  <DatePicker value={date} onChange={setDate} disabled placeholder="disabled" />
                </Field>
                <Field label="clearable">
                  <DatePicker value={date} onChange={setDate} clearable placeholder="Выберите дату" />
                </Field>
              </Row>
            </div>
          </div>
        </div>

        <hr className="border-border" />

        {/* ── DateRangePicker ────────────────────────────────────── */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            DateRangePicker — диапазон дат
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground mb-2">Размеры</p>
              <Row>
                <Field label="sm">
                  <DateRangePicker value={dateRange} onChange={setDateRange} size="sm" placeholder="sm" />
                </Field>
                <Field label="md (default)">
                  <DateRangePicker value={dateRange} onChange={setDateRange} size="md" placeholder="md" />
                </Field>
                <Field label="lg">
                  <DateRangePicker value={dateRange} onChange={setDateRange} size="lg" placeholder="lg" />
                </Field>
              </Row>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2">Варианты</p>
              <Row>
                <Field label="default">
                  <DateRangePicker value={dateRange} onChange={setDateRange} placeholder="default" />
                </Field>
                <Field label="filled">
                  <DateRangePicker value={dateRange} onChange={setDateRange} variant="filled" placeholder="filled" />
                </Field>
                <Field label="filled-error">
                  <DateRangePicker value={dateRange} onChange={setDateRange} variant="filled-error" placeholder="filled error" />
                </Field>
                <Field label="filled-success">
                  <DateRangePicker value={dateRange} onChange={setDateRange} variant="filled-success" placeholder="filled success" />
                </Field>
                <Field label="error">
                  <DateRangePicker value={dateRange} onChange={setDateRange} variant="error" placeholder="error" />
                </Field>
                <Field label="success">
                  <DateRangePicker value={dateRange} onChange={setDateRange} variant="success" placeholder="success" />
                </Field>
                <Field label="clearable">
                  <DateRangePicker value={dateRange} onChange={setDateRange} clearable placeholder="Выберите период" />
                </Field>
              </Row>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
