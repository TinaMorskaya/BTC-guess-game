module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
    ],
    ignorePatterns: [ 'dist', '.eslintrc.cjs' ],
    parser: '@typescript-eslint/parser',
    plugins: [
        'react-refresh',
        'testing-library',
        'jest-dom',
        'react',
        '@typescript-eslint',
        'react-hooks',
    ],
    rules: {
        'react-refresh/only-export-components': [
            'warn',
            {allowConstantExport: true},
        ],
        'quotes': [ 'error', 'single' ],
        'react/react-in-jsx-scope': 'off',
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
}
