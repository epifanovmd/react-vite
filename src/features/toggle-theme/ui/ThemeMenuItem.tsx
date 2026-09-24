import { IThemeStore } from "@shared/lib/theme";
import { DropdownMenuCheckboxItem } from "@shared/ui";
import { observer } from "mobx-react-lite";

/** Меню остаётся открытым: пользователь видит результат переключения. */
const keepMenuOpen = (event: Event) => event.preventDefault();

/** Пункт выпадающего меню «Тёмная тема», подключённый к `IThemeStore`. */
export const ThemeMenuItem = observer(() => {
  const { isDark, toggleTheme } = IThemeStore.useInstance();

  return (
    <DropdownMenuCheckboxItem
      checked={isDark}
      onCheckedChange={toggleTheme}
      onSelect={keepMenuOpen}
    >
      Тёмная тема
    </DropdownMenuCheckboxItem>
  );
});
