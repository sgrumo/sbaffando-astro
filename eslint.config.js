import eslintPluginAstro from 'eslint-plugin-astro'

export default [
    // add more generic rule sets here, such as:
    // js.configs.recommended,
    // eslint.configs.recommended,
    // ...tseslint.configs.strict,
    ...eslintPluginAstro.configs.recommended,
    // ...eslintPluginAstro.configs['jsx-a11y-strict'],
    // {
    //     files: ['**/*.astro'],
    //     plugins: {
    //         astro: eslintPluginAstro,
    //     },
    //     languageOptions: {
    //         parser: astroParser,
    //         parserOptions: {
    //             parser: tseslint.parser,
    //             extraFileExtensions: ['.astro'],
    //         },
    //     },
    // },
    // {
    //     files: ['**/*.ts', '**/*.tsx'],
    //     languageOptions: {
    //         parser: tseslint.parser,
    //     },
    //     rules: {
    //         '@typescript-eslint/interface-name-prefix': 'off',
    //         '@typescript-eslint/explicit-function-return-type': 'off',
    //         '@typescript-eslint/explicit-module-boundary-types': 'off',
    //         '@typescript-eslint/no-explicit-any': 'off',
    //         '@typescript-eslint/ban-ts-comment': 'warn',
    //         '@typescript-eslint/no-unused-vars': [
    //             'warn',
    //             { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    //         ],
    //     },
    // },
    // {
    //     languageOptions: {
    //         ecmaVersion: 2022,
    //         sourceType: 'module',
    //         globals: {
    //             node: true,
    //             browser: true,
    //         },
    //     },
    //     rules: {
    //         quotes: ['error', 'single'],
    //         semi: ['error', 'never'],
    //         'no-console': 'error',
    //         'no-unused-vars': 'off',
    //     },
    //     ignores: [
    //         'dist/**',
    //         'node_modules/**',
    //         '*.config.js',
    //         '*.config.ts',
    //         '.eslintrc.yml',
    //     ],
    // },
    { rules: {} },
    prettierConfig,
]
