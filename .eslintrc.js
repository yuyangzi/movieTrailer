module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": 0,
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": ["error", {
            "allow": ["warn", "error", "info", "log"]
        }]
    },
    "parserOptions": {
        "ecmaVersion": 8,
        "sourceType": "script"
    },
    "globals": {
        'window': true
    }
};