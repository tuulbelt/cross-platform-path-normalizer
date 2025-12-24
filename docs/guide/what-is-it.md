# What is Cross-Platform Path Normalizer?

Cross-Platform Path Normalizer is a zero-dependency Node.js tool that converts file paths between Windows and Unix formats.

## The Problem

When building cross-platform applications, you encounter different path conventions:

- **Windows**: `C:\Users\Documents\file.txt` (backslashes, drive letters)
- **Unix/Linux**: `/home/user/documents/file.txt` (forward slashes)
- **macOS**: `/Users/user/Documents/file.txt` (forward slashes)

Common issues:
- Test fixtures with hardcoded Windows paths fail on Unix
- Scripts break when paths contain mixed separators
- Path manipulation becomes error-prone
- Heavy dependencies just for path normalization

## The Solution

A lightweight, zero-dependency tool that:

1. **Auto-detects** path format (Windows vs Unix)
2. **Converts bidirectionally** between formats
3. **Handles edge cases** (UNC paths, mixed separators, drive letters)
4. **Provides type safety** with TypeScript and Result pattern
5. **Works everywhere** as CLI or library

## Core Features

### Format Detection

```typescript
import { detectPathFormat } from './src/index.js';

detectPathFormat('C:\\Users\\file.txt');     // 'windows'
detectPathFormat('/home/user/file.txt');     // 'unix'
```

### Bidirectional Conversion

```typescript
import { normalizeToUnix, normalizeToWindows } from './src/index.js';

normalizeToUnix('C:\\Program Files\\app');    // '/c/Program Files/app'
normalizeToWindows('/c/Users/Documents');     // 'C:\Users\Documents'
```

### Auto-Normalize

```typescript
import { normalizePath } from './src/index.js';

// Detects format and normalizes
const result = normalizePath('C:\\Users\\file.txt');
// { success: true, path: 'C:\Users\file.txt', format: 'windows' }
```

## Use Cases

- **Cross-platform test fixtures**: Normalize paths in tests
- **Build tools**: Handle paths from different environments
- **CI/CD pipelines**: Process artifacts from Windows and Unix builders
- **Path migration**: Convert path databases between formats
- **Documentation**: Generate platform-specific examples

## Why Zero Dependencies?

No external dependencies means:
- **Security**: No supply chain vulnerabilities
- **Stability**: No breaking changes from updates
- **Size**: Minimal footprint
- **Trust**: Audit the code yourself
- **Simplicity**: Just clone and use

## Next Steps

::: tip
[Get started in 5 minutes →](/guide/getting-started)
:::
