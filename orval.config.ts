import { defineConfig } from "orval";

export default defineConfig({
  "react-vite": {
    output: {
      tsconfig: "tsconfig.json",
      mode: "single",
      target: "./src/api/gen/api.ts",
      schemas: "./src/api/gen/model",
      client: "axios",
      clean: ["./src/api/gen"],
      override: {
        mutator: {
          path: "./src/api/HttpClient.ts",
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
