import { execFileSync } from 'node:child_process';
import { ESLint } from 'eslint';

const testDir = 'tmp/vscode/src';
const ruleCounts = [0, 1, 3, 10];

function run(command, args, env = {}) {
    try {
        return execFileSync(command, args, {
            env: {
                ...process.env,
                ...env,
            },
            encoding: 'utf8',
            maxBuffer: 1024 * 1024 * 1024,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
    } catch (error) {
        if (typeof error.stdout === 'string' && error.stdout.length > 0) {
            return error.stdout;
        }

        throw error;
    }
}

async function countEslintDiagnostics(configFile, ruleCount = undefined) {
    const originalRuleCount = process.env.BENCH_CUSTOM_RULE_COUNT;

    if (ruleCount === undefined) {
        delete process.env.BENCH_CUSTOM_RULE_COUNT;
    } else {
        process.env.BENCH_CUSTOM_RULE_COUNT = String(ruleCount);
    }

    const eslint = new ESLint({
        overrideConfigFile: configFile,
    });

    try {
        const results = await eslint.lintFiles([testDir]);
        return results.reduce((count, result) => count + result.messages.length, 0);
    } finally {
        if (originalRuleCount === undefined) {
            delete process.env.BENCH_CUSTOM_RULE_COUNT;
        } else {
            process.env.BENCH_CUSTOM_RULE_COUNT = originalRuleCount;
        }
    }
}

async function countEslintCustomDiagnostics(ruleCount) {
    const output = run(process.execPath, [
        'bench-vscode/count-eslint-custom-diagnostics.mjs',
        String(ruleCount),
    ]);
    return Number(output.trim());
}

function countOxlintDiagnostics(output) {
    const results = JSON.parse(output);

    if (Array.isArray(results)) {
        return results.reduce((count, result) => count + (result.diagnostics?.length ?? 0), 0);
    }

    if (Array.isArray(results.diagnostics)) {
        return results.diagnostics.length;
    }

    throw new Error('Unexpected oxlint JSON format');
}

function countOxlintCustomDiagnostics(output) {
    const results = JSON.parse(output);
    const diagnostics = Array.isArray(results) ? results.flatMap((result) => result.diagnostics ?? []) : results.diagnostics;

    if (!Array.isArray(diagnostics)) {
        throw new Error('Unexpected oxlint JSON format');
    }

    return diagnostics.filter((diagnostic) => diagnostic.code?.startsWith('bench(program-')).length;
}

const baselineEslintDiagnostics = await countEslintDiagnostics(
    'bench-vscode/eslint.custom-rules.config.mjs',
    0,
);
run('node', [
    './generate-custom-oxlint-config.mjs',
    'bench-vscode/.oxlintrc.standard-explicit.generated.json',
    '../custom-rules-plugin.mjs',
    '0',
]);
const baselineOxlintDiagnostics = countOxlintDiagnostics(
    run('./node_modules/.bin/oxlint', [
        '-c',
        'bench-vscode/.oxlintrc.standard-explicit.generated.json',
        '--format',
        'json',
        testDir,
    ]),
);

console.log(
    `baseline: ESLint reported ${baselineEslintDiagnostics} diagnostics, Oxlint reported ${baselineOxlintDiagnostics} diagnostics`,
);

for (const ruleCount of ruleCounts) {
    run('node', [
        './generate-custom-oxlint-config.mjs',
        `bench-vscode/.oxlintrc.standard-plus-custom-${ruleCount}.generated.json`,
        '../custom-rules-plugin.mjs',
        String(ruleCount),
    ]);

    const eslintCustomDiagnostics = await countEslintCustomDiagnostics(ruleCount);
    const oxlintOutput = run('./node_modules/.bin/oxlint', [
        '-c',
        `bench-vscode/.oxlintrc.standard-plus-custom-${ruleCount}.generated.json`,
        '--format',
        'json',
        testDir,
    ]);
    const oxlintCustomDiagnostics = countOxlintCustomDiagnostics(oxlintOutput);

    if (eslintCustomDiagnostics !== oxlintCustomDiagnostics) {
        throw new Error(
            `${ruleCount} custom rule(s): ESLint custom rules reported ${eslintCustomDiagnostics} diagnostics, but Oxlint JS plugins reported ${oxlintCustomDiagnostics}`,
        );
    }

    console.log(
        `${ruleCount} custom rule(s): ${eslintCustomDiagnostics} custom diagnostics in both ESLint and Oxlint`,
    );
}
