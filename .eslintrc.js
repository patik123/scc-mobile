module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    overrides: [
      {
        files: ['*.scss', '*.spec.js'],
        rules: {
          'no-unused-expressions': 'off',
        },
      },
    ],
  },
}
