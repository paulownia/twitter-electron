import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// You can confirm this eslint configuration using following command:
// npx eslint --inspect-config

export default tseslint.config(
  // Global ignore patterns (.git and node_modules are ignored by default)
  {
    name: 'custom/ignores',
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
  {
    name: 'eslint/recommended',
    ...eslint.configs.recommended,
  },

  ...tseslint.configs.recommended,

  // Custom rules for all files (apply to all files)
  {
    name: 'custom/rules',
    rules: {
      'no-console': 1,
    },
  },

  // Stylistic rules (apply to all files)
  {
    name: 'custom/rules/stylistic',
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
      '@stylistic/object-curly-spacing': ['error', 'always',  { objectsInObjects: false }],
      '@stylistic/no-trailing-spaces': 2,
      '@stylistic/arrow-spacing': 2,
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/quote-props': ['error', 'consistent-as-needed'],
      '@stylistic/function-call-spacing': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/no-multiple-empty-lines': ['error', {
        max: 1,
        maxEOF: 0,
        maxBOF: 0,
      }],
    },
  },

  // TypeScript rules (apply to .ts files only)
  {
    name: 'custom/rules/typescript',
    files: ['**/*.ts'],
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
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },

  // JavaScript rules (apply to .js files only)
  {
    name: 'custom/rules/javascript',
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-var': ['error'],  // this is not enabled in the recommended rule for js files. so it is enabled explicitly here
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
    },
  },
);
