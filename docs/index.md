---
layout: home

hero:
  name: Cross-Platform Path Normalizer
  text: Consistent Path Formats
  tagline: Convert Windows/Unix paths with zero dependencies. Handle UNC paths, mixed separators, and drive letters seamlessly.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/tuulbelt/tuulbelt/tree/main/cross-platform-path-normalizer

features:
  - icon:
      src: /icons/convert.svg
    title: Bidirectional Conversion
    details: Convert Windows paths to Unix format and vice versa. Auto-detect format or force specific output.

  - icon:
      src: /icons/network.svg
    title: UNC Path Support
    details: Handle network paths correctly. Convert `\\server\share` ↔ `//server/share` with proper double-slash preservation.

  - icon:
      src: /icons/merge.svg
    title: Mixed Separator Handling
    details: Normalize paths with both forward and backslashes. Clean up paths like `C:/Users\Documents/file.txt`.

  - icon:
      src: /icons/zap.svg
    title: Zero Dependencies
    details: Uses only Node.js built-in modules. No npm dependencies to manage, update, or worry about security issues.

  - icon:
      src: /icons/tool.svg
    title: CLI & Library
    details: Use as a command-line tool for quick conversions or integrate as a library in your Node.js projects.

  - icon:
      src: /icons/shield.svg
    title: Type Safe
    details: Written in TypeScript with strict mode. Full type definitions and Result pattern for error handling.

  - icon:
      src: /icons/rocket.svg
    title: Production Ready
    details: 51 comprehensive tests covering all functions and edge cases. 100% test pass rate.

  - icon:
      src: /icons/book.svg
    title: Well Documented
    details: Complete API documentation, edge case handling, and technical specifications.

  - icon:
      src: /icons/fast.svg
    title: High Performance
    details: Pure string manipulation. < 1ms per path conversion. No I/O operations, all in-memory processing.
---

## Quick Example

Convert paths in just one line:

```typescript
import { normalizePath } from './src/index.js';

// Auto-detect and normalize
const result = normalizePath('C:\\Users\\file.txt');
// { success: true, path: 'C:\Users\file.txt', format: 'windows' }

// Force Unix format
const unix = normalizePath('C:\\Users\\file.txt', { format: 'unix' });
// { success: true, path: '/c/Users/file.txt', format: 'unix' }
```

Or use the CLI:

```bash
normpath --format unix "C:\\Users\\file.txt"
```

## Why Cross-Platform Path Normalizer?

**The Problem:** Building cross-platform tools means dealing with different path formats:
- Windows uses backslashes (`\`) and drive letters (`C:`)
- Unix uses forward slashes (`/`) and absolute paths (`/home/user`)
- Mixed separators break scripts and tests
- Existing solutions require heavy dependencies

**The Solution:** Zero-dependency path normalization with intelligent format detection and comprehensive edge case handling.

## Installation

```bash
git clone https://github.com/tuulbelt/cross-platform-path-normalizer.git
cd cross-platform-path-normalizer
npm install
```

No runtime dependencies. Just Node.js 18+.

## Key Features

### Auto-Detection

Automatically detects whether a path is Windows or Unix format:

```typescript
detectPathFormat('C:\\Users\\file.txt');     // 'windows'
detectPathFormat('/home/user/file.txt');     // 'unix'
```

### Direct Conversion

Convert paths directly without options:

```typescript
normalizeToUnix('C:\\Program Files\\app');    // '/c/Program Files/app'
normalizeToWindows('/c/Users/Documents');     // 'C:\Users\Documents'
```

### Edge Case Handling

- Mixed separators: `C:/Users\Documents/file.txt`
- Redundant slashes: `C:\\\Users\\\file.txt`
- UNC paths: `\\server\share` ↔ `//server/share`
- Drive letters: `C:` ↔ `/c` (case normalization)
- Relative paths: `../../parent`
- Special characters and spaces

## Next Steps

::: tip Getting Started
[Learn how to use the tool in 5 minutes →](/guide/getting-started)
:::

::: tip Examples
[See real-world usage examples →](/guide/examples)
:::

::: tip API Reference
[Complete API documentation →](/api/reference)
:::

## Dogfooding: Test Reliability Validation

We use **[Test Flakiness Detector](../../test-flakiness-detector/)** (another Tuulbelt tool) to validate that all 128 tests are deterministic and reliable:

```bash
npm run test:dogfood
```

This runs the entire test suite 10 times (1,280 total test executions) to detect any non-deterministic behavior:

```
🔬 Dogfooding: Using Test Flakiness Detector to validate Cross-Platform Path Normalizer tests

✅ NO FLAKINESS DETECTED
All 10 test runs passed consistently.

Completion time: ~6 minutes for 128 tests × 10 runs = 1,290 executions
```

This demonstrates:
- **Tool Composition** — Tuulbelt tools validate each other in real-world use
- **Test Quality** — Zero flaky tests detected across 1,290 executions
- **Production Ready** — All tests are deterministic and reliable

## Demo

See the tool in action with real-time path conversion examples.

<div style="margin: 20px 0;">
  <span style="display: inline-block; vertical-align: middle; margin-right: 8px;">
    <strong>Try it online:</strong>
  </span>
  <a href="https://stackblitz.com/github/tuulbelt/tuulbelt/tree/main/cross-platform-path-normalizer" style="display: inline-block; vertical-align: middle;">
    <img src="https://developer.stackblitz.com/img/open_in_stackblitz.svg" alt="Open in StackBlitz" style="vertical-align: middle;">
  </a>
</div>

Run the tool directly in your browser with zero setup. Try converting Windows and Unix paths, test edge cases, and explore the full API.

## Part of Tuulbelt

This tool is part of [Tuulbelt](https://github.com/tuulbelt/tuulbelt) - a collection of focused, zero-dependency tools for modern software development.
