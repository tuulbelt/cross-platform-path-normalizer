/**
 * Performance Tests for Cross-Platform Path Normalizer
 *
 * Benchmarks and performance validation
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePath, normalizeToUnix, normalizeToWindows, detectPathFormat } from '../src/index.js';

test('performance - execution speed', async (t) => {
  await t.test('should normalize 1000 paths in under 100ms', () => {
    const paths = Array.from({ length: 1000 }, (_, i) => `C:\\Users\\user${i}\\Documents\\file.txt`);

    const start = performance.now();

    for (const path of paths) {
      normalizePath(path);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 100, `Took ${elapsed}ms, should be < 100ms`);
  });

  await t.test('should convert 10000 paths in under 500ms', () => {
    const paths = Array.from({ length: 10000 }, (_, i) => `/home/user${i}/project/src/file.ts`);

    const start = performance.now();

    for (const path of paths) {
      normalizeToWindows(path);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 500, `Took ${elapsed}ms, should be < 500ms`);
  });

  await t.test('should handle large batch conversions efficiently', () => {
    const paths = Array.from({ length: 5000 }, (_, i) =>
      i % 2 === 0 ? `C:\\Windows\\System32\\file${i}.dll` : `/usr/local/bin/app${i}`
    );

    const start = performance.now();

    for (const path of paths) {
      normalizeToUnix(path);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 250, `Took ${elapsed}ms, should be < 250ms`);
  });
});

test('performance - detection speed', async (t) => {
  await t.test('should detect format for 10000 paths in under 50ms', () => {
    const paths = Array.from({ length: 10000 }, (_, i) =>
      i % 2 === 0 ? `C:\\path${i}\\file.txt` : `/path${i}/file.txt`
    );

    const start = performance.now();

    for (const path of paths) {
      detectPathFormat(path);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 50, `Took ${elapsed}ms, should be < 50ms`);
  });

  await t.test('should detect UNC paths quickly', () => {
    const paths = Array.from({ length: 1000 }, (_, i) => `\\\\server${i}\\share\\folder`);

    const start = performance.now();

    for (const path of paths) {
      const format = detectPathFormat(path);
      assert.strictEqual(format, 'windows');
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 20, `Took ${elapsed}ms, should be < 20ms`);
  });
});

test('performance - long paths', async (t) => {
  await t.test('should handle very long paths efficiently', () => {
    // Create a deeply nested path (260 characters - Windows MAX_PATH)
    const longPath = 'C:\\' + 'a\\'.repeat(125) + 'file.txt';

    const start = performance.now();

    for (let i = 0; i < 1000; i++) {
      normalizeToUnix(longPath);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 100, `Took ${elapsed}ms, should be < 100ms`);
  });

  await t.test('should handle paths beyond MAX_PATH', () => {
    // Create path longer than Windows MAX_PATH (260 chars)
    const veryLongPath = 'C:\\' + 'very-long-directory-name\\'.repeat(20) + 'file.txt';

    assert(veryLongPath.length > 260, 'Path should be longer than MAX_PATH');

    const start = performance.now();

    for (let i = 0; i < 500; i++) {
      const result = normalizePath(veryLongPath, { format: 'unix' });
      assert.strictEqual(result.success, true);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 100, `Took ${elapsed}ms, should be < 100ms`);
  });
});

test('performance - memory efficiency', async (t) => {
  await t.test('should not leak memory with repeated operations', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    // Perform 100k operations
    for (let i = 0; i < 100000; i++) {
      const path = i % 2 === 0 ? `C:\\path\\file${i}.txt` : `/path/file${i}.txt`;
      normalizePath(path);
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB

    // Should not increase memory by more than 10MB for 100k operations
    assert(memoryIncrease < 10, `Memory increased by ${memoryIncrease}MB, should be < 10MB`);
  });
});

test('performance - concurrent operations', async (t) => {
  await t.test('should handle parallel path normalization', async () => {
    const paths = Array.from({ length: 1000 }, (_, i) =>
      `C:\\Users\\user${i}\\Documents\\project\\src\\index.ts`
    );

    const start = performance.now();

    // Simulate concurrent operations with Promise.all
    await Promise.all(
      paths.map(path =>
        Promise.resolve(normalizePath(path, { format: 'unix' }))
      )
    );

    const elapsed = performance.now() - start;

    assert(elapsed < 200, `Took ${elapsed}ms, should be < 200ms`);
  });
});

test('performance - edge case handling', async (t) => {
  await t.test('should handle mixed slashes efficiently', () => {
    const paths = Array.from({ length: 1000 }, (_, i) =>
      `C:/Users\\Documents/Projects\\file${i}.txt`
    );

    const start = performance.now();

    for (const path of paths) {
      normalizeToWindows(path);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 50, `Took ${elapsed}ms, should be < 50ms`);
  });

  await t.test('should handle redundant slashes efficiently', () => {
    const paths = Array.from({ length: 1000 }, (_, i) =>
      `C:\\\\\\Users\\\\\\Documents\\\\\\file${i}.txt`
    );

    const start = performance.now();

    for (const path of paths) {
      const result = normalizeToUnix(path);
      assert(!result.includes('//'), 'Should remove redundant slashes (except UNC)');
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 50, `Took ${elapsed}ms, should be < 50ms`);
  });
});
