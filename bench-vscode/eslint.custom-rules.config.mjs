import tsParser from '@typescript-eslint/parser';
import { eslintStandardRules } from './custom-benchmark-rules.mjs';
import customRulesPlugin from '../custom-rules-plugin.mjs';

const ruleCount = Number(process.env.BENCH_CUSTOM_RULE_COUNT ?? '1');

if (![0, 1, 3, 10].includes(ruleCount)) {
    throw new Error(`Unsupported BENCH_CUSTOM_RULE_COUNT: ${ruleCount}`);
}

const rules = Object.fromEntries(
    Array.from({ length: ruleCount }, (_, index) => [
        `bench/program-${index + 1}`,
        'error',
    ]),
);

export default [
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],

        plugins: {
            bench: customRulesPlugin,
        },

        languageOptions: {
            parser: tsParser,
        },

        rules: {
            ...eslintStandardRules,
            ...rules,
        },
    },
];
