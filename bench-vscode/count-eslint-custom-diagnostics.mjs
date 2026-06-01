import { ESLint } from 'eslint';

const ruleCount = process.argv[2];

process.env.BENCH_CUSTOM_RULE_COUNT = ruleCount;

const eslint = new ESLint({
    overrideConfigFile: 'bench-vscode/eslint.custom-rules.config.mjs',
});

const results = await eslint.lintFiles(['tmp/vscode/src']);
const diagnostics = results.reduce(
    (count, result) =>
        count + result.messages.filter((message) => message.ruleId?.startsWith('bench/program-')).length,
    0,
);

console.log(diagnostics);
