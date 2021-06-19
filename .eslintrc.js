module.exports = {
  env: {
    browser: true,
    es6: true,
    'jest/globals': true
  },
  extends: [
    'eslint-config-standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest'],
  rules: {
    //
    // Disable rules provided by other configs
    //

    'no-unused-vars': 0, // Provided by TypeScript
    'no-undef': 0, // Provided by TypeScript
    'no-void': 0,
    'no-use-before-define': 0, // Provided by TypeScript

    //
    // Disable opinionated rules from @typescript-eslint
    //

    '@typescript-eslint/member-delimiter-style': 0, // Provided by Prettier
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/no-unused-vars': 0, // Use TS compiler option instead
    '@typescript-eslint/ban-ts-comment': 0, // Types can be wrong!
    '@typescript-eslint/explicit-module-boundary-types': 0, // This is too verbose and not practical sometimes
  }
}
