/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true
  },
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'vue/one-component-per-file': 'off'
  }
};
