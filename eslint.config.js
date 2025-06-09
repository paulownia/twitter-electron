import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

// You can confirm this eslint configuration using following command:
// npx eslint --inspect-config

export default defineConfig([
  // Global ignore patterns (.git and node_modules are ignored by default)
  {
    name: 'Global ignore patterns',
    ignores: [
      'build/',
      'dist/',
      'hoge.js',
      'fuga.js',
      'piyo.js',
      'nyan.js',
      'wang.js',
    ],
  },

  // ESLint recommended rules (apply to all files)
  eslint.configs.recommended,

  // Custom rules for all files (apply to all files)
  {
    name: 'Custom rules',
    rules: {
      'no-console': 1,
      'no-irregular-whitespace': 2,
      'no-spaced-func': 2,
      'no-var': ['error'],
      'no-constant-condition': ['error', { 'checkLoops': false }],
    },
  },

  // Stylistic rules (apply to all files)
  {
    name: 'Stylistic rules',
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': 2,
      '@stylistic/comma-dangle': [2, 'always-multiline'],
      '@stylistic/quotes': [2, 'single'],
      '@stylistic/block-spacing': 2,
      '@stylistic/indent': ['error', 2],
      '@stylistic/space-before-blocks': 2,
      '@stylistic/space-in-parens': 2,
      '@stylistic/keyword-spacing': 2,
      '@stylistic/object-curly-spacing': ['error', 'always',  { 'objectsInObjects': false }],
    },
  },

  // TypeScript rules (apply to .ts files only)
  {
    name: 'TypeScript rules',
    files: ['**/*.ts'],
    extends: [
      // defineConfig使用時、この設定はextendsまたはdefineConfigの引数の配列要素として配置できる。
      // 配列要素にすると、JSにもtypescript向けのルールが適用されてしまうのでここに書く
      tseslint.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // We should use @typescript-eslint/no-unused-vars instead of no-unused-vars for TypeScript files,
      // because the original no-unused-vars rule does not work well with TypeScript.
      // no-unused-vars is enabled by eslint.configs.recommended,
      // but it is disabled by tseslint.configs.recommended, so we need to explicitly set it to off.
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }],
    },
  },

  // JavaScript rules (apply to .js files only)
  {
    name: 'JavaScript rules',
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }],
    },
  },
]);
