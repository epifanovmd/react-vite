import { type ISelectRef, Select } from "@shared/ui";
import { type FC, useRef, useState } from "react";

import { DemoCard, DemoField } from "../shared";
import { MANY_TAGS } from "./select-demo-data";

export const RefApi: FC = () => {
  const ref = useRef<ISelectRef>(null);
  const [refValue, setRefValue] = useState<string>();
  const [scrollIdx, setScrollIdx] = useState(0);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  return (
    <DemoCard
      title="Ref API"
      description="focus, blur, scrollTo, nativeElement"
    >
      <div className="flex flex-col gap-3">
        <DemoField label="Select с search, чтобы видеть открытие/закрытие">
          <Select
            ref={ref}
            options={MANY_TAGS}
            value={refValue}
            onChange={setRefValue}
            placeholder="Используйте кнопки ниже"
            search
            onFocus={() => setFocusedId("focus")}
            onBlur={() => setFocusedId("blur")}
          />
        </DemoField>
        <p className="text-[10px] text-muted-foreground -mt-2">
          {focusedId === "focus"
            ? "🟢 focus"
            : focusedId === "blur"
              ? "🔴 blur"
              : "⚪ idle"}
          {selectedTag && ` | scrollTo: index ${selectedTag}`}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() => ref.current?.focus()}
          >
            focus()
          </button>
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() => ref.current?.blur()}
          >
            blur()
          </button>
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() => {
              ref.current?.focus();
              setTimeout(() => {
                ref.current?.scrollTo(scrollIdx);
                setSelectedTag(`Tag ${scrollIdx + 1}`);
              }, 100);
            }}
          >
            scrollTo({scrollIdx})
          </button>
          <input
            className="w-16 rounded-md border px-2 py-1 text-xs"
            type="number"
            min={0}
            max={MANY_TAGS.length - 1}
            value={scrollIdx}
            onChange={e => setScrollIdx(Number(e.target.value))}
          />
          <button
            className="rounded-md border px-3 py-1 text-xs hover:bg-accent"
            onClick={() =>
              console.log("nativeElement:", ref.current?.nativeElement)
            }
          >
            nativeElement (console)
          </button>
        </div>
      </div>
    </DemoCard>
  );
};
