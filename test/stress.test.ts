/**
 * Stress Tests for Cross-Platform Path Normalizer
 *
 * Edge cases, extreme inputs, and boundary conditions
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePath, normalizeToUnix, normalizeToWindows, detectPathFormat } from '../src/index.js';

test('stress - extreme path lengths', async (t) => {
  await t.test('should handle extremely long paths (10000+ chars)', () => {
    const longPath = 'C:\\' + 'a\\'.repeat(5000) + 'file.txt';

    const result = normalizeToUnix(longPath);
    assert.strictEqual(typeof result, 'string');
    assert(result.length > 10000);
    assert(result.startsWith('/c/'));
  });

  await t.test('should handle paths exceeding typical OS limits', () => {
    // Windows MAX_PATH is 260, Linux PATH_MAX is 4096
    const extremePath = '/home/' + 'x/'.repeat(2000) + 'file.txt';

    const result = normalizeToWindows(extremePath);
    assert.strictEqual(typeof result, 'string');
    assert(result.length > 4000);
  });

  await t.test('should handle single character paths', () => {
    assert.strictEqual(normalizeToUnix('C'), 'C');
    assert.strictEqual(normalizeToUnix('/'), '/');
    assert.strictEqual(normalizeToWindows('x'), 'x');
  });
});

test('stress - special characters', async (t) => {
  await t.test('should handle paths with unicode characters', () => {
    const unicodePaths = [
      'C:\\Users\\用户\\Documents\\文件.txt',
      '/home/пользователь/документы/файл.txt',
      'C:\\ユーザー\\ドキュメント\\ファイル.txt',
      '/home/utilisateur/documents/fichier-café.txt',
      'C:\\Users\\שם\\Documents\\קובץ.txt',
    ];

    for (const path of unicodePaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
      assert(result.path.length > 0);
    }
  });

  await t.test('should handle paths with emojis', () => {
    const emojiPaths = [
      'C:\\Users\\🎉\\Documents\\file.txt',
      '/home/user/project-🚀/src/index.ts',
      'C:\\Program Files\\App 💻\\config.json',
    ];

    for (const path of emojiPaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
      assert(result.path.includes('🎉') || result.path.includes('🚀') || result.path.includes('💻'));
    }
  });

  await t.test('should handle paths with special ASCII characters', () => {
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', ',', '.'];

    for (const char of specialChars) {
      const path = `C:\\Users\\user\\file${char}name.txt`;
      const result = normalizeToUnix(path);
      assert(result.includes(char), `Should preserve ${char}`);
    }
  });

  await t.test('should handle paths with spaces in multiple places', () => {
    const spacedPaths = [
      'C:\\Program Files\\My App\\Sub Folder\\file name.txt',
      '/ home / user / my folder / file .txt',
      'C:\\  Multiple  Spaces  \\file.txt',
    ];

    for (const path of spacedPaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
    }
  });
});

test('stress - redundant and mixed separators', async (t) => {
  await t.test('should handle extreme redundant slashes', () => {
    const paths = [
      'C:\\\\\\\\\\\\Users\\\\\\\\Documents',
      '//////home//////user//////file.txt',
      'C://///Users/////Documents',
      '\\\\\\\\\\\\server\\\\\\\\\\\\share',
    ];

    for (const path of paths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
      // UNC paths should preserve double-slash/backslash
      if (!path.startsWith('\\\\\\\\')) {
        assert(!result.path.includes('//') && !result.path.includes('\\\\') || path.startsWith('\\\\\\\\'));
      }
    }
  });

  await t.test('should handle completely mixed separators', () => {
    const mixedPaths = [
      'C:/Users\\Documents/Projects\\src/index.ts',
      '/home\\user/project\\src\\file.txt',
      'C:\\Program Files/App\\config/settings.json',
    ];

    for (const path of mixedPaths) {
      const result = normalizeToWindows(path);
      assert(!result.includes('/'), 'Windows path should not contain forward slashes');

      const resultUnix = normalizeToUnix(path);
      assert(!resultUnix.includes('\\') || resultUnix.startsWith('//'), 'Unix path should not contain backslashes except UNC');
    }
  });

  await t.test('should handle alternating separators', () => {
    const alternating = 'C:/Users\\Documents/Projects\\src/index.ts';
    const result = normalizeToUnix(alternating);

    assert(!result.includes('\\'), 'Should normalize all separators');
    assert.strictEqual(result, '/c/Users/Documents/Projects/src/index.ts');
  });
});

test('stress - malformed paths', async (t) => {
  await t.test('should handle paths with only separators', () => {
    const separatorPaths = ['/', '\\', '//', '\\\\', '///', '\\\\\\'];

    for (const path of separatorPaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
    }
  });

  await t.test('should handle drive letters without colons', () => {
    // These are technically malformed but should still process
    const nocolonPaths = ['C', 'D', 'Z'];

    for (const path of nocolonPaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
    }
  });

  await t.test('should handle multiple drive letters', () => {
    const doubleDrive = 'C:D:\\Users\\file.txt';
    const result = normalizePath(doubleDrive);
    assert.strictEqual(result.success, true);
  });

  await t.test('should handle trailing separators', () => {
    const trailingPaths = [
      'C:\\Users\\Documents\\',
      '/home/user/',
      'C:\\Users\\\\\\',
      '/home////',
    ];

    for (const path of trailingPaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, true);
    }
  });
});

test('stress - UNC path edge cases', async (t) => {
  await t.test('should handle UNC paths with many segments', () => {
    const deepUNC = '\\\\server\\share\\' + 'folder\\'.repeat(100) + 'file.txt';

    const result = normalizeToUnix(deepUNC);
    assert(result.startsWith('//server/share/'));
    assert(result.includes('file.txt'));
  });

  await t.test('should handle UNC paths with special characters', () => {
    const specialUNC = [
      '\\\\server-1\\share_name\\folder',
      '\\\\192.168.1.1\\share\\folder',
      '\\\\server.domain.com\\share\\folder',
    ];

    for (const path of specialUNC) {
      const result = normalizeToUnix(path);
      assert(result.startsWith('//'));
      assert.strictEqual(detectPathFormat(path), 'windows');
    }
  });

  await t.test('should distinguish UNC from regular paths starting with backslashes', () => {
    const uncPath = '\\\\server\\share';
    const regularPath = '\\folder\\file.txt';

    assert.strictEqual(detectPathFormat(uncPath), 'windows');
    assert.strictEqual(detectPathFormat(regularPath), 'windows');

    const uncResult = normalizeToUnix(uncPath);
    const regularResult = normalizeToUnix(regularPath);

    assert(uncResult.startsWith('//'), 'UNC should start with //');
    assert(!regularResult.startsWith('//'), 'Regular path should not start with //');
  });
});

test('stress - boundary inputs', async (t) => {
  await t.test('should handle whitespace-only paths', () => {
    const whitespacePaths = ['   ', '\t\t', '\n\n', '  \t\n  '];

    for (const path of whitespacePaths) {
      const result = normalizePath(path);
      assert.strictEqual(result.success, false);
      assert(result.error?.includes('empty'));
    }
  });

  await t.test('should handle paths with nulls and undefined', () => {
    const result1 = normalizePath(null as any);
    assert.strictEqual(result1.success, false);

    const result2 = normalizePath(undefined as any);
    assert.strictEqual(result2.success, false);
  });

  await t.test('should handle paths with numbers', () => {
    const result = normalizePath(123 as any);
    assert.strictEqual(result.success, false);
    assert(result.error?.includes('must be a string'));
  });

  await t.test('should handle paths with objects', () => {
    const result = normalizePath({ path: 'C:\\Users' } as any);
    assert.strictEqual(result.success, false);
  });

  await t.test('should handle paths with arrays', () => {
    const result = normalizePath(['C:\\Users'] as any);
    assert.strictEqual(result.success, false);
  });
});

test('stress - format detection edge cases', async (t) => {
  await t.test('should handle ambiguous paths', () => {
    // Paths that could be either format
    const ambiguousPaths = [
      'file.txt',
      'folder/file.txt',
      '../relative/path',
      './current/dir',
    ];

    for (const path of ambiguousPaths) {
      const format = detectPathFormat(path);
      // These default to unix
      assert.strictEqual(format, 'unix');
    }
  });

  await t.test('should handle paths with drive letters in middle', () => {
    const weirdPath = '/home/user/C:/file.txt';
    const format = detectPathFormat(weirdPath);
    // Drive letter not at start, so detected as unix (has forward slashes)
    assert.strictEqual(format, 'unix');
  });

  await t.test('should prioritize backslash detection', () => {
    const mixedPath = 'C:/Users\\Documents';
    const format = detectPathFormat(mixedPath);
    assert.strictEqual(format, 'windows'); // Has backslash
  });
});

test('stress - round-trip conversions', async (t) => {
  await t.test('should survive multiple round trips', () => {
    const originalWindows = 'C:\\Users\\Documents\\file.txt';

    let current = originalWindows;
    for (let i = 0; i < 10; i++) {
      current = normalizeToUnix(current);
      current = normalizeToWindows(current);
    }

    assert.strictEqual(current, originalWindows);
  });

  await t.test('should preserve UNC paths through round trips', () => {
    const originalUNC = '\\\\server\\share\\folder';

    let current = originalUNC;
    for (let i = 0; i < 10; i++) {
      current = normalizeToUnix(current);
      current = normalizeToWindows(current);
    }

    assert.strictEqual(current, originalUNC);
  });
});
