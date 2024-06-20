interface EnvVariables {
  VITE_APP_NAME: string;
  VITE_APP_DESCRIPTION: string;
}

interface ImportMetaEnv extends EnvVariables {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
