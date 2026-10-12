import type { TAgentInstallMode } from "@entities/agent";
import { z } from "zod";

const urlField = z
  .url("Полный адрес, например https://api.example.com")
  .or(z.literal(""));

/** Как войти по SSH: паролем или ключом. */
export const SSH_AUTH_OPTIONS = [
  { value: "password", label: "Пароль" },
  { value: "key", label: "Ключ" },
] as const;

/** Способ установки командой: служба, без root или без установки. */
const modeField = z.enum([
  "systemd",
  "rootless",
  "run",
] satisfies TAgentInstallMode[]);

/** Способ установки по SSH: без установки агент занял бы сеанс SSH. */
const sshModeField = z.enum([
  "systemd",
  "rootless",
] satisfies TAgentInstallMode[]);

/** Способ для запроса: служба — по умолчанию (не передаётся). */
export const installModeBody = <M extends TAgentInstallMode>(data: {
  mode: M;
}) => ({
  mode:
    data.mode === "systemd" ? undefined : (data.mode as Exclude<M, "systemd">),
});

/** Команда установки: срок токена, адрес сервера, способ установки. */
export const installCommandSchema = z.object({
  expiresInMinutes: z
    .number("Укажите срок.")
    .int()
    .min(5, "Не меньше 5 минут.")
    .max(43_200, "Не больше 30 дней."),
  baseUrl: urlField,
  mode: modeField,
});

export type TInstallCommandForm = z.input<typeof installCommandSchema>;
export type TInstallCommandValues = z.output<typeof installCommandSchema>;

/** Вход по SSH и параметры установки или удаления. */
export const sshSchema = z
  .object({
    host: z.string().trim().max(255),
    port: z.number("Укажите порт.").int().min(1).max(65_535),
    username: z.string().trim().min(1, "Укажите пользователя.").max(64),
    auth: z.enum(["password", "key"]),
    password: z.string(),
    privateKey: z.string().trim(),
    passphrase: z.string(),
    sudo: z.boolean(),
    backendUrl: urlField,
    purge: z.boolean(),
    mode: sshModeField,
  })
  .superRefine((data, ctx) => {
    if (data.mode === "rootless" && data.username === "root") {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: "Агент без root ставится от обычного пользователя, не root.",
      });
    }
    if (data.auth === "password" && !data.password) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Введите пароль.",
      });
    }
    if (data.auth === "key" && !data.privateKey) {
      ctx.addIssue({
        code: "custom",
        path: ["privateKey"],
        message: "Вставьте приватный ключ.",
      });
    }
  });

export type TSshForm = z.input<typeof sshSchema>;
export type TSshValues = z.output<typeof sshSchema>;

/** Тело запроса по SSH: пустые поля не отправляются — сервер берёт свои. */
export const sshBody = (data: TSshValues) => ({
  host: data.host || undefined,
  port: data.port,
  username: data.username,
  ...(data.auth === "password"
    ? { password: data.password }
    : {
        privateKey: data.privateKey,
        passphrase: data.passphrase || undefined,
      }),
  // root и агент без root — без sudo; для остальных — как выбрано.
  sudo:
    data.username === "root"
      ? undefined
      : data.mode === "rootless"
        ? false
        : data.sudo,
  backendUrl: data.backendUrl || undefined,
  ...installModeBody(data),
});
