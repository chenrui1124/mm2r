import { defineConfig } from 'oxfmt'

export default defineConfig({
  arrowParens: 'avoid',
  jsxSingleQuote: true,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  sortPackageJson: {
    sortScripts: true,
  },
})
