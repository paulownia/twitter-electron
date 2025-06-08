import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const customRules = {
  'semi': 2,
  'no-console': 1,
  'comma-dangle': [2, 'always-multiline'],
  'quotes': [2, 'single'],
  'no-irregular-whitespace': 2,
  'no-spaced-func': 2,
  'block-spacing': 2,
  'indent': ['error', 2],
  'no-var': ['error'],
  'no-constant-condition': ['error', { 'checkLoops': false }],
  'space-before-blocks': 2,
  'space-in-parens': 2,
  'keyword-spacing': 2,
  'object-curly-spacing': ['error', 'always',  { 'objectsInObjects': false }],
};

export default [
  {
    ignores: [
      'build/',
      'dist/',
      'hoge.js',
      'fuga.js',
      'piyo.js',
    ],
  },
  // TypeScript rules
  ...tseslint.config({
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...customRules,
      '@typescript-eslint/no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }],
    },
  }),
  // JavaScript rules
  {
    files: ['**/*.js'],
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...customRules,
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }],
    },
  },
];
