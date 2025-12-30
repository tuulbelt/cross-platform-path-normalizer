#!/usr/bin/env npx tsx
/**
 * Dogfood: Output Consistency Validation
 *
 * Verifies that normalizePath produces identical output for identical input.
 * This proves the tool is deterministic - same input always produces same output.
 */

import { normalizePath, type PathFormat } from '../src/index.ts';

// Test cases covering various path formats
const testCases: Array<{ input: string; format: PathFormat }> = [
  { input: 'C:\\Users\\kofi\\file.txt', format: 'unix' },
  { input: 'C:\\Users\\kofi\\file.txt', format: 'windows' },
  { input: '/home/kofi/file.txt', format: 'unix' },
  { input: '/home/kofi/file.txt', format: 'windows' },
  { input: '\\\\server\\share\\file.txt', format: 'unix' },
  { input: '\\\\server\\share\\file.txt', format: 'windows' },
  { input: './relative/path.txt', format: 'unix' },
  { input: './relative/path.txt', format: 'windows' },
  { input: '../parent/path.txt', format: 'unix' },
  { input: '', format: 'unix' },
  { input: '/', format: 'unix' },
  { input: 'C:', format: 'windows' },
];

const RUNS = 100;

console.log('Dogfood: Output Consistency Validation');
console.log(`Running ${testCases.length} test cases × ${RUNS} iterations = ${testCases.length * RUNS} comparisons\n`);

let passed = 0;
let failed = 0;

for (const { input, format } of testCases) {
  // Get baseline result
  const baseline = normalizePath(input, { format });

  // Run multiple times and compare
  let allMatch = true;
  for (let i = 0; i < RUNS; i++) {
    const result = normalizePath(input, { format });

    // Compare success status
    if (baseline.success !== result.success) {
      allMatch = false;
      console.error(`FAIL: success mismatch for "${input}" (format: ${format})`);
      console.error(`  Baseline success: ${baseline.success}, Run ${i} success: ${result.success}`);
      break;
    }

    // Compare path output
    if (baseline.path !== result.path) {
      allMatch = false;
      console.error(`FAIL: path mismatch for "${input}" (format: ${format})`);
      console.error(`  Baseline: "${baseline.path}", Run ${i}: "${result.path}"`);
      break;
    }

    // Compare format
    if (baseline.format !== result.format) {
      allMatch = false;
      console.error(`FAIL: format mismatch for "${input}" (format: ${format})`);
      console.error(`  Baseline: "${baseline.format}", Run ${i}: "${result.format}"`);
      break;
    }

    // Compare error (if any)
    if (baseline.error !== result.error) {
      allMatch = false;
      console.error(`FAIL: error mismatch for "${input}" (format: ${format})`);
      console.error(`  Baseline: "${baseline.error}", Run ${i}: "${result.error}"`);
      break;
    }
  }

  if (allMatch) {
    passed++;
    console.log(`✓ "${input}" (format: ${format}) - ${RUNS} runs identical`);
  } else {
    failed++;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Results: ${passed}/${testCases.length} passed, ${failed} failed`);

if (failed > 0) {
  console.error('\n❌ OUTPUT CONSISTENCY VALIDATION FAILED');
  console.error('The tool produced different output for identical input.');
  process.exit(1);
}

console.log('\n✅ OUTPUT CONSISTENCY VALIDATED');
console.log('All test cases produced identical output across all runs.');
process.exit(0);
