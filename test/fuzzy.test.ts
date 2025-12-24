/**
 * Fuzzy/Property-Based Tests for Cross-Platform Path Normalizer
 *
 * Property-based testing with random input generation to verify invariants
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePath, normalizeToUnix, normalizeToWindows, detectPathFormat } from '../src/index.js';

// Random string generator helpers
function randomChar(chars: string): string {
  return chars[Math.floor(Math.random() * chars.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomString(length: number, chars: string): string {
  return Array.from({ length }, () => randomChar(chars)).join('');
}

// Character sets for fuzzing
const ALPHANUMERIC = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const PATH_CHARS = ALPHANUMERIC + '-_. ';
const SPECIAL_CHARS = '!@#$%^&()[]{}';
const UNICODE_CHARS = '测试тестテスト🎉café';
const SEPARATORS = '/\\';
const DRIVE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

test('fuzzy - random path generation invariants', async (t) => {
  await t.test('should never crash on random input', () => {
    for (let i = 0; i < 100; i++) {
      const length = randomInt(1, 100);
      const randomPath = randomString(length, PATH_CHARS + SEPARATORS + SPECIAL_CHARS);

      // Should never throw
      assert.doesNotThrow(() => {
        normalizePath(randomPath);
      });

      assert.doesNotThrow(() => {
        normalizeToUnix(randomPath);
      });

      assert.doesNotThrow(() => {
        normalizeToWindows(randomPath);
      });

      assert.doesNotThrow(() => {
        detectPathFormat(randomPath);
      });
    }
  });

  await t.test('should handle random Unicode strings', () => {
    for (let i = 0; i < 50; i++) {
      const length = randomInt(5, 50);
      const randomPath = randomString(length, UNICODE_CHARS + PATH_CHARS + SEPARATORS);

      const result = normalizePath(randomPath);
      assert.strictEqual(result.success, true);
      assert.strictEqual(typeof result.path, 'string');
    }
  });

  await t.test('should handle random separator patterns', () => {
    for (let i = 0; i < 50; i++) {
      const segments = randomInt(1, 10);
      const parts = Array.from({ length: segments }, () =>
        randomString(randomInt(1, 15), PATH_CHARS)
      );

      // Join with random separators
      const randomSep = Math.random() > 0.5 ? '\\' : '/';
      const path = parts.join(randomSep);

      const unixResult = normalizeToUnix(path);
      const windowsResult = normalizeToWindows(path);

      // Unix should only have forward slashes
      assert(!unixResult.includes('\\') || unixResult.startsWith('//'),
        'Unix path should not have backslashes except UNC');

      // Windows should only have backslashes
      assert(!windowsResult.includes('/'),
        'Windows path should not have forward slashes');
    }
  });
});

test('fuzzy - round-trip conversion invariants', async (t) => {
  await t.test('Windows → Unix → Windows preserves structure', () => {
    for (let i = 0; i < 50; i++) {
      // Generate random Windows path
      const driveLetter = randomChar(DRIVE_LETTERS);
      const segments = randomInt(1, 5);
      const parts = Array.from({ length: segments }, () =>
        randomString(randomInt(3, 10), PATH_CHARS)
      );
      const windowsPath = `${driveLetter}:\\${parts.join('\\')}`;

      // Round trip
      const unix = normalizeToUnix(windowsPath);
      const backToWindows = normalizeToWindows(unix);

      // Should preserve drive letter and structure
      assert(backToWindows.startsWith(`${driveLetter}:`),
        `Drive letter ${driveLetter} not preserved`);

      // Path segments should be present (case-insensitive)
      for (const part of parts) {
        assert(backToWindows.toLowerCase().includes(part.toLowerCase()),
          `Segment "${part}" not preserved in round trip`);
      }
    }
  });

  await t.test('Unix → Windows → Unix preserves structure for drive paths', () => {
    for (let i = 0; i < 50; i++) {
      // Generate random Unix path with drive letter
      const driveLetter = randomChar(DRIVE_LETTERS).toLowerCase();
      const segments = randomInt(1, 5);
      const parts = Array.from({ length: segments }, () =>
        randomString(randomInt(3, 10), PATH_CHARS)
      );
      const unixPath = `/${driveLetter}/${parts.join('/')}`;

      // Round trip
      const windows = normalizeToWindows(unixPath);
      const backToUnix = normalizeToUnix(windows);

      // Should preserve drive letter and structure
      assert(backToUnix.startsWith(`/${driveLetter}`),
        `Drive letter /${driveLetter} not preserved`);

      // Path segments should be present
      for (const part of parts) {
        assert(backToUnix.includes(part),
          `Segment "${part}" not preserved in round trip`);
      }
    }
  });

  await t.test('Multiple round trips stabilize', () => {
    for (let i = 0; i < 20; i++) {
      // Random starting path
      const isWindows = Math.random() > 0.5;
      const segments = Array.from({ length: randomInt(2, 5) }, () =>
        randomString(randomInt(3, 8), ALPHANUMERIC)
      );

      let path = isWindows
        ? `C:\\${segments.join('\\')}`
        : `/${segments.join('/')}`;

      // Do 10 round trips
      let prev = path;
      for (let round = 0; round < 10; round++) {
        path = normalizeToUnix(path);
        path = normalizeToWindows(path);

        // After second round trip, should stabilize
        if (round >= 2) {
          assert.strictEqual(path, prev,
            'Path should stabilize after multiple round trips');
        }
        prev = path;
      }
    }
  });
});

test('fuzzy - format detection invariants', async (t) => {
  await t.test('backslash always detected as Windows', () => {
    for (let i = 0; i < 50; i++) {
      const before = randomString(randomInt(1, 20), PATH_CHARS);
      const after = randomString(randomInt(1, 20), PATH_CHARS);
      const path = `${before}\\${after}`;

      const format = detectPathFormat(path);
      assert.strictEqual(format, 'windows',
        `Path with backslash should be detected as Windows: ${path}`);
    }
  });

  await t.test('drive letter at start detected as Windows', () => {
    for (let i = 0; i < 50; i++) {
      const driveLetter = randomChar(DRIVE_LETTERS);
      const rest = randomString(randomInt(5, 20), PATH_CHARS + '/');
      const path = `${driveLetter}:${rest}`;

      const format = detectPathFormat(path);
      assert.strictEqual(format, 'windows',
        `Path with drive letter should be detected as Windows: ${path}`);
    }
  });

  await t.test('UNC paths detected as Windows', () => {
    for (let i = 0; i < 30; i++) {
      const server = randomString(randomInt(3, 10), ALPHANUMERIC);
      const share = randomString(randomInt(3, 10), ALPHANUMERIC);
      const path = `\\\\${server}\\${share}`;

      const format = detectPathFormat(path);
      assert.strictEqual(format, 'windows',
        `UNC path should be detected as Windows: ${path}`);
    }
  });

  await t.test('paths without backslashes or drive letters default to Unix', () => {
    for (let i = 0; i < 50; i++) {
      const segments = Array.from({ length: randomInt(1, 5) }, () =>
        randomString(randomInt(3, 10), ALPHANUMERIC)
      );
      const path = segments.join('/');

      const format = detectPathFormat(path);
      assert.strictEqual(format, 'unix',
        `Path without Windows indicators should be Unix: ${path}`);
    }
  });
});

test('fuzzy - separator normalization invariants', async (t) => {
  await t.test('Unix output never contains backslashes (except UNC)', () => {
    for (let i = 0; i < 100; i++) {
      const length = randomInt(5, 50);
      const randomPath = randomString(length, PATH_CHARS + SEPARATORS);

      const unix = normalizeToUnix(randomPath);

      if (!unix.startsWith('//')) {
        assert(!unix.includes('\\'),
          `Unix path should not contain backslashes: ${unix}`);
      }
    }
  });

  await t.test('Windows output never contains forward slashes', () => {
    for (let i = 0; i < 100; i++) {
      const length = randomInt(5, 50);
      const randomPath = randomString(length, PATH_CHARS + SEPARATORS);

      const windows = normalizeToWindows(randomPath);

      assert(!windows.includes('/'),
        `Windows path should not contain forward slashes: ${windows}`);
    }
  });

  await t.test('normalizePath result matches direct conversion functions', () => {
    for (let i = 0; i < 50; i++) {
      const randomPath = randomString(randomInt(5, 30), PATH_CHARS + SEPARATORS);

      // Using normalizePath with explicit format
      const unixViaOptions = normalizePath(randomPath, { format: 'unix' });
      const windowsViaOptions = normalizePath(randomPath, { format: 'windows' });

      // Using direct functions
      const unixDirect = normalizeToUnix(randomPath);
      const windowsDirect = normalizeToWindows(randomPath);

      assert.strictEqual(unixViaOptions.path, unixDirect,
        'normalizePath with format:unix should match normalizeToUnix');
      assert.strictEqual(windowsViaOptions.path, windowsDirect,
        'normalizePath with format:windows should match normalizeToWindows');
    }
  });
});

test('fuzzy - error handling invariants', async (t) => {
  await t.test('invalid types always return error', () => {
    const invalidInputs = [
      null,
      undefined,
      123,
      true,
      false,
      {},
      [],
      Symbol('test'),
      () => {},
    ];

    for (const input of invalidInputs) {
      const result = normalizePath(input as any);
      assert.strictEqual(result.success, false,
        `Invalid input should return error: ${typeof input}`);
      assert(result.error?.includes('must be a string'),
        `Error should mention string requirement`);
    }
  });

  await t.test('empty and whitespace strings always return error', () => {
    const emptyStrings = [
      '',
      ' ',
      '  ',
      '\t',
      '\n',
      '   \t\n   ',
    ];

    for (const input of emptyStrings) {
      const result = normalizePath(input);
      assert.strictEqual(result.success, false,
        `Empty/whitespace should return error: "${input}"`);
      assert(result.error?.includes('cannot be empty'),
        `Error should mention empty path`);
    }
  });

  await t.test('success always means non-empty path', () => {
    for (let i = 0; i < 100; i++) {
      const randomPath = randomString(randomInt(1, 50), PATH_CHARS + SEPARATORS);

      const result = normalizePath(randomPath);

      if (result.success) {
        assert(result.path.length > 0,
          'Successful result must have non-empty path');
        assert.strictEqual(result.error, undefined,
          'Successful result should not have error');
      } else {
        assert.strictEqual(result.path, '',
          'Failed result should have empty path');
        assert(result.error && result.error.length > 0,
          'Failed result must have error message');
      }
    }
  });
});

test('fuzzy - performance invariants', async (t) => {
  await t.test('large batch of conversions completes in reasonable time', () => {
    const paths = Array.from({ length: 1000 }, () =>
      randomString(randomInt(10, 100), PATH_CHARS + SEPARATORS)
    );

    const start = performance.now();

    for (const path of paths) {
      normalizeToUnix(path);
      normalizeToWindows(path);
    }

    const elapsed = performance.now() - start;

    assert(elapsed < 1000,
      `1000 conversions should complete in < 1s, took ${elapsed}ms`);
  });

  await t.test('very long paths process without timeout', () => {
    for (let i = 0; i < 10; i++) {
      // Generate path up to 5000 characters
      const longPath = randomString(randomInt(1000, 5000), PATH_CHARS + SEPARATORS);

      const start = performance.now();
      const result = normalizePath(longPath);
      const elapsed = performance.now() - start;

      assert.strictEqual(result.success, true,
        'Very long path should process successfully');
      assert(elapsed < 100,
        `Long path processing should be fast, took ${elapsed}ms`);
    }
  });
});
