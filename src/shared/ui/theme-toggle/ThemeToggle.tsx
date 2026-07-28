import { IThemeStore } from "@shared/lib/theme";
import { Moon, Sun } from "lucide-react";
import { observer } from "mobx-react-lite";
import * as React from "react";

import { Button, ButtonProps } from "../button";

export const ThemeToggle = observer<ButtonProps>(props => {
  const { toggleTheme } = IThemeStore.useInstance();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative"
      {...props}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
