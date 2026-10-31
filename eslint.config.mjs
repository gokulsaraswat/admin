import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// An app's admin never imports another app's code (docs/DESIGN.md section 3).
const apps = ["portfolio", "hub", "gspace", "studio", "gym"];
const appIsolation = apps.map((app) => ({
  files: [`src/app/\\(admin\\)/${app}/**`, `src/features/${app}/**`],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: apps
          .filter((other) => other !== app)
          .map((other) => ({
            group: [
              `@/features/${other}`,
              `@/features/${other}/**`,
              `@/app/(admin)/${other}/**`,
              `**/(admin)/${other}/**`,
              ...["..", "../..", "../../.."].flatMap((up) => [`${up}/${other}`, `${up}/${other}/**`]),
            ],
            message: `${app} must not import ${other} code. Share it via src/lib or src/components instead.`,
          })),
      },
    ],
  },
}));

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...appIsolation,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Static design prototypes, not app code.
    "docs/**",
  ]),
]);

export default eslintConfig;
