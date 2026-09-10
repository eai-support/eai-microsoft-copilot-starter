import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: [
      'packages/platform-sdk/__tests__/chat.test.ts',
      'scripts/**/*.cjs',
      'tests/**/*.cjs',
    ],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  globalIgnores([
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '.next/**',
    'out/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
    '.agents/**',
    '.claude/**',
    '.gemini/**',
    '.grok/**',
    '.specify/**',
    '.system/**',
    '.github/instructions/**',
    '.github/prompts/**',
    '.github/skills/**',
    '*.log',
  ]),
]);

export default eslintConfig;
