# API Reference
Complete API documentation for Cross-Platform Path Normalizer.
## Functions
### Main Functions
- [`normalizePath()`](/api/normalize-path) - Normalize path with options
- [`normalizeToUnix()`](/api/normalize-to-unix) - Convert to Unix format
- [`normalizeToWindows()`](/api/normalize-to-windows) - Convert to Windows format
- [`detectPathFormat()`](/api/detect-path-format) - Detect path format
### Type Definitions
- [`NormalizeOptions`](/api/types#normalizeoptions) - Configuration options
- [`NormalizeResult`](/api/types#normalizeresult) - Result object
- [`PathFormat`](/api/types#pathformat) - Format type
## Quick Reference
\`\`\`typescript
import {
  normalizePath,
  normalizeToUnix,
  normalizeToWindows,
  detectPathFormat,
  type NormalizeOptions,
  type NormalizeResult,
  type PathFormat
} from './src/index.js';
\`\`\`
