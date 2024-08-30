interface EnvVariables {
  VITE_DEV_PROTOCOL: string;
  VITE_DEV_HOST: string;
  VITE_DEV_PORT: string;
  VITE_BASE_URL: string;
  VITE_APP_NAME: string;
}

type ImportMetaEnv = EnvVariables

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
