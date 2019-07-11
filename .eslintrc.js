module.exports = {
  "plugins": ["jest"],
  env: {
    commonjs: true,
    es6: true,
    node: true,
    "jest/globals": true
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-plusplus": 0
  },
};