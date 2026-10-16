export interface TwoFactorPromptProps {
  hint?: string;
  /** Пароль второго фактора. */
  password: string;
  onPasswordChange: (password: string) => void;
  onVerify: () => void | Promise<void>;
}
