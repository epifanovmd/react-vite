import { Input, Segmented } from "@shared/ui";
import { Search } from "lucide-react";
import { observer } from "mobx-react-lite";
import { FC } from "react";

import type { NodesVM } from "../model/useNodesVM";

interface NodesToolbarProps {
  vm: NodesVM;
}

const SEARCH_ICON = <Search size={15} />;

const SCOPE_OPTIONS = [
  { value: "all", label: "Все" },
  { value: "mine", label: "Мои" },
] as const;

/** Поиск по узлам и фильтр «Мои». */
export const NodesToolbar: FC<NodesToolbarProps> = observer(({ vm }) => (
  <div className="flex flex-wrap items-center gap-2">
    <div className="w-full sm:w-72">
      <Input
        size="sm"
        type="search"
        value={vm.filter.query}
        onChange={event => vm.setQuery(event.target.value)}
        onClear={() => vm.setQuery("")}
        clearable
        leftIcon={SEARCH_ICON}
        placeholder="Название, адрес или описание"
        aria-label="Поиск узлов"
      />
    </div>
    <Segmented
      size="sm"
      aria-label="Какие узлы"
      value={vm.filter.mine ? "mine" : "all"}
      onValueChange={value => vm.setMine(value === "mine")}
      options={[...SCOPE_OPTIONS]}
    />
  </div>
));
