# Getting Started

Get up and running with Cross-Platform Path Normalizer in 5 minutes.

## Installation

```bash
git clone https://github.com/tuulbelt/cross-platform-path-normalizer.git
cd cross-platform-path-normalizer
npm install
```

## Quick Start (CLI)

Convert a Windows path to Unix format:

```bash
normpath --format unix "C:\\Users\\file.txt"
```

Output:
```json
{
  "success": true,
  "path": "/c/Users/file.txt",
  "format": "unix"
}
```

## Quick Start (Library)

Create a file `test.ts`:

```typescript
import { normalizePath } from './src/index.js';

const result = normalizePath('C:\\Users\\Documents\\file.txt', { format: 'unix' });

if (result.success) {
  console.log(result.path); // '/c/Users/Documents/file.txt'
} else {
  console.error(result.error);
}
```

Run it:
```bash
npx tsx test.ts
```

## Basic Examples

### Auto-Detect Format

```typescript
import { normalizePath } from './src/index.js';

// Windows path detected automatically
const win = normalizePath('C:\\Users\\file.txt');
console.log(win.format); // 'windows'

// Unix path detected automatically
const unix = normalizePath('/home/user/file.txt');
console.log(unix.format); // 'unix'
```

### Force Specific Format

```typescript
// Force Unix format
const toUnix = normalizePath('C:\\Users\\file.txt', { format: 'unix' });
console.log(toUnix.path); // '/c/Users/file.txt'

// Force Windows format
const toWin = normalizePath('/home/user/file.txt', { format: 'windows' });
console.log(toWin.path); // 'home\user\file.txt'
```

### Direct Conversion

```typescript
import { normalizeToUnix, normalizeToWindows } from './src/index.js';

// Direct Windows → Unix
const unixPath = normalizeToUnix('C:\\Program Files\\app');
// '/c/Program Files/app'

// Direct Unix → Windows
const winPath = normalizeToWindows('/c/Users/Documents');
// 'C:\Users\Documents'
```

## Common Patterns

### Normalize Test Fixtures

```typescript
import { normalizeToUnix } from './src/index.js';

const testPath = normalizeToUnix(process.env.TEST_FILE_PATH || '');
// Works on both Windows and Unix CI systems
```

### Handle User Input

```typescript
import { normalizePath } from './src/index.js';

function processPath(userPath: string) {
  const result = normalizePath(userPath, { format: 'unix' });

  if (!result.success) {
    throw new Error(`Invalid path: ${result.error}`);
  }

  return result.path;
}
```

## Next Steps

- [CLI Usage Guide](/guide/cli-usage) - Complete CLI reference
- [Library Usage](/guide/library-usage) - API integration
- [Examples](/guide/examples) - Real-world scenarios
- [API Reference](/api/reference) - Full API documentation
