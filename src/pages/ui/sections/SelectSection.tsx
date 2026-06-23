import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  GroupedSelect,
  Select,
} from "@components/ui";
import { FC, useState } from "react";

const fetchCountries = (): Promise<string[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve([
        "Russia",
        "USA",
        "China",
        "Germany",
        "France",
        "Japan",
        "UK",
        "Italy",
        "Canada",
        "Spain",
      ]);
    }, 1500);
  });

const fetchCities = (): Promise<string[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve([
        "Moscow",
        "New York",
        "London",
        "Paris",
        "Tokyo",
        "Berlin",
        "Rome",
        "Toronto",
        "Madrid",
        "Beijing",
      ]);
    }, 2000);
  });

export const SelectSection: FC = () => {
  const [selectValue, setSelectValue] = useState("");
  const [lazyOptions, setLazyOptions] = useState<string[]>([]);
  const [, setIsLoadingLazy] = useState(false);
  const [hasLoadedLazy, setHasLoadedLazy] = useState(false);

  const handleLazyOpen = (open: boolean) => {
    if (open && !hasLoadedLazy) {
      setIsLoadingLazy(true);
      setTimeout(() => {
        setLazyOptions(["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"]);
        setIsLoadingLazy(false);
        setHasLoadedLazy(true);
      }, 2000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Select</CardTitle>
        <CardDescription className="text-xs">
          Выпадающие списки — варианты, clearable, async
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* Variants */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Варианты</p>
          <div className="grid grid-cols-2 gap-2">
            <Select
              options={[
                { value: "option1", label: "Option 1" },
                { value: "option2", label: "Option 2" },
                { value: "option3", label: "Option 3" },
              ]}
              placeholder="default"
              size="sm"
              value={selectValue}
              clearable
              onChange={(v: string | null) => setSelectValue(v ?? "")}
            />
            <Select
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
              ]}
              placeholder="filled"
              size="sm"
              variant="filled"
            />
            <Select
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
              ]}
              placeholder="filled error"
              size="sm"
              variant="filled-error"
            />
            <Select
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
              ]}
              placeholder="filled success"
              size="sm"
              variant="filled-success"
            />
            <Select
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
              ]}
              placeholder="error state"
              size="sm"
              variant="error"
            />
            <Select
              options={[
                { value: "a", label: "Option A" },
                { value: "b", label: "Option B" },
              ]}
              placeholder="success state"
              size="sm"
              variant="success"
            />
          </div>
        </div>

        {/* Grouped + Async */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Grouped и Async</p>
          <div className="grid grid-cols-2 gap-2">
            <GroupedSelect
              groups={[
                {
                  group: "Fruits",
                  options: [
                    { value: "apple", label: "Apple" },
                    { value: "banana", label: "Banana" },
                  ],
                },
                {
                  group: "Vegetables",
                  options: [
                    { value: "carrot", label: "Carrot" },
                    { value: "broccoli", label: "Broccoli" },
                  ],
                },
              ]}
              placeholder="Grouped"
              size="sm"
            />

            <Select
              fetchOptions={fetchCountries}
              getOption={c => ({ value: c, label: c })}
              placeholder="Async (lazy)"
              size="sm"
            />
          </div>
        </div>

        {/* Manual mode */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Manual mode</p>
          <div className="grid grid-cols-2 gap-2">
            <Select
              fetchOptions={fetchCities}
              getOption={c => ({ value: c, label: c })}
              placeholder="Async (on mount)"
              size="sm"
              fetchOnMount
            />
            <Select
              options={lazyOptions.map(o => ({ value: o, label: o }))}
              placeholder="Manual mode"
              size="sm"
              onOpenChange={handleLazyOpen}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
