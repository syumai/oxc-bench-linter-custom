import { eslintCompatPlugin } from '@oxlint/plugins';

export const customRuleNames = [
    'no-console-call',
    'no-promise-then-chain',
    'no-new-promise',
    'no-explicit-any',
    'no-non-null-assertion',
    'no-inner-html-assignment',
    'no-browser-storage-access',
    'no-document-query-selector',
    'no-set-timeout-string-handler',
    'no-dynamic-import',
];

const consoleMethods = new Set(['log', 'warn', 'error', 'info', 'debug']);
const promiseChainMethods = new Set(['then', 'catch', 'finally']);
const browserStorageNames = new Set(['localStorage', 'sessionStorage']);
const querySelectorMethods = new Set(['querySelector', 'querySelectorAll']);
const timerNames = new Set(['setTimeout', 'setInterval']);

function createRule(description, visitors) {
    return {
        meta: {
            type: 'problem',
            docs: {
                description,
            },
            schema: [],
        },

        createOnce(context) {
            return visitors(context);
        },
    };
}

function getNodeName(node) {
    return node?.name;
}

function getStaticMemberName(node) {
    if (node?.type !== 'MemberExpression') {
        return undefined;
    }

    if (node.computed) {
        return getStringLiteralValue(node.property);
    }

    return getNodeName(node.property);
}

function getStringLiteralValue(node) {
    return node?.type === 'Literal' && typeof node.value === 'string' ? node.value : undefined;
}

function isIdentifier(node, name) {
    return getNodeName(node) === name;
}

function isGlobalName(node, names) {
    return node?.type === 'Identifier' && names.has(node.name);
}

function isStaticMemberCall(node, objectName, methods) {
    return (
        node?.callee?.type === 'MemberExpression' &&
        isIdentifier(node.callee.object, objectName) &&
        methods.has(getStaticMemberName(node.callee))
    );
}

function isStringLiteral(node) {
    return getStringLiteralValue(node) !== undefined;
}

const rules = {
    'no-console-call': createRule('disallow direct console calls', (context) => ({
        CallExpression(node) {
            if (isStaticMemberCall(node, 'console', consoleMethods)) {
                context.report({
                    node,
                    message: 'Unexpected console call.',
                });
            }
        },
    })),

    'no-promise-then-chain': createRule('disallow Promise then/catch/finally chains', (context) => ({
        CallExpression(node) {
            if (node.callee?.type === 'MemberExpression' && promiseChainMethods.has(getStaticMemberName(node.callee))) {
                context.report({
                    node,
                    message: 'Unexpected Promise chain method.',
                });
            }
        },
    })),

    'no-new-promise': createRule('disallow new Promise expressions', (context) => ({
        NewExpression(node) {
            if (isIdentifier(node.callee, 'Promise')) {
                context.report({
                    node,
                    message: 'Unexpected new Promise expression.',
                });
            }
        },
    })),

    'no-explicit-any': createRule('disallow explicit any types', (context) => ({
        TSAnyKeyword(node) {
            context.report({
                node,
                message: 'Unexpected explicit any type.',
            });
        },
    })),

    'no-non-null-assertion': createRule('disallow non-null assertions', (context) => ({
        TSNonNullExpression(node) {
            context.report({
                node,
                message: 'Unexpected non-null assertion.',
            });
        },
    })),

    'no-inner-html-assignment': createRule('disallow assigning to innerHTML', (context) => ({
        AssignmentExpression(node) {
            if (getStaticMemberName(node.left) === 'innerHTML') {
                context.report({
                    node,
                    message: 'Unexpected innerHTML assignment.',
                });
            }
        },
    })),

    'no-browser-storage-access': createRule('disallow browser storage access', (context) => ({
        MemberExpression(node) {
            if (isGlobalName(node.object, browserStorageNames)) {
                context.report({
                    node,
                    message: 'Unexpected browser storage access.',
                });
            }
        },
    })),

    'no-document-query-selector': createRule('disallow document query selector calls', (context) => ({
        CallExpression(node) {
            if (isStaticMemberCall(node, 'document', querySelectorMethods)) {
                context.report({
                    node,
                    message: 'Unexpected document query selector call.',
                });
            }
        },
    })),

    'no-set-timeout-string-handler': createRule('disallow string timer handlers', (context) => ({
        CallExpression(node) {
            if (isGlobalName(node.callee, timerNames) && isStringLiteral(node.arguments[0])) {
                context.report({
                    node,
                    message: 'Unexpected string timer handler.',
                });
            }
        },
    })),

    'no-dynamic-import': createRule('disallow dynamic import expressions', (context) => ({
        ImportExpression(node) {
            context.report({
                node,
                message: 'Unexpected dynamic import expression.',
            });
        },
    })),
};

export default eslintCompatPlugin({
    meta: {
        name: 'bench',
        version: '0.0.0',
    },
    rules,
});
