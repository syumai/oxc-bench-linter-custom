import { writeFileSync } from 'node:fs';
import { oxlintStandardRules } from './bench-vscode/custom-benchmark-rules.mjs';
import { customRuleNames } from './custom-rules-plugin.mjs';

const [outputConfigPath, pluginSpecifier, rawRuleCount] = process.argv.slice(2);
const ruleCount = Number(rawRuleCount);

if (!outputConfigPath || !pluginSpecifier || ![0, 1, 3, 10].includes(ruleCount)) {
    throw new Error(
        'Usage: node generate-custom-oxlint-config.mjs <output-config> <plugin-specifier> <rule-count: 0|1|3|10>',
    );
}

const customRules = Object.fromEntries(
    customRuleNames.slice(0, ruleCount).map((ruleName) => [
        `bench/${ruleName}`,
        'error',
    ]),
);

const config = {
    $schema: './node_modules/oxlint/configuration_schema.json',
    categories: {
        correctness: 'off',
    },
    jsPlugins:
        ruleCount === 0 ? [] : [{
            name: 'bench',
            specifier: pluginSpecifier,
        }],
    rules: {
        ...oxlintStandardRules,
        ...customRules,
    },
};

writeFileSync(outputConfigPath, `${JSON.stringify(config, null, 2)}\n`);
