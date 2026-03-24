/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  ignorePatterns: ["dist/", "node_modules/"],
};
