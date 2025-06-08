import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base configuration
  {
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

  // ESLint recommended rules (apply to both .ts and .js files)
  eslint.configs.recommended,
  {
    rules: {
      'no-console': 1,
      'no-irregular-whitespace': 2,
      'no-spaced-func': 2,
      'no-var': ['error'],
      'no-constant-condition': ['error', { 'checkLoops': false }],
    },
  },
  {
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
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }],
    },
  },

  // JavaScript rules (apply to .js files only)
  {
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
