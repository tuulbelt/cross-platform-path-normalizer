#!/usr/bin/env -S npx tsx
/**
 * Cross-Platform Path Normalizer
 *
 * Convert Windows/Unix paths to consistent format with zero dependencies.
 */

import { normalize, resolve, sep } from 'node:path';
import { realpathSync } from 'node:fs';

/**
 * Path format types
 */
export type PathFormat = 'unix' | 'windows' | 'auto';

/**
 * Configuration options for path normalization
 */
export interface NormalizeOptions {
  /** Target format (unix, windows, or auto to detect) */
  format?: PathFormat;
  /** Resolve to absolute path */
  absolute?: boolean;
  /** Enable verbose output */
  verbose?: boolean;
}

/**
 * Result returned by normalization functions
 */
export interface NormalizeResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** The normalized path */
  path: string;
  /** Detected or specified format */
  format: 'unix' | 'windows';
  /** Optional error message if success is false */
  error?: string;
}

/**
 * Detect whether a path is Windows or Unix format
 *
 * @param path - The path to analyze
 * @returns 'windows' if path contains backslashes or drive letters, 'unix' otherwise
 *
 * @example
 * ```typescript
 * detectPathFormat('C:\\Users\\file.txt'); // 'windows'
 * detectPathFormat('/home/user/file.txt'); // 'unix'
 * ```
 */
export function detectPathFormat(path: string): 'windows' | 'unix' {
  // Check for Windows drive letter (C:, D:, etc.)
  const hasDriveLetter = /^[A-Za-z]:/.test(path);

  // Check for backslashes
  const hasBackslashes = path.includes('\\');

  // Check for UNC paths (\\server\share)
  const isUNCPath = /^\\\\/.test(path);

  return hasDriveLetter || hasBackslashes || isUNCPath ? 'windows' : 'unix';
}

/**
 * Convert any path to Unix format
 *
 * @param path - The path to convert
 * @returns Path in Unix format with forward slashes
 *
 * @example
 * ```typescript
 * normalizeToUnix('C:\\Users\\file.txt'); // '/c/Users/file.txt'
 * normalizeToUnix('/home/user/file.txt'); // '/home/user/file.txt'
 * ```
 */
export function normalizeToUnix(path: string): string {
  if (!path) return '';

  let result = path;

  // Detect UNC paths before any transformations (\\server\share)
  const isUNCPath = result.startsWith('\\\\');

  // Handle Windows drive letters (C: -> /c)
  result = result.replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`);

  // Handle UNC paths (\\server\share -> //server/share)
  if (isUNCPath) {
    result = '//' + result.slice(2);
  }

  // Convert all backslashes to forward slashes
  result = result.replace(/\\/g, '/');

  // Remove redundant slashes (but preserve UNC double slash)
  if (isUNCPath) {
    result = '//' + result.slice(2).replace(/\/+/g, '/');
  } else {
    result = result.replace(/\/+/g, '/');
  }

  return result;
}

/**
 * Convert any path to Windows format
 *
 * @param path - The path to convert
 * @returns Path in Windows format with backslashes
 *
 * @example
 * ```typescript
 * normalizeToWindows('/c/Users/file.txt'); // 'C:\\Users\\file.txt'
 * normalizeToWindows('C:\\Users\\file.txt'); // 'C:\\Users\\file.txt'
 * ```
 */
export function normalizeToWindows(path: string): string {
  if (!path) return '';

  let result = path;
  let isDrivePath = false;
  let isUNCPath = false;

  // Handle Unix-style drive paths (/c/ -> C:\)
  if (/^\/([a-z])\//i.test(result)) {
    result = result.replace(/^\/([a-z])\//i, (_, drive) => `${drive.toUpperCase()}:\\`);
    isDrivePath = true;
  }

  // Handle UNC paths (//server/share -> \\server\share)
  if (result.startsWith('//')) {
    result = '\\\\' + result.slice(2);
    isUNCPath = true;
  }

  // Convert all forward slashes to backslashes
  result = result.replace(/\//g, '\\');

  // Remove redundant backslashes (but preserve UNC \\ prefix)
  if (isUNCPath || result.startsWith('\\\\')) {
    // UNC path - preserve initial \\
    result = '\\\\' + result.slice(2).replace(/\\+/g, '\\');
  } else {
    result = result.replace(/\\+/g, '\\');
  }

  // If path starts with single backslash and is not a drive or UNC path,
  // it's a Unix absolute path without drive letter - treat as relative on Windows
  if (!isDrivePath && !isUNCPath && result.startsWith('\\') && !result.startsWith('\\\\')) {
    result = result.slice(1); // Remove leading backslash
  }

  return result;
}

/**
 * Normalize a path to the specified format
 *
 * @param path - The path to normalize
 * @param options - Normalization options
 * @returns Normalization result with success status and normalized path
 *
 * @example
 * ```typescript
 * const result = normalizePath('C:\\Users\\file.txt', { format: 'unix' });
 * console.log(result.path); // '/c/Users/file.txt'
 * ```
 */
export function normalizePath(path: string, options: NormalizeOptions = {}): NormalizeResult {
  if (typeof path !== 'string') {
    return {
      success: false,
      path: '',
      format: 'unix',
      error: 'Path must be a string',
    };
  }

  if (path.trim() === '') {
    return {
      success: false,
      path: '',
      format: 'unix',
      error: 'Path cannot be empty',
    };
  }

  const { format = 'auto', absolute = false, verbose = false } = options;

  try {
    let targetFormat: 'unix' | 'windows';

    if (format === 'auto') {
      targetFormat = detectPathFormat(path);
      if (verbose) {
        console.error(`[DEBUG] Detected format: ${targetFormat}`);
      }
    } else {
      targetFormat = format;
    }

    let normalized: string;

    if (targetFormat === 'unix') {
      normalized = normalizeToUnix(path);
    } else {
      normalized = normalizeToWindows(path);
    }

    if (absolute) {
      // Resolve to absolute path if requested
      // Note: This uses the current platform's path resolution
      normalized = targetFormat === 'unix'
        ? normalizeToUnix(resolve(path))
        : normalizeToWindows(resolve(path));
    }

    if (verbose) {
      console.error(`[DEBUG] Input: ${path}`);
      console.error(`[DEBUG] Output: ${normalized}`);
    }

    return {
      success: true,
      path: normalized,
      format: targetFormat,
    };
  } catch (error) {
    return {
      success: false,
      path: '',
      format: 'unix',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): { path: string; options: NormalizeOptions } {
  let path = '';
  const options: NormalizeOptions = { format: 'auto' };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (!arg) continue;

    if (arg === '--format' || arg === '-f') {
      const formatValue = args[++i];
      if (!formatValue) {
        console.error('Error: --format requires a value (unix, windows, or auto)');
        globalThis.process?.exit(1);
        return { path: '', options };
      }
      if (formatValue === 'unix' || formatValue === 'windows' || formatValue === 'auto') {
        options.format = formatValue;
      } else {
        console.error(`Error: Invalid format "${formatValue}". Must be unix, windows, or auto.`);
        globalThis.process?.exit(1);
      }
    } else if (arg === '--absolute' || arg === '-a') {
      options.absolute = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`Cross-Platform Path Normalizer

Usage: cross-platform-path-normalizer [options] <path>

Options:
  -f, --format <type>  Target format: unix, windows, or auto (default: auto)
  -a, --absolute       Resolve to absolute path
  -v, --verbose        Enable verbose output
  -h, --help           Show this help message

Examples:
  # Auto-detect and normalize
  normpath "C:\\Users\\file.txt"

  # Force Unix format
  normpath --format unix "C:\\Users\\file.txt"

  # Force Windows format
  normpath --format windows "/home/user/file.txt"

  # Resolve to absolute path
  normpath --absolute "./relative/path.txt"`);
      globalThis.process?.exit(0);
    } else if (!arg.startsWith('-')) {
      path = arg;
    }
  }

  return { path, options };
}

// CLI entry point - only runs when executed directly
function main(): void {
  const args = globalThis.process?.argv?.slice(2) ?? [];
  const { path, options } = parseArgs(args);

  if (!path) {
    console.error('Error: No path provided');
    console.error('Usage: cross-platform-path-normalizer [options] <path>');
    console.error('Run with --help for more information');
    globalThis.process?.exit(1);
    return;
  }

  const result = normalizePath(path, options);

  if (result.success) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.error(`Error: ${result.error}`);
    globalThis.process?.exit(1);
  }
}

// Check if this module is being run directly
// Must resolve symlinks for npm link support (argv1 may be symlink path)
const argv1 = globalThis.process?.argv?.[1];
if (argv1) {
  try {
    const realPath = realpathSync(argv1);
    if (import.meta.url === `file://${realPath}`) {
      main();
    }
  } catch {
    // Fallback for non-existent paths
    if (import.meta.url === `file://${argv1}`) {
      main();
    }
  }
}
