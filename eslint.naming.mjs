import checkFile from "eslint-plugin-check-file";

/**
 * Конвенции именования файлов/папок из ARCHITECTURE.md, проверяемые автоматически
 * через eslint-plugin-check-file. Слайсы адресуются через generic `*` по сегменту,
 * без перечисления конкретных имён (auth, sign-in, ...).
 */

// entities/*, features/*, widgets/*, pages/* — единый паттерн для любого слайса.
const SLICE_GLOBS = [
  "src/entities/*",
  "src/features/*",
  "src/widgets/*",
  "src/pages/*",
];

// `use[A-Z]*`/`create[A-Z]*`/`build[A-Z]*`, а не `use*` и т.п. — иначе задевает
// случайные совпадающие префиксы в обычных kebab-словах (`user-model.ts` тоже
// начинается на "use").
const VERB_PREFIX = "@(use[A-Z]*|create[A-Z]*|build[A-Z]*)";
const NOT_VERB_PREFIX = `!(${VERB_PREFIX.slice(2, -1)})`;

// .tsx: компонент — PascalCase; фабрика/хук с JSX (createFormField.tsx,
// useExpandingExample.tsx) — camelCase по имени экспорта.
const tsxRules = glob => ({
  [`${glob}/**/${NOT_VERB_PREFIX}.tsx`]: "PASCAL_CASE",
  [`${glob}/**/${VERB_PREFIX}.tsx`]: "CAMEL_CASE",
});

// .ts: хук/фабрика — camelCase по имени экспорта; всё остальное — kebab-case.
const tsRules = glob => ({
  [`${glob}/**/${VERB_PREFIX}.ts`]: "CAMEL_CASE",
  [`${glob}/**/${NOT_VERB_PREFIX}.ts`]: "KEBAB_CASE",
});

export const namingConfig = {
  files: ["src/**/*.{ts,tsx}"],
  plugins: { "check-file": checkFile },
  rules: {
    "check-file/filename-naming-convention": [
      "error",
      {
        ...Object.assign({}, ...SLICE_GLOBS.map(tsxRules)),
        ...Object.assign({}, ...SLICE_GLOBS.map(tsRules)),

        // app/*.{ts,tsx} (без вложенных папок — routes/ сюда не попадает).
        // `router.tsx` исключён: не компонент, а инстанс-модуль (экспортирует
        // `router`), .tsx только из-за встроенного JSX в defaultPendingComponent.
        "src/app/!(router).tsx": "PASCAL_CASE",
        "src/app/*.ts": "KEBAB_CASE",

        // shared/api, shared/config, shared/lib — без глагольного исключения:
        // хуки здесь уже kebab-case (use-holder-ref.ts), а не camelCase VM-стиль.
        // `notification-service.tsx` исключена: класс-сервис, не компонент,
        // .tsx только из-за встроенного JSX в toast.custom(...).
        "src/shared/{api,config,lib}/**/!(notification-service).tsx":
          "PASCAL_CASE",
        "src/shared/{api,config,lib}/**/*.ts": "KEBAB_CASE",

        // shared/ui — тот же паттерн, что и слайсы выше.
        ...tsxRules("src/shared/ui"),
        [`src/shared/ui/**/${NOT_VERB_PREFIX}.ts`]: "KEBAB_CASE",
      },
      { ignoreMiddleExtensions: true },
    ],

    "check-file/folder-naming-convention": [
      "error",
      {
        "src/**/": "KEBAB_CASE",
      },
      {
        // _app / _auth — pathless layout routes; __tests__ — test-runner convention.
        ignoreWords: ["_app", "_auth", "__tests__"],
      },
    ],
  },
};

export default namingConfig;
