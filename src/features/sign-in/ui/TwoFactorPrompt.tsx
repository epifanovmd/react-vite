import { AsyncButton, Input, LabeledField } from "@shared/ui";
import { FC, useId } from "react";

import { TwoFactorPromptProps } from "./two-factor-prompt.types";

/** Блок подтверждения второго фактора при входе: свой пароль и кнопка. */
export const TwoFactorPrompt: FC<TwoFactorPromptProps> = ({
  hint,
  password,
  onPasswordChange,
  onVerify,
}) => {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-brand/20 bg-brand/5 p-4">
      <p className="text-sm text-foreground">
        Требуется подтверждение второго фактора.{hint ? ` ${hint}` : ""}
      </p>
      <LabeledField label="Пароль второго фактора" htmlFor={inputId}>
        <Input
          id={inputId}
          type="password"
          autoComplete="off"
          placeholder="••••••••"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
        />
      </LabeledField>
      <AsyncButton
        type="button"
        className="w-full"
        disabled={!password}
        onClick={() => onVerify()}
      >
        Подтвердить вход
      </AsyncButton>
    </div>
  );
};
