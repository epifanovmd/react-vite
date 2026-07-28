import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

import { boundariesConfig } from "./eslint.boundaries.mjs";
import { namingConfig } from "./eslint.naming.mjs";

/**
 * Сегменты Shared — self-import запрещён внутри своего же сегмента.
 * `lib` сюда сознательно не входит: в отличие от ui/api/config это не цельный
 * модуль, а плоская россыпь независимых тем (di, models, utils, theme, socket,
 * holders, ...) — им разрешено ссылаться друг на друга через алиас.
 */
const SHARED_SEGMENTS = ["ui", "api", "config"];

/** Слайсы entities/features/widgets/pages — self-import запрещён внутри своего же слайса. */
const SLICE_LAYERS = {
  entities: ["auth", "user"],
  features: ["sign-in", "sign-up", "forgot-password", "reset-password", "edit-profile"],
  widgets: ["app-layout", "auth-layout"],
  pages: ["sign-in", "sign-up", "forgot-password", "reset-password", "profile", "ui-kit-demo", "errors"],
};

const selfImportRestriction = (files, group, message) => ({
  files,
  rules: {
    "no-restricted-imports": ["error", { patterns: [{ group, message }] }],
  },
});

const sharedSelfImportRestrictions = SHARED_SEGMENTS.map(seg =>
  selfImportRestriction(
    [`src/shared/${seg}/**`],
    [`@shared/${seg}/*`, `@shared/${seg}`],
    `Внутри shared/${seg}/ используй относительные пути вместо @shared/${seg}/*`,
  ),
);

const sliceSelfImportRestrictions = Object.entries(SLICE_LAYERS).flatMap(
  ([layer, slices]) =>
    slices.map(slice =>
      selfImportRestriction(
        [`src/${layer}/${slice}/**`],
        [`@${layer}/${slice}/*`, `@${layer}/${slice}`],
        `Внутри ${layer}/${slice}/ используй относительные пути вместо @${layer}/${slice}/*`,
      ),
    ),
);

const moduleSelfImportRestrictions = [
  ...sharedSelfImportRestrictions,
  ...sliceSelfImportRestrictions,
];

export default tseslint.config(
  { ignores: ["dist", "src/shared/api/gen/**", "src/app/routeTree.gen.ts"] },
  {
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "simple-import-sort": simpleImportSort,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
    },
    rules: {
      // react-hooks: только базовые правила, без React Compiler
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": [
        "error",
        {
          additionalHooks: "(useMyCustomHook|useMyOtherCustomHook)",
        },
      ],

      // react-refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // simple-import-sort
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // react
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",

      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // typescript eslint
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",

      // Stylistic
      "no-redeclare": "off",
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: ["const", "let", "var"],
          next: "*",
        },
        {
          blankLine: "always",
          prev: "*",
          next: "return",
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
      ],
    },
  },
  ...moduleSelfImportRestrictions,
  boundariesConfig,
  namingConfig,
);
