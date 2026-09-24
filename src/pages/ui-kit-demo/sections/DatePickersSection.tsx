import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DatePicker,
  DateRange,
  DateRangePicker,
} from "@shared/ui";
import { type FC, useState } from "react";

import { DemoField, DemoRow } from "./shared";

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
              <DemoRow>
                <DemoField label="sm">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    size="sm"
                    placeholder="sm"
                  />
                </DemoField>
                <DemoField label="md (default)">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    size="md"
                    placeholder="md"
                  />
                </DemoField>
                <DemoField label="lg">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    size="lg"
                    placeholder="lg"
                  />
                </DemoField>
              </DemoRow>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2">Варианты</p>
              <DemoRow>
                <DemoField label="default">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    variant="default"
                    placeholder="default"
                  />
                </DemoField>
                <DemoField label="filled">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    variant="filled"
                    placeholder="filled"
                  />
                </DemoField>
                <DemoField label="filled-error">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    variant="filled-error"
                    placeholder="filled error"
                  />
                </DemoField>
                <DemoField label="filled-success">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    variant="filled-success"
                    placeholder="filled success"
                  />
                </DemoField>
                <DemoField label="error">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    variant="error"
                    placeholder="error"
                  />
                </DemoField>
                <DemoField label="success">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    variant="success"
                    placeholder="success"
                  />
                </DemoField>
                <DemoField label="disabled">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    disabled
                    placeholder="disabled"
                  />
                </DemoField>
                <DemoField label="clearable">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    clearable
                    placeholder="Выберите дату"
                  />
                </DemoField>
                <DemoField label="disableDate (выходные)">
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    disableDate={d => d.getDay() === 0 || d.getDay() === 6}
                    placeholder="Только будни"
                  />
                </DemoField>
              </DemoRow>
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
              <DemoRow>
                <DemoField label="sm">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    size="sm"
                    placeholder="sm"
                  />
                </DemoField>
                <DemoField label="md (default)">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    size="md"
                    placeholder="md"
                  />
                </DemoField>
                <DemoField label="lg">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    size="lg"
                    placeholder="lg"
                  />
                </DemoField>
              </DemoRow>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-2">Варианты</p>
              <DemoRow>
                <DemoField label="default">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="default"
                  />
                </DemoField>
                <DemoField label="filled">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    variant="filled"
                    placeholder="filled"
                  />
                </DemoField>
                <DemoField label="filled-error">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    variant="filled-error"
                    placeholder="filled error"
                  />
                </DemoField>
                <DemoField label="filled-success">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    variant="filled-success"
                    placeholder="filled success"
                  />
                </DemoField>
                <DemoField label="error">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    variant="error"
                    placeholder="error"
                  />
                </DemoField>
                <DemoField label="success">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    variant="success"
                    placeholder="success"
                  />
                </DemoField>
                <DemoField label="clearable">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    clearable
                    placeholder="Выберите период"
                  />
                </DemoField>
              </DemoRow>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
