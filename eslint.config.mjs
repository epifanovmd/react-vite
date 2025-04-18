import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

import eslint from "@eslint/js";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config(
  { ignores: ["dist"] },
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
      ...reactHooks.configs.recommended.rules,
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

      // react-hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": [
        "error",
        {
          additionalHooks: "(useMyCustomHook|useMyOtherCustomHook)",
        },
      ],
      //
      // // Stylistic
      // "no-redeclare": "off",
      // semi: "error",
      // "array-bracket-newline": ["error", "consistent"],
      // "array-bracket-spacing": ["error", "never"],
      // "array-element-newline": ["error", "consistent"],
      // "object-property-newline": [
      //   "error",
      //   { allowAllPropertiesOnSameLine: true },
      // ],
      // "block-spacing": "error",
      // "comma-dangle": [
      //   "error",
      //   {
      //     arrays: "always-multiline",
      //     objects: "always-multiline",
      //     imports: "always-multiline",
      //     exports: "always-multiline",
      //     functions: "always-multiline",
      //   },
      // ],
      // "comma-spacing": [
      //   "error",
      //   {
      //     before: false,
      //     after: true,
      //   },
      // ],
      // "eol-last": ["error"],
      // "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      // "function-call-argument-newline": ["error", "consistent"],
      // "jsx-quotes": "error",
      // "key-spacing": "error",
      // "keyword-spacing": [
      //   "error",
      //   {
      //     after: true,
      //     before: true,
      //   },
      // ],
      // "new-parens": "error",
      // "no-array-constructor": "error",
      // "no-bitwise": "error",
      // "no-lonely-if": "error",
      // "no-multi-assign": "error",
      // "no-multiple-empty-lines": "error",
      // "no-plusplus": "error",
      // "no-trailing-spaces": "error",
      // "no-unneeded-ternary": "error",
      // "no-whitespace-before-property": "error",
      // "object-curly-newline": ["error"],
      // "object-curly-spacing": ["error", "always"],
      // "operator-assignment": ["error", "always"],
      // "operator-linebreak": ["error"],
      // "padding-line-between-statements": [
      //   "error",
      //   {
      //     blankLine: "always",
      //     prev: ["const", "let", "var"],
      //     next: "*",
      //   },
      //   {
      //     blankLine: "always",
      //     prev: "*",
      //     next: "return",
      //   },
      //   {
      //     blankLine: "any",
      //     prev: ["const", "let", "var"],
      //     next: ["const", "let", "var"],
      //   },
      // ],
      // "quote-props": ["error", "as-needed"],
      // quotes: ["error"],
      // "semi-spacing": ["error"],
      // "semi-style": ["error"],
      // "sort-vars": ["error"],
      // "space-before-function-paren": [
      //   "error",
      //   {
      //     anonymous: "never",
      //     named: "never",
      //     asyncArrow: "always",
      //   },
      // ],
      // "space-in-parens": ["error"],
      // "space-unary-ops": ["error"],
      // "spaced-comment": ["error"],
      // "switch-colon-spacing": [
      //   "error",
      //   {
      //     after: true,
      //     before: false,
      //   },
      // ],
      // "template-tag-spacing": ["error", "never"],
      // "wrap-regex": ["error"],
    },
  },
);
