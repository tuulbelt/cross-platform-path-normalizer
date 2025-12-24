/**
 * Basic usage examples for Cross-Platform Path Normalizer
 *
 * Run this example:
 *   npx tsx examples/basic.ts
 */

import {
  normalizePath,
  normalizeToUnix,
  normalizeToWindows,
  detectPathFormat,
} from '../src/index.js';

console.log('=== Cross-Platform Path Normalizer Examples ===\n');

// Example 1: Auto-detect and normalize
console.log('Example 1: Auto-detect and normalize');
const windowsPath = 'C:\\Users\\Documents\\file.txt';
const result1 = normalizePath(windowsPath);
console.log('Input:', windowsPath);
console.log('Output:', JSON.stringify(result1, null, 2));
console.log();

// Example 2: Convert Windows to Unix
console.log('Example 2: Convert Windows to Unix');
const winPath = 'C:\\Program Files\\MyApp\\config.json';
const unixPath = normalizeToUnix(winPath);
console.log('Input:', winPath);
console.log('Output:', unixPath);
console.log();

// Example 3: Convert Unix to Windows
console.log('Example 3: Convert Unix to Windows');
const unixInput = '/home/user/projects/app/src/index.ts';
const windowsOutput = normalizeToWindows(unixInput);
console.log('Input:', unixInput);
console.log('Output:', windowsOutput);
console.log();

// Example 4: Force conversion format
console.log('Example 4: Force conversion to Unix format');
const mixedPath = 'C:/Users\\Documents/data.csv';
const result4 = normalizePath(mixedPath, { format: 'unix' });
console.log('Input:', mixedPath);
console.log('Output:', JSON.stringify(result4, null, 2));
console.log();

// Example 5: Detect path format
console.log('Example 5: Detect path format');
const paths = [
  'C:\\Users\\file.txt',
  '/home/user/file.txt',
  '\\\\server\\share\\data',
  './relative/path.txt',
];
paths.forEach(path => {
  const format = detectPathFormat(path);
  console.log(`${path} → ${format}`);
});
console.log();

// Example 6: Handle UNC paths
console.log('Example 6: UNC paths');
const uncWindows = '\\\\server\\share\\folder\\file.txt';
const uncUnix = normalizeToUnix(uncWindows);
console.log('Windows UNC:', uncWindows);
console.log('Unix equivalent:', uncUnix);
console.log('Back to Windows:', normalizeToWindows(uncUnix));
console.log();

// Example 7: Error handling
console.log('Example 7: Error handling');
const invalidInputs = [
  '',
  '   ',
];
invalidInputs.forEach(input => {
  const result = normalizePath(input);
  console.log('Input:', JSON.stringify(input));
  console.log('Result:', JSON.stringify(result, null, 2));
});
console.log();

// Example 8: Relative paths
console.log('Example 8: Relative paths');
const relativePaths = [
  '..\\..\\parent\\folder',
  './current/subfolder',
  '.\\relative\\windows\\path',
];
relativePaths.forEach(path => {
  console.log(`Original: ${path}`);
  console.log(`Unix:     ${normalizeToUnix(path)}`);
  console.log(`Windows:  ${normalizeToWindows(path)}`);
  console.log();
});

console.log('=== Examples Complete ===');
