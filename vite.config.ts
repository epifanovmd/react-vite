import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";
import { defineConfig } from "vite";
import { cjsInterop } from "vite-plugin-cjs-interop";

const projectRootDir = path.resolve(__dirname);

dotenv.config({ path: [`.env.${process.env.NODE_ENV}`, ".env"] });

const { VITE_HOST, VITE_PORT, VITE_BASE_URL } = process.env;

const HOST = VITE_HOST;
const PORT = VITE_PORT ? Number(VITE_PORT) : 3000;

export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: "./src/app/routes",
      generatedRouteTree: "./src/app/routeTree.gen.ts",
    }),
    react(),
    mdx(),
    cjsInterop({
      // List of CJS dependencies that require interop
      dependencies: ["lodash", "inversify-inject-decorators"],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(projectRootDir, "src/app"),
      "@pages": path.resolve(projectRootDir, "src/pages"),
      "@widgets": path.resolve(projectRootDir, "src/widgets"),
      "@features": path.resolve(projectRootDir, "src/features"),
      "@entities": path.resolve(projectRootDir, "src/entities"),
      "@shared": path.resolve(projectRootDir, "src/shared"),
    },
  },
  server: {
    host: HOST,
    port: PORT,
    watch: {
      ignored: ["**/src/app/routeTree.gen.ts"],
    },
    proxy: {
      "/api": {
        target: VITE_BASE_URL,
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: [],
    host: HOST,
    port: PORT,
  },
});
