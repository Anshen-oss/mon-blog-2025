module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        // cette option permet de lire les "paths" du tsconfig.json
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    // ...
  },
};
