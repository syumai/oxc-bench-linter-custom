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
Oxlint, then adds 0, 1, 3, or 10 equivalent custom rules. It does not include
`@typescript-eslint/*` rules. `no-unused-vars` is also excluded because ESLint's
core rule is not compatible with this TypeScript AST workload.
The custom rule diagnostics are verified before benchmarking:

-   0 custom rules: 0 diagnostics in both ESLint and Oxlint
-   1 custom rule: 6,948 diagnostics in both ESLint and Oxlint
-   3 custom rules: 20,844 diagnostics in both ESLint and Oxlint
-   10 custom rules: 69,480 diagnostics in both ESLint and Oxlint

Note: with the current VS Code snapshot used for this run, the baseline
standard-rule totals differ before adding custom rules: ESLint reports 2,876
diagnostics, and Oxlint reports 1,702 diagnostics. The comparison below
therefore verifies and controls the added custom-rule diagnostics.

#### Summary

| Custom rules | Custom diagnostics | Oxlint JS Plugin | ESLint Custom Rule | Speedup | Oxlint delta from 0 rules | ESLint delta from 0 rules |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 0 | 0.368 s | 40.931 s | 111.14x | - | - |
| 1 | 6,948 | 3.803 s | 41.000 s | 10.78x | +3.435 s | +0.069 s |
| 3 | 20,844 | 4.187 s | 41.003 s | 9.79x | +3.819 s | +0.072 s |
| 10 | 69,480 | 5.560 s | 41.158 s | 7.40x | +5.192 s | +0.227 s |

#### No ESLint custom rule vs no Oxlint JS Plugin rule

```
Benchmark 1: oxc-js-plugin-0
  Time (mean ± σ):     368.3 ms ±   2.7 ms    [User: 1499.0 ms, System: 817.7 ms]
  Range (min … max):   363.2 ms … 371.5 ms    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-0
  Time (mean ± σ):     40.931 s ±  0.232 s    [User: 60.314 s, System: 1.978 s]
  Range (min … max):   40.607 s … 41.393 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-0 ran
  111.14 ± 1.03 times faster than eslint-custom-rules-0
```

#### 1 ESLint custom rule vs 1 Oxlint JS Plugin rule

```
Benchmark 1: oxc-js-plugin-1
  Time (mean ± σ):      3.803 s ±  0.013 s    [User: 5.856 s, System: 0.886 s]
  Range (min … max):    3.790 s …  3.830 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-1
  Time (mean ± σ):     41.000 s ±  0.323 s    [User: 59.515 s, System: 2.049 s]
  Range (min … max):   40.566 s … 41.593 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-1 ran
   10.78 ± 0.09 times faster than eslint-custom-rules-1
```

#### 3 ESLint custom rules vs 3 Oxlint JS Plugin rules

```
Benchmark 1: oxc-js-plugin-3
  Time (mean ± σ):      4.187 s ±  0.008 s    [User: 6.236 s, System: 0.890 s]
  Range (min … max):    4.173 s …  4.198 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-3
  Time (mean ± σ):     41.003 s ±  0.223 s    [User: 59.638 s, System: 2.030 s]
  Range (min … max):   40.707 s … 41.333 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-3 ran
    9.79 ± 0.06 times faster than eslint-custom-rules-3
```

#### 10 ESLint custom rules vs 10 Oxlint JS Plugin rules

```
Benchmark 1: oxc-js-plugin-10
  Time (mean ± σ):      5.560 s ±  0.031 s    [User: 7.670 s, System: 0.902 s]
  Range (min … max):    5.529 s …  5.627 s    10 runs

  Warning: Ignoring non-zero exit code.

Benchmark 2: eslint-custom-rules-10
  Time (mean ± σ):     41.158 s ±  0.209 s    [User: 59.949 s, System: 2.007 s]
  Range (min … max):   40.876 s … 41.522 s    10 runs

  Warning: Ignoring non-zero exit code.

Summary
  oxc-js-plugin-10 ran
    7.40 ± 0.06 times faster than eslint-custom-rules-10
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
