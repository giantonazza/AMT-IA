module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-explicit-any': ['warn', { "ignoreRestArgs": true }],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-page-custom-font': 'off',
    "@typescript-eslint/no-empty-interface": ["error", { "allowSingleExtends": true }],
    // Add this line to disable the no-empty-object-type rule
    "@typescript-eslint/no-empty-object-type": "off",
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
};

