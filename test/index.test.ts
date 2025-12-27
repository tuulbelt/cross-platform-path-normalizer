import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectPathFormat,
  normalizeToUnix,
  normalizeToWindows,
  normalizePath,
  type NormalizeOptions,
  type NormalizeResult,
} from '../src/index.js';

describe('detectPathFormat', () => {
  test('detects Windows path with drive letter', () => {
    assert.strictEqual(detectPathFormat('C:\\Users\\file.txt'), 'windows');
    assert.strictEqual(detectPathFormat('D:\\Projects\\app'), 'windows');
    assert.strictEqual(detectPathFormat('Z:\\data'), 'windows');
  });

  test('detects Windows path with backslashes', () => {
    assert.strictEqual(detectPathFormat('folder\\subfolder\\file.txt'), 'windows');
    assert.strictEqual(detectPathFormat('..\\parent\\file.txt'), 'windows');
  });

  test('detects UNC paths as Windows', () => {
    assert.strictEqual(detectPathFormat('\\\\server\\share\\file.txt'), 'windows');
    assert.strictEqual(detectPathFormat('\\\\nas\\data'), 'windows');
  });

  test('detects Unix paths', () => {
    assert.strictEqual(detectPathFormat('/home/user/file.txt'), 'unix');
    assert.strictEqual(detectPathFormat('/usr/local/bin'), 'unix');
    assert.strictEqual(detectPathFormat('./relative/path'), 'unix');
    assert.strictEqual(detectPathFormat('../parent/file'), 'unix');
  });

  test('detects relative paths without slashes as unix', () => {
    assert.strictEqual(detectPathFormat('file.txt'), 'unix');
    assert.strictEqual(detectPathFormat('folder'), 'unix');
  });

  test('handles edge cases', () => {
    assert.strictEqual(detectPathFormat(''), 'unix');
    assert.strictEqual(detectPathFormat(' '), 'unix');
  });
});

describe('normalizeToUnix', () => {
  test('converts Windows path with drive letter to Unix', () => {
    assert.strictEqual(normalizeToUnix('C:\\Users\\file.txt'), '/c/Users/file.txt');
    assert.strictEqual(normalizeToUnix('D:\\Projects\\app'), '/d/Projects/app');
  });

  test('converts Windows backslashes to forward slashes', () => {
    assert.strictEqual(normalizeToUnix('folder\\subfolder\\file.txt'), 'folder/subfolder/file.txt');
  });

  test('converts UNC paths to Unix format', () => {
    assert.strictEqual(normalizeToUnix('\\\\server\\share\\file.txt'), '//server/share/file.txt');
  });

  test('handles Unix paths (no-op)', () => {
    assert.strictEqual(normalizeToUnix('/home/user/file.txt'), '/home/user/file.txt');
    assert.strictEqual(normalizeToUnix('./relative/path'), './relative/path');
  });

  test('removes redundant slashes', () => {
    assert.strictEqual(normalizeToUnix('C:\\\\Users\\\\\\file.txt'), '/c/Users/file.txt');
    assert.strictEqual(normalizeToUnix('//home///user////file.txt'), '/home/user/file.txt');
  });

  test('handles empty string', () => {
    assert.strictEqual(normalizeToUnix(''), '');
  });

  test('handles mixed slashes', () => {
    assert.strictEqual(normalizeToUnix('C:\\Users/Documents\\file.txt'), '/c/Users/Documents/file.txt');
  });

  test('preserves case in path components', () => {
    assert.strictEqual(normalizeToUnix('C:\\MyFolder\\MyFile.TXT'), '/c/MyFolder/MyFile.TXT');
  });

  test('handles lowercase and uppercase drive letters', () => {
    assert.strictEqual(normalizeToUnix('c:\\users\\file.txt'), '/c/users/file.txt');
    assert.strictEqual(normalizeToUnix('Z:\\DATA'), '/z/DATA');
  });
});

describe('normalizeToWindows', () => {
  test('converts Unix path with drive letter to Windows', () => {
    assert.strictEqual(normalizeToWindows('/c/Users/file.txt'), 'C:\\Users\\file.txt');
    assert.strictEqual(normalizeToWindows('/d/Projects/app'), 'D:\\Projects\\app');
  });

  test('converts Unix forward slashes to backslashes', () => {
    assert.strictEqual(normalizeToWindows('folder/subfolder/file.txt'), 'folder\\subfolder\\file.txt');
  });

  test('converts UNC paths to Windows format', () => {
    assert.strictEqual(normalizeToWindows('//server/share/file.txt'), '\\\\server\\share\\file.txt');
  });

  test('handles Windows paths (no-op)', () => {
    assert.strictEqual(normalizeToWindows('C:\\Users\\file.txt'), 'C:\\Users\\file.txt');
  });

  test('removes redundant slashes', () => {
    assert.strictEqual(normalizeToWindows('/c//Users///file.txt'), 'C:\\Users\\file.txt');
    assert.strictEqual(normalizeToWindows('C:\\\\Users\\\\\\file.txt'), 'C:\\Users\\file.txt');
  });

  test('handles empty string', () => {
    assert.strictEqual(normalizeToWindows(''), '');
  });

  test('handles mixed slashes', () => {
    assert.strictEqual(normalizeToWindows('/c/Users\\Documents/file.txt'), 'C:\\Users\\Documents\\file.txt');
  });

  test('preserves case in path components except drive letter', () => {
    assert.strictEqual(normalizeToWindows('/c/MyFolder/MyFile.TXT'), 'C:\\MyFolder\\MyFile.TXT');
  });

  test('handles lowercase and uppercase drive letters in Unix format', () => {
    assert.strictEqual(normalizeToWindows('/c/users/file.txt'), 'C:\\users\\file.txt');
    assert.strictEqual(normalizeToWindows('/z/DATA'), 'Z:\\DATA');
  });

  test('preserves UNC path double backslash', () => {
    assert.strictEqual(normalizeToWindows('//server///share////file.txt'), '\\\\server\\share\\file.txt');
  });
});

describe('normalizePath', () => {
  describe('auto format detection', () => {
    test('auto-detects Windows path and normalizes', () => {
      const result = normalizePath('C:\\Users\\file.txt', { format: 'auto' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, 'C:\\Users\\file.txt');
      assert.strictEqual(result.format, 'windows');
    });

    test('auto-detects Unix path and normalizes', () => {
      const result = normalizePath('/home/user/file.txt', { format: 'auto' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, '/home/user/file.txt');
      assert.strictEqual(result.format, 'unix');
    });

    test('defaults to auto when format not specified', () => {
      const result = normalizePath('C:\\Users\\file.txt');

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.format, 'windows');
    });
  });

  describe('explicit format conversion', () => {
    test('converts Windows path to Unix format', () => {
      const result = normalizePath('C:\\Users\\file.txt', { format: 'unix' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, '/c/Users/file.txt');
      assert.strictEqual(result.format, 'unix');
    });

    test('converts Unix path to Windows format', () => {
      const result = normalizePath('/home/user/file.txt', { format: 'windows' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, 'home\\user\\file.txt');
      assert.strictEqual(result.format, 'windows');
    });

    test('normalizes Windows path to Windows format', () => {
      const result = normalizePath('C:\\Users\\\\file.txt', { format: 'windows' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, 'C:\\Users\\file.txt');
      assert.strictEqual(result.format, 'windows');
    });

    test('normalizes Unix path to Unix format', () => {
      const result = normalizePath('/home///user//file.txt', { format: 'unix' });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, '/home/user/file.txt');
      assert.strictEqual(result.format, 'unix');
    });
  });

  describe('error handling', () => {
    test('returns error for non-string input', () => {
      // @ts-expect-error Testing invalid input
      const result = normalizePath(123);

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.path, '');
      assert.strictEqual(result.error, 'Path must be a string');
    });

    test('returns error for null input', () => {
      // @ts-expect-error Testing invalid input
      const result = normalizePath(null);

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Path must be a string');
    });

    test('returns error for undefined input', () => {
      // @ts-expect-error Testing invalid input
      const result = normalizePath(undefined);

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Path must be a string');
    });

    test('returns error for empty string', () => {
      const result = normalizePath('');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Path cannot be empty');
    });

    test('returns error for whitespace-only string', () => {
      const result = normalizePath('   ');

      assert.strictEqual(result.success, false);
      assert.strictEqual(result.error, 'Path cannot be empty');
    });
  });

  describe('options', () => {
    test('accepts empty options', () => {
      const result = normalizePath('/home/user/file.txt', {});

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, '/home/user/file.txt');
    });

    test('accepts verbose option', () => {
      const result = normalizePath('/home/user/file.txt', { verbose: true });

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.path, '/home/user/file.txt');
    });
  });
});

describe('NormalizeResult type', () => {
  test('has correct shape on success', () => {
    const result: NormalizeResult = normalizePath('/home/user/file.txt');

    assert('success' in result);
    assert('path' in result);
    assert('format' in result);
    assert.strictEqual(typeof result.success, 'boolean');
    assert.strictEqual(typeof result.path, 'string');
    assert.strictEqual(typeof result.format, 'string');
  });

  test('has correct shape on failure', () => {
    // @ts-expect-error Testing invalid input
    const result: NormalizeResult = normalizePath(null);

    assert('success' in result);
    assert('path' in result);
    assert('format' in result);
    assert('error' in result);
    assert.strictEqual(typeof result.error, 'string');
  });
});

describe('edge cases and special scenarios', () => {
  test('handles relative paths with parent references', () => {
    assert.strictEqual(normalizeToUnix('..\\..\\parent'), '../../parent');
    assert.strictEqual(normalizeToWindows('../../parent'), '..\\..\\parent');
  });

  test('handles current directory references', () => {
    assert.strictEqual(normalizeToUnix('.\\current'), './current');
    assert.strictEqual(normalizeToWindows('./current'), '.\\current');
  });

  test('handles paths with spaces', () => {
    assert.strictEqual(normalizeToUnix('C:\\Program Files\\app'), '/c/Program Files/app');
    assert.strictEqual(normalizeToWindows('/program files/app'), 'program files\\app');
  });

  test('handles paths with special characters', () => {
    assert.strictEqual(normalizeToUnix('C:\\Users\\file@#$.txt'), '/c/Users/file@#$.txt');
    assert.strictEqual(normalizeToWindows('/users/file@#$.txt'), 'users\\file@#$.txt');
  });

  test('handles very long paths', () => {
    const longPath = 'C:\\' + 'folder\\'.repeat(50) + 'file.txt';
    const result = normalizeToUnix(longPath);
    assert(result.startsWith('/c/'));
    assert(result.endsWith('/file.txt'));
    assert.strictEqual(result.split('/').length - 1, 52); // /c + 50 folders + file.txt
  });

  test('handles single character paths', () => {
    assert.strictEqual(normalizeToUnix('a'), 'a');
    assert.strictEqual(normalizeToWindows('a'), 'a');
  });

  test('handles root paths', () => {
    assert.strictEqual(normalizeToUnix('/'), '/');
    assert.strictEqual(normalizeToWindows('C:\\'), 'C:\\');
  });
});

describe('integration tests', () => {
  test('round-trip Windows -> Unix -> Windows preserves meaning', () => {
    const original = 'C:\\Users\\Documents\\file.txt';
    const toUnix = normalizeToUnix(original);
    const backToWindows = normalizeToWindows(toUnix);

    assert.strictEqual(backToWindows, 'C:\\Users\\Documents\\file.txt');
  });

  test('round-trip Unix -> Windows -> Unix preserves meaning for drive paths', () => {
    const original = '/c/Users/Documents/file.txt';
    const toWindows = normalizeToWindows(original);
    const backToUnix = normalizeToUnix(toWindows);

    assert.strictEqual(backToUnix, '/c/Users/Documents/file.txt');
  });

  test('handles mixed format paths consistently', () => {
    const mixedPath = 'C:/Users\\Documents/file.txt';
    const unixResult = normalizeToUnix(mixedPath);
    const windowsResult = normalizeToWindows(mixedPath);

    assert.strictEqual(unixResult, '/c/Users/Documents/file.txt');
    assert.strictEqual(windowsResult, 'C:\\Users\\Documents\\file.txt');
  });
});

// ============================================================================
// Security Tests - Input Handling
// ============================================================================

describe('security - malicious input handling', () => {
  test('handles null bytes in path without crashing', () => {
    // Null bytes could be used for path truncation attacks
    const pathWithNull = 'C:\\Users\\file\x00.txt';

    // Should not throw - graceful handling
    assert.doesNotThrow(() => normalizeToUnix(pathWithNull));
    assert.doesNotThrow(() => normalizeToWindows(pathWithNull));
  });

  test('handles control characters in path', () => {
    // Control characters could cause issues in some systems
    const pathWithControl = 'C:\\Users\\file\x1b[31m.txt';

    assert.doesNotThrow(() => normalizeToUnix(pathWithControl));
    assert.doesNotThrow(() => normalizeToWindows(pathWithControl));
  });

  test('handles extremely long paths', () => {
    // Very long paths (10,000+ characters) should not cause stack overflow
    const longPath = 'C:\\' + 'a'.repeat(10000) + '\\file.txt';

    assert.doesNotThrow(() => normalizeToUnix(longPath));
    assert.doesNotThrow(() => normalizeToWindows(longPath));

    // Result should be properly formed
    const result = normalizeToUnix(longPath);
    assert(result.startsWith('/c/'));
    assert(result.endsWith('/file.txt'));
  });

  test('handles path traversal sequences (does not sanitize - by design)', () => {
    // Path normalizer transforms paths, does NOT sanitize them
    // This is documented behavior - sanitization is caller responsibility
    const traversalPath = 'C:\\Users\\..\\..\\Windows\\System32';
    const unixResult = normalizeToUnix(traversalPath);

    // Traversal sequences are preserved (as expected)
    assert(unixResult.includes('..'));
    assert.strictEqual(unixResult, '/c/Users/../../Windows/System32');
  });

  test('handles UNC path injection attempts', () => {
    // UNC paths (\\\\server\\share) should be handled consistently
    const uncPath = '\\\\malicious-server\\share\\file.txt';
    const result = normalizeToUnix(uncPath);

    // Should convert to Unix UNC format
    assert.strictEqual(result, '//malicious-server/share/file.txt');
  });

  test('handles paths with URL-like patterns', () => {
    // Paths that look like URLs should be treated as paths
    const urlLikePath = 'C:\\http:\\\\example.com\\file.txt';

    assert.doesNotThrow(() => normalizeToUnix(urlLikePath));
    const result = normalizeToUnix(urlLikePath);
    assert(result.includes('http:'));
  });

  test('handles empty path components gracefully', () => {
    // Multiple consecutive slashes create empty components
    const pathWithEmpty = 'C:\\\\\\Users\\\\\\\\file.txt';
    const result = normalizeToUnix(pathWithEmpty);

    // Redundant slashes should be normalized
    assert(!result.includes('//') || result.startsWith('//'));
  });

  test('handles unicode paths consistently', () => {
    // Unicode in paths is valid on modern systems
    const unicodePath = 'C:\\Users\\用户\\файл.txt';

    assert.doesNotThrow(() => normalizeToUnix(unicodePath));
    const result = normalizeToUnix(unicodePath);

    // Unicode should be preserved
    assert(result.includes('用户'));
    assert(result.includes('файл.txt'));
  });
});

describe('security - input validation', () => {
  test('normalizePath rejects non-string input', () => {
    // @ts-expect-error Testing invalid input
    const result = normalizePath(123);

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Path must be a string');
  });

  test('normalizePath rejects null input', () => {
    // @ts-expect-error Testing invalid input
    const result = normalizePath(null);

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Path must be a string');
  });

  test('normalizePath rejects undefined input', () => {
    // @ts-expect-error Testing invalid input
    const result = normalizePath(undefined);

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Path must be a string');
  });

  test('normalizePath rejects empty string', () => {
    const result = normalizePath('');

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Path cannot be empty');
  });

  test('normalizePath rejects whitespace-only string', () => {
    const result = normalizePath('   \t\n  ');

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Path cannot be empty');
  });
});
