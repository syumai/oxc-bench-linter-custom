function createProgramRule(index) {
    return {
        meta: {
            type: 'problem',
            docs: {
                description: `benchmark custom program rule ${index}`,
            },
            schema: [],
        },

        create(context) {
            return {
                Program(node) {
                    if (!/\.(?:cts|mts|tsx?|d\.ts)$/.test(context.filename)) {
                        return;
                    }

                    context.report({
                        node,
                        message: `Benchmark custom program rule ${index}`,
                    });
                },
            };
        },
    };
}

const rules = Object.fromEntries(
    Array.from({ length: 10 }, (_, index) => {
        const ruleNumber = index + 1;
        return [`program-${ruleNumber}`, createProgramRule(ruleNumber)];
    }),
);

export default {
    meta: {
        name: 'bench-custom-rules',
        version: '0.0.0',
    },
    rules,
};
