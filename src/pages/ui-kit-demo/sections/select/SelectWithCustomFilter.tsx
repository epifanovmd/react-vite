import { Select, useStaticOptions } from "@shared/ui";
import { type FC, useState } from "react";

const LANGUAGES = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "he", name: "Hebrew", dir: "rtl" },
  { code: "ar", name: "Arabic", dir: "rtl" },
  { code: "ja", name: "Japanese", dir: "ltr" },
  { code: "ru", name: "Russian", dir: "ltr" },
];

const LANG_OPTIONS = LANGUAGES.map(l => ({
  value: l.code,
  label: `${l.name} (${l.code}) — ${l.dir}`,
}));

export const SelectWithCustomFilter: FC = () => {
  const [value, setValue] = useState<string>();
  const filtered = useStaticOptions(LANG_OPTIONS, {
    search: true,
    filterOption: (query, opt) => {
      const q = query.toLowerCase();
      const item = LANGUAGES.find(l => l.code === opt.value);

      return (
        !item ||
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.dir.toLowerCase().includes(q)
      );
    },
  });

  return (
    <Select
      {...filtered}
      value={value}
      onChange={setValue}
      placeholder="Поиск по name / code / dir"
    />
  );
};
