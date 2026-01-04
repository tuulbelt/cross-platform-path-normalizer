#!/usr/bin/env node --import tsx
/**
 * Cross-Platform Path Normalizer Benchmarks
 *
 * Measures performance of core operations using tatami-ng for statistical rigor.
 *
 * Run: npm run bench
 *
 * See: /docs/BENCHMARKING_STANDARDS.md
 */

import { bench, baseline, group, run } from 'tatami-ng';
import { normalizePath, toUnix, toWindows, isAbsolute } from '../src/index.ts';

// Prevent dead code elimination
let result: string | boolean;

// Sample paths for benchmarking
const unixPath = '/home/user/projects/tuulbelt/src/index.ts';
const windowsPath = 'C:\\Users\\user\\projects\\tuulbelt\\src\\index.ts';
const mixedPath = 'C:/Users/user\\projects/tuulbelt\\src/index.ts';
const relativePath = '../../../src/utils/helper.ts';
const deepPath = '/a/b/c/d/e/f/g/h/i/j/k/l/m/n/o/p/q/r/s/t/file.txt';

// ============================================================================
// Core Operations Benchmarks
// ============================================================================

group('Path Normalization', () => {
  baseline('normalize: Unix path', () => {
    result = normalizePath(unixPath);
  });

  bench('normalize: Windows path', () => {
    result = normalizePath(windowsPath);
  });

  bench('normalize: mixed separators', () => {
    result = normalizePath(mixedPath);
  });

  bench('normalize: relative path', () => {
    result = normalizePath(relativePath);
  });

  bench('normalize: deep path (20 segments)', () => {
    result = normalizePath(deepPath);
  });
});

group('Format Conversion', () => {
  baseline('toUnix: Windows path', () => {
    result = toUnix(windowsPath);
  });

  bench('toWindows: Unix path', () => {
    result = toWindows(unixPath);
  });

  bench('toUnix: already Unix', () => {
    result = toUnix(unixPath);
  });

  bench('toWindows: already Windows', () => {
    result = toWindows(windowsPath);
  });
});

group('Path Detection', () => {
  baseline('isAbsolute: Unix absolute', () => {
    result = isAbsolute(unixPath);
  });

  bench('isAbsolute: Windows absolute', () => {
    result = isAbsolute(windowsPath);
  });

  bench('isAbsolute: relative path', () => {
    result = isAbsolute(relativePath);
  });
});

// ============================================================================
// Run Benchmarks
// ============================================================================

await run({
  units: false,
  silent: false,
  json: false,
});
