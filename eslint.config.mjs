import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

/** Модули в корне src/, в которых запрещены self-imports через алиасы. */
const ROOT_MODULES = ["lib", "store", "api", "models", "components"];

/** Доменные модули в src/domains/, с теми же правилами. */
const DOMAIN_MODULES = ["auth", "user"];

const rootRestrictions = ROOT_MODULES.map(mod => ({
  files: [`src/${mod}/**`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [`@${mod}/*`, `@${mod}`],
            message: `Внутри ${mod}/ используй относительные пути вместо @${mod}/*`,
          },
        ],
      },
    ],
  },
}));

const domainRestrictions = DOMAIN_MODULES.map(mod => ({
  files: [`src/domains/${mod}/**`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [`@${mod}/*`, `@${mod}`],
            message: `Внутри domains/${mod}/ используй относительные пути вместо @${mod}/*`,
          },
        ],
      },
    ],
  },
}));

const moduleSelfImportRestrictions = [
  ...rootRestrictions,
  ...domainRestrictions,
];

export default tseslint.config(
  { ignores: ["dist", "src/api/api-gen/**"] },
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
);
