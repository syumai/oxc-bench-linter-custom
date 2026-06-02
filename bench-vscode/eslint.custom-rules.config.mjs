import tsParser from '@typescript-eslint/parser';
import { eslintStandardRules } from './custom-benchmark-rules.mjs';
import customRulesPlugin, { customRuleNames } from '../custom-rules-plugin.mjs';

const ruleCount = Number(process.env.BENCH_CUSTOM_RULE_COUNT ?? '1');

if (![0, 1, 3, 10].includes(ruleCount)) {
    throw new Error(`Unsupported BENCH_CUSTOM_RULE_COUNT: ${ruleCount}`);
}

const rules = Object.fromEntries(
    customRuleNames.slice(0, ruleCount).map((ruleName) => [
        `bench/${ruleName}`,
        'error',
    ]),
);

export default [
    {
        files: ['**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],

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
