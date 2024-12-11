module.exports = {
    root: true,
    env: {browser: true, es2020: true},
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@typescript-eslint/stylistic-type-checked',
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
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: [ './tsconfig.json', './tsconfig.node.json', './tsconfig.app.json' ],
        tsconfigRootDir: __dirname,
    },
}
