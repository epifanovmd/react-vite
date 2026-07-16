import { Button, Segmented, type TableProps } from "@components/ui";
import { Maximize2, Minimize2, Pin, PinOff } from "lucide-react";
import { observer } from "mobx-react-lite";
import { type FC, useState } from "react";

import { ClientTab } from "./client";
import { ServerTab } from "./server";

type Density = "sm" | "md" | "lg";
type Variant = NonNullable<TableProps<any>["variant"]>;
type TabId = "server" | "client";

const DENSITY_OPTIONS = [
  { label: "S", value: "sm" },
  { label: "M", value: "md" },
  { label: "L", value: "lg" },
];

const VARIANT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Striped", value: "striped" },
  { label: "Border", value: "bordered" },
];

const TABS = [
  { label: "Server-side", value: "server" },
  { label: "Client-side", value: "client" },
];

const TablePage: FC = observer(() => {
  const [tab, setTab] = useState<TabId>("server");
  const [density, setDensity] = useState<Density>("md");
  const [variant, setVariant] = useState<Variant>("default");
  const [sticky, setSticky] = useState(true);
  const [resizeOn, setResizeOn] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 md:p-6 max-h-full h-full">
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Segmented
          size="sm"
          options={TABS}
          value={tab}
          onChange={v => setTab(v as TabId)}
        />

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Segmented
            size="sm"
            options={DENSITY_OPTIONS}
            value={density}
            onChange={v => setDensity(v as Density)}
          />
          <Segmented
            size="sm"
            options={VARIANT_OPTIONS}
            value={variant}
            onChange={v => setVariant(v as Variant)}
          />

          <Button
            variant={sticky ? "secondary" : "outline"}
            size="sm"
            aria-pressed={sticky}
            onClick={() => setSticky(prev => !prev)}
            leftIcon={
              sticky ? (
                <Pin className="h-4 w-4" />
              ) : (
                <PinOff className="h-4 w-4" />
              )
            }
          >
            Sticky
          </Button>

          {tab === "client" && (
            <Button
              variant={resizeOn ? "secondary" : "outline"}
              size="sm"
              aria-pressed={resizeOn}
              onClick={() => setResizeOn(prev => !prev)}
              leftIcon={
                resizeOn ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )
              }
            >
              Resize
            </Button>
          )}
        </div>
      </div>

      {tab === "server" && (
        <ServerTab density={density} variant={variant} sticky={sticky} />
      )}
      {tab === "client" && (
        <ClientTab
          density={density}
          variant={variant}
          sticky={sticky}
          resizable={resizeOn}
        />
      )}
    </div>
  );
});

export { TablePage };
