const js = require("@eslint/js");
module.exports = [
  js.configs.recommended,
  {
      languageOptions: {
          ecmaVersion: 2022,
          sourceType: "script",
          globals: {
              document: "readonly",
              window: "readonly",
              localStorage: "readonly",
              navigator: "readonly",
              fetch: "readonly",
              console: "readonly",
              setTimeout: "readonly",
              setInterval: "readonly",
              clearInterval: "readonly",
              clearTimeout: "readonly"
          }
      },
      rules: {
          "no-const-assign": "error",
          "no-undef": "off",
          "no-unused-vars": "off"
      }
  }
];
