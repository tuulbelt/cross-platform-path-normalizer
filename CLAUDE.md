# Cross-Platform Path Normalizer

**Tool:** `normpath` / `cross-platform-path-normalizer`
**Version:** v0.1.0
**Language:** TypeScript
**Status:** Production Ready

## Purpose

Cross-platform path normalization utility that converts Windows/Unix paths to consistent format with zero runtime dependencies.

## Quick Reference

**Installation:**
```bash
git clone https://github.com/tuulbelt/cross-platform-path-normalizer.git
cd cross-platform-path-normalizer
npm install
npm link  # Makes 'normpath' available globally
```

**Usage:**
```bash
# CLI
normpath --format unix "C:\Users\file.txt"

# Library
import { normalizePath } from '@tuulbelt/cross-platform-path-normalizer';
const result = normalizePath('C:\\Users\\file.txt', { format: 'unix' });
```

## Development

**Run tests:**
```bash
npm test               # All tests (141 tests)
npm run test:unit      # Unit tests only
npm run test:dogfood   # Flakiness detection (validate test reliability)
```

**Quality checks:**
```bash
npx tsc --noEmit      # TypeScript compilation check
npm run build          # Build TypeScript
npm test               # All tests must pass
```

## Architecture

**Core files:**
- `src/index.ts` - Main implementation (~300 lines)
- `test/index.test.ts` - Unit tests
- `test/integration.test.ts` - CLI integration tests
- `test/stress.test.ts` - Edge cases and stress tests
- `test/fuzzy.test.ts` - Fuzzy testing

**Key features:**
- Windows ↔ Unix path conversion
- UNC path handling
- Absolute/relative path detection
- Format auto-detection
- Zero runtime dependencies

## Tuulbelt Integration

This tool is part of the [Tuulbelt](https://github.com/tuulbelt/tuulbelt) collection.

**Related tools:**
- [Test Flakiness Detector](https://github.com/tuulbelt/test-flakiness-detector) - Validates this tool's test reliability
- [Output Diffing Utility](https://github.com/tuulbelt/output-diffing-utility) - Proves deterministic output

**Issues:** Report at https://github.com/tuulbelt/tuulbelt/issues

## Standards

**Code style:**
- ES modules only (`import`, not `require()`)
- Explicit return types on all exported functions
- Result pattern for error handling: `Result<T> = { ok: true, value: T } | { ok: false, error: Error }`
- Zero `any` types (strict TypeScript)

**Testing:**
- Minimum 80% line coverage
- Edge cases required (empty input, malformed data)
- No flaky tests (validated by test-flakiness-detector)

**Security:**
- Path traversal prevention
- Malicious input handling
- No hardcoded secrets
- Stack traces excluded from production errors

## License

MIT
