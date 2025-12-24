/**
 * Integration Tests for Cross-Platform Path Normalizer
 *
 * Tests the CLI entry point by spawning actual processes
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const CLI_PATH = join(process.cwd(), 'src', 'index.ts');

// Helper to run CLI command
function runCLI(args: string[], expectSuccess = true): { stdout: string; stderr: string; exitCode: number } {
  const result = spawnSync('npx', ['tsx', CLI_PATH, ...args], {
    encoding: 'utf-8',
    timeout: 10000,
  });

  const exitCode = result.status ?? 1;

  if (expectSuccess && exitCode !== 0) {
    console.error('CLI failed:', result.stderr);
  }

  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    exitCode,
  };
}

// Helper to parse JSON output
function parseOutput(stdout: string): any {
  try {
    return JSON.parse(stdout.trim());
  } catch {
    throw new Error(`Failed to parse output: ${stdout}`);
  }
}

describe('CLI - help', () => {
  test('shows help with --help flag', () => {
    const result = runCLI(['--help'], true);

    assert.strictEqual(result.exitCode, 0);
    assert(result.stdout.includes('Usage:'));
    assert(result.stdout.includes('Options:'));
    assert(result.stdout.includes('Examples:'));
  });

  test('shows help with -h flag', () => {
    const result = runCLI(['-h'], true);

    assert.strictEqual(result.exitCode, 0);
    assert(result.stdout.includes('Usage:'));
  });
});

describe('CLI - Windows to Unix conversion', () => {
  test('converts Windows path with auto-detect', () => {
    const result = runCLI(['C:\\Users\\Documents\\file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert.strictEqual(output.path, 'C:\\Users\\Documents\\file.txt');
    assert.strictEqual(output.format, 'windows');
  });

  test('converts Windows path to Unix with --format unix', () => {
    const result = runCLI(['--format', 'unix', 'C:\\Users\\Documents\\file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert.strictEqual(output.path, '/c/Users/Documents/file.txt');
    assert.strictEqual(output.format, 'unix');
  });

  test('handles UNC paths', () => {
    const result = runCLI(['--format', 'unix', '\\\\server\\share\\folder'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert.strictEqual(output.path, '//server/share/folder');
    assert.strictEqual(output.format, 'unix');
  });
});

describe('CLI - Unix to Windows conversion', () => {
  test('converts Unix path to Windows', () => {
    const result = runCLI(['--format', 'windows', '/home/user/project/src'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert.strictEqual(output.path, 'home\\user\\project\\src');
    assert.strictEqual(output.format, 'windows');
  });

  test('converts Unix drive path to Windows', () => {
    const result = runCLI(['--format', 'windows', '/c/Users/Documents'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert.strictEqual(output.path, 'C:\\Users\\Documents');
    assert.strictEqual(output.format, 'windows');
  });

  test('handles UNC paths from Unix', () => {
    const result = runCLI(['--format', 'windows', '//server/share/folder'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert.strictEqual(output.path, '\\\\server\\share\\folder');
    assert.strictEqual(output.format, 'windows');
  });
});

describe('CLI - error handling', () => {
  test('returns error for empty path argument', () => {
    const result = runCLI([], false);

    assert.strictEqual(result.exitCode, 1);
    assert(result.stderr.includes('No path provided') || result.stderr.includes('Usage:'));
  });

  test('returns error for invalid format option', () => {
    const result = runCLI(['--format', 'invalid', '/path'], false);

    assert.strictEqual(result.exitCode, 1);
    assert(result.stderr.includes('Invalid format'));
  });

  test('returns error for whitespace-only path', () => {
    // Whitespace-only path is treated as empty and returns stderr error
    const result = runCLI(['--format', 'unix', '   '], false);

    assert.strictEqual(result.exitCode, 1);
    assert(result.stderr.includes('cannot be empty') || result.stderr.includes('Error'));
  });
});

describe('CLI - verbose mode', () => {
  test('shows debug output with --verbose flag', () => {
    const result = runCLI(['--verbose', '/home/user/file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    assert(result.stderr.includes('DEBUG'));
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
  });

  test('shows debug output with -v flag', () => {
    const result = runCLI(['-v', 'C:\\Users\\file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    assert(result.stderr.includes('DEBUG'));
  });
});

describe('CLI - short flags', () => {
  test('accepts -f as alias for --format', () => {
    const result = runCLI(['-f', 'unix', 'C:\\Users\\Documents'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.format, 'unix');
  });

  test('accepts -a as alias for --absolute', () => {
    const result = runCLI(['-a', 'file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
  });
});

describe('CLI - complex scenarios', () => {
  test('handles paths with spaces', () => {
    const result = runCLI(['C:\\Program Files\\My App\\file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert(output.path.includes('Program Files'));
  });

  test('handles paths with special characters', () => {
    const result = runCLI(['/home/user/file-name_2024.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
  });

  test('handles mixed slashes', () => {
    const result = runCLI(['--format', 'windows', 'C:/Users\\Documents/file.txt'], true);

    assert.strictEqual(result.exitCode, 0);
    const output = parseOutput(result.stdout);
    assert.strictEqual(output.success, true);
    assert(!output.path.includes('/'), 'Should not contain forward slashes');
  });
});
