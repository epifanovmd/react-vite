import { defineConfig } from "orval";

export default defineConfig({
  "react-vite": {
    output: {
      tsconfig: "tsconfig.json",
      mode: "single",
      target: "./src/shared/api/gen/api.ts",
      schemas: "./src/shared/api/gen/model",
      client: "axios",
      clean: ["./src/shared/api/gen"],
      override: {
        mutator: {
          path: "./src/shared/api/http-client.ts",
          name: "axiosInstance",
        },
        header: false,
      },
    },
    input: {
      target: "http://147.45.245.104:8181/api-docs/swagger.json",
    },
    hooks: {
      afterAllFilesWrite: [
        "prettier --parser typescript --write",
        "eslint --fix",
      ],
    },
  },
});
