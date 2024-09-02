import pluginJs from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/',
      'hoge.js',
      'fuga.js',
      'piyo.js',
    ],
  },
  pluginJs.configs.recommended,
  {
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
      'semi': 2,
      'no-console': 1,
      'comma-dangle': [2, 'always-multiline'],
      'quotes': [2, 'single'],
      'no-irregular-whitespace': 2,
      'no-spaced-func': 2,
      'block-spacing': 2,
      'indent': ['error', 2],
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_',
      }],
      'no-var': ['error'],
      'no-constant-condition': ['error', { 'checkLoops': false }],
      'space-before-blocks': 2,
      'space-in-parens': 2,
      'keyword-spacing': 2,
      'object-curly-spacing': ['error', 'always',  { 'objectsInObjects': false }],
    },
  },
];
