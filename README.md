# Benchmark for Oxc, Biome and ESLint

This repository contains three separate benchmarks:

-   **bench-vscode**: Benchmarks on VS Code codebase with standard linting rules
-   **bench-vue**: Benchmarks on Vue Core codebase with type-aware linting rules
-   **bench-sentry**: Benchmarks on Sentry codebase with type-aware linting rules

## Summary

On a MacBook Pro M1 Pro (32GB), Oxlint is 21x faster than ESLint on the VS Code
standard rules benchmark, 85x faster on the Vue Core type-aware benchmark, and
70x faster on the Sentry type-aware benchmark.

Oxlint is 4.13x faster than Biome on the VS Code single-rule benchmark.

## Setup

Each benchmark is in its own directory:

-   [bench-vscode](./bench-vscode) - VS Code codebase benchmarks
-   [bench-vue](./bench-vue) - Vue Core codebase benchmarks
-   [bench-sentry](./bench-sentry) - Sentry codebase benchmarks (type-aware)

## VS Code Benchmark Results

### MacBook Pro M1 Pro (32GB)

### Oxlint vs Biome

```
Benchmark 1: oxc
  Time (mean ± σ):     320.6 ms ±   6.5 ms    [User: 911.8 ms, System: 840.3 ms]
  Range (min … max):   313.7 ms … 331.7 ms    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: biome
  Time (mean ± σ):      1.324 s ±  0.037 s    [User: 8.077 s, System: 1.994 s]
  Range (min … max):    1.294 s …  1.406 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc ran
    4.13 ± 0.14 times faster than biome
```

### Oxlint vs ESLint

```
Benchmark 1: oxc
  Time (mean ± σ):      2.562 s ±  0.082 s    [User: 9.601 s, System: 1.919 s]
  Range (min … max):    2.482 s …  2.778 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: oxc-single-thread
  Time (mean ± σ):      3.956 s ±  0.063 s    [User: 9.289 s, System: 1.399 s]
  Range (min … max):    3.861 s …  4.056 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 3: eslint
  Time (mean ± σ):     54.028 s ±  0.737 s    [User: 75.433 s, System: 3.602 s]
  Range (min … max):   53.344 s … 55.421 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc ran
    1.54 ± 0.06 times faster than oxc-single-thread
   21.09 ± 0.73 times faster than eslint
```

### Oxlint JS Plugin vs ESLint Custom Rules

This benchmark explicitly lists non-type-aware core lint rules for ESLint and
Oxlint, then adds 0, 1, 3, or 10 equivalent custom rules. The custom rules are
predefined real-world-style rules implemented with `@oxlint/plugins`
`eslintCompatPlugin`, so the same plugin module runs in both ESLint and Oxlint.
It does not include `@typescript-eslint/*` rules. `no-unused-vars` is also
excluded because ESLint's core rule is not compatible with this TypeScript AST
workload.
The custom rule diagnostics are verified before benchmarking:

-   0 custom rules: 0 diagnostics in both ESLint and Oxlint
-   1 custom rule: 757 diagnostics in both ESLint and Oxlint
-   3 custom rules: 1,885 diagnostics in both ESLint and Oxlint
-   10 custom rules: 13,229 diagnostics in both ESLint and Oxlint

Note: with the current VS Code snapshot used for this run, the baseline
standard-rule totals differ before adding custom rules: ESLint reports 2,876
diagnostics, and Oxlint reports 1,702 diagnostics. The comparison below
therefore verifies and controls the added custom-rule diagnostics.

#### Summary

| Custom rules | Custom diagnostics | Oxlint JS Plugin | ESLint Custom Rule | Speedup | Oxlint delta from 0 rules | ESLint delta from 0 rules |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 0.402 s | 47.359 s | 117.77x | - | - |
| 1 | 757 | 3.913 s | 47.966 s | 12.26x | +3.511 s | +0.607 s |
| 3 | 1,885 | 3.967 s | 48.185 s | 12.15x | +3.565 s | +0.826 s |
| 10 | 13,229 | 4.745 s | 44.387 s | 9.35x | +4.343 s | -2.972 s |

#### No ESLint custom rule vs no Oxlint JS Plugin rule

```
Benchmark 1: oxc-js-plugin-0
  Time (mean ± σ):     402.2 ms ±   4.8 ms    [User: 1541.9 ms, System: 809.8 ms]
  Range (min … max):   396.8 ms … 411.8 ms    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-0
  Time (mean ± σ):     47.359 s ±  0.195 s    [User: 68.239 s, System: 2.865 s]
  Range (min … max):   47.081 s … 47.665 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-0 ran
  117.77 ± 1.48 times faster than eslint-custom-rules-0
```

#### 1 ESLint custom rule vs 1 Oxlint JS Plugin rule

```
Benchmark 1: oxc-js-plugin-1
  Time (mean ± σ):      3.913 s ±  0.018 s    [User: 6.072 s, System: 0.986 s]
  Range (min … max):    3.884 s …  3.940 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-1
  Time (mean ± σ):     47.966 s ±  0.734 s    [User: 69.994 s, System: 3.391 s]
  Range (min … max):   47.363 s … 49.541 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-1 ran
   12.26 ± 0.20 times faster than eslint-custom-rules-1
```

#### 3 ESLint custom rules vs 3 Oxlint JS Plugin rules

```
Benchmark 1: oxc-js-plugin-3
  Time (mean ± σ):      3.967 s ±  0.019 s    [User: 6.160 s, System: 0.974 s]
  Range (min … max):    3.936 s …  3.990 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-3
  Time (mean ± σ):     48.185 s ±  0.534 s    [User: 70.666 s, System: 3.435 s]
  Range (min … max):   47.573 s … 49.293 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-3 ran
   12.15 ± 0.15 times faster than eslint-custom-rules-3
```

#### 10 ESLint custom rules vs 10 Oxlint JS Plugin rules

```
Benchmark 1: oxc-js-plugin-10
  Time (mean ± σ):      4.745 s ±  0.033 s    [User: 6.983 s, System: 1.000 s]
  Range (min … max):    4.696 s …  4.804 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-10
  Time (mean ± σ):     44.387 s ±  2.745 s    [User: 65.516 s, System: 2.988 s]
  Range (min … max):   41.593 s … 49.023 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-10 ran
    9.35 ± 0.58 times faster than eslint-custom-rules-10
```

## Vue Core Benchmark Results

### Type-Aware Rules Performance

Oxlint with type-aware rules vs TypeScript ESLint on Vue Core codebase.

### MacBook Pro M1 Pro (32GB)

```
Benchmark 1: oxc
  Time (mean ± σ):     236.5 ms ±   4.3 ms    [User: 554.2 ms, System: 162.1 ms]
  Range (min … max):   229.6 ms … 240.8 ms    12 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint
  Time (mean ± σ):     20.147 s ±  0.948 s    [User: 27.855 s, System: 1.752 s]
  Range (min … max):   17.697 s … 21.476 s    10 runs

  Warning: Ignoring non-zero exit code.
  Warning: Statistical outliers were detected. Consider re-running this benchmark on a quiet system without any interferences from other programs. It might help to use the '--warmup' or '--prepare' options.

Summary
  oxc ran
   85.17 ± 4.30 times faster than eslint
```

## Sentry Benchmark Results

### Type-Aware Rules Performance

Oxlint with type-aware rules vs TypeScript ESLint on Sentry codebase.

### MacBook Pro M1 Pro (32GB)

```
Benchmark 1: oxc
  Time (mean ± σ):      1.320 s ±  0.042 s    [User: 7.091 s, System: 1.878 s]
  Range (min … max):    1.275 s …  1.427 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint
  Time (mean ± σ):     92.628 s ±  2.109 s    [User: 141.874 s, System: 14.837 s]
  Range (min … max):   88.734 s … 95.121 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc ran
   70.15 ± 2.76 times faster than eslint
```

## Run

### Run all benchmarks

```bash
# Initialize repos and dependencies
./init.sh

# Run all benchmarks
./bench-all.sh
```

### Run individual benchmarks

#### VS Code benchmark

```bash
cd bench-vscode
./bench.sh
```

#### Vue benchmark

```bash
cd bench-vue
./bench.sh
```

#### Outline benchmark

```bash
cd bench-outline
./bench.sh
```

#### Sentry benchmark

```bash
cd bench-sentry
./bench.sh
```
