module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        // "standard-with-typescript",
        "plugin:vue/vue3-recommended",
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "no-unused-vars": "warn"
      }
}
