#!/usr/bin/env bash

cd "$(dirname "$0")/.."

VSCODE_TEST_DIR="$(pwd)/tmp/vscode/src"

echo "============================================"
echo "VS Code Benchmark"
echo "============================================"
echo ""

echo "1. Oxlint vs Biome with single rule (no-debugger)"
echo "-------------------------------------------"

OXC="./node_modules/.bin/oxlint -A all -D debugger ${VSCODE_TEST_DIR}"
BIOME="./node_modules/.bin/biome lint --only=suspicious/noDebugger ${VSCODE_TEST_DIR}"

hyperfine -w 1 -i \
  -n oxc "${OXC}" \
  -n biome "${BIOME}"

echo ""
echo "2. Oxlint vs ESLint with standard rules"
echo "-------------------------------------------"

OXC="./node_modules/.bin/oxlint -c bench-vscode/.oxlintrc.json ${VSCODE_TEST_DIR}"
ESLINT="./node_modules/.bin/eslint -c bench-vscode/eslint.config.mjs ${VSCODE_TEST_DIR}"

hyperfine -w 1 -i \
  -n oxc "${OXC}" \
  -n oxc-single-thread "${OXC} --threads=1" \
  -n eslint "${ESLINT}"

echo ""
echo "3. Oxlint JS Plugin vs ESLint custom rules"
echo "-------------------------------------------"

node ./bench-vscode/verify-custom-rules.mjs

for RULE_COUNT in 1 3 10; do
  echo ""
  echo "3.${RULE_COUNT}. ${RULE_COUNT} custom rule(s)"
  echo "-------------------------------------------"

  OXC_CUSTOM="./node_modules/.bin/oxlint -c bench-vscode/.oxlintrc.standard-plus-custom-${RULE_COUNT}.generated.json ${VSCODE_TEST_DIR}"
  ESLINT_CUSTOM="BENCH_CUSTOM_RULE_COUNT=${RULE_COUNT} ./node_modules/.bin/eslint -c bench-vscode/eslint.custom-rules.config.mjs ${VSCODE_TEST_DIR}"

  hyperfine -w 1 -i \
    -n "oxc-js-plugin-${RULE_COUNT}" "${OXC_CUSTOM}" \
    -n "eslint-custom-rules-${RULE_COUNT}" "${ESLINT_CUSTOM}"
done
