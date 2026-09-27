import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["./src/**/*.{spec,test}.{ts,tsx}"],
      globals: true,
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
      restoreMocks: true,
      coverage: {
        provider: "v8",
        include: ["src/shared/lib/holders/**/*.{ts,tsx}"],
        exclude: [
          "src/shared/lib/holders/**/index.ts",
          "src/shared/lib/holders/**/*.types.ts",
          "src/shared/lib/holders/**/__tests__/**",
        ],
        thresholds: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  }),
);
