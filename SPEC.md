# Cross-Platform Path Normalizer Specification

## Overview

Cross-Platform Path Normalizer is a zero-dependency tool for converting file paths between Windows and Unix formats. It handles edge cases like UNC paths, mixed separators, and drive letters, providing bidirectional conversion and automatic format detection.

## Problem

When building cross-platform tools or handling paths from different operating systems, developers face:
- **Format inconsistencies:** Windows uses backslashes (`\`) and drive letters (`C:`), while Unix uses forward slashes (`/`)
- **Mixed separators:** User-provided paths may contain both forward and backslashes
- **UNC path complexity:** Network paths (`\\server\share`) require special handling
- **Testing challenges:** Need to normalize paths for cross-platform test fixtures
- **Heavy dependencies:** Existing solutions require large libraries or have many transitive dependencies

## Design Goals

1. **Zero dependencies** — Uses only Node.js `path` module (built-in standard library)
2. **Type safe** — Full TypeScript support with strict mode, exported types
3. **Composable** — Works as both library and CLI with consistent interfaces
4. **Predictable** — Same input always produces same output (pure functions)
5. **Edge case handling** — Handles UNC paths, mixed slashes, redundant separators, special characters

## Interface

### Library API

```typescript
// Core normalization function
function normalizePath(
  path: string,
  options?: NormalizeOptions
): NormalizeResult;

// Direct conversion functions
function normalizeToUnix(path: string): string;
function normalizeToWindows(path: string): string;

// Format detection
function detectPathFormat(path: string): 'windows' | 'unix';

// Types
interface NormalizeOptions {
  format?: 'unix' | 'windows' | 'auto';
  absolute?: boolean;
  verbose?: boolean;
}

interface NormalizeResult {
  success: boolean;
  path: string;
  format: 'unix' | 'windows';
  error?: string;
}

type PathFormat = 'unix' | 'windows' | 'auto';
```

### CLI Interface

```
Usage: cross-platform-path-normalizer [options] <path>

Options:
  -f, --format <type>  Target format: unix, windows, or auto (default: auto)
  -a, --absolute       Resolve to absolute path
  -v, --verbose        Enable verbose output
  -h, --help           Show help message

Arguments:
  path                 The path to normalize (required)
```

### Input Format

The tool accepts any string representing a file path:
- Windows paths: `C:\Users\file.txt`, `D:\Projects\app`
- Unix paths: `/home/user/file.txt`, `/usr/local/bin`
- UNC paths: `\\server\share\folder`
- Mixed separators: `C:/Users\Documents/file.txt`
- Relative paths: `./relative/path`, `..\..\parent`
- Empty strings: Treated as error

### Output Format

**Library (TypeScript):**
```typescript
{
  success: true,
  path: "/c/Users/file.txt",
  format: "unix"
}
```

**CLI (JSON on stdout):**
```json
{
  "success": true,
  "path": "/c/Users/file.txt",
  "format": "unix"
}
```

**On error:**
```json
{
  "success": false,
  "path": "",
  "format": "unix",
  "error": "Path cannot be empty"
}
```

## Behavior

### Path Format Detection

Windows paths are identified by:
- Drive letters (`C:`, `D:`, etc.)
- Backslashes (`\`)
- UNC path prefix (`\\server`)

Unix paths are everything else (default assumption).

### Normalization Algorithm

#### Windows to Unix (`normalizeToUnix`)

1. Detect if path is UNC (starts with `\\`)
2. Convert drive letter `C:` → `/c` (lowercase)
3. If UNC path, convert `\\server` → `//server`
4. Replace all backslashes `\` → `/`
5. Remove redundant slashes (preserve UNC double-slash)

#### Unix to Windows (`normalizeToWindows`)

1. Detect if path starts with `/[a-z]/` (Unix-style drive path)
2. Convert Unix drive `/c/` → `C:\` (uppercase)
3. Detect UNC paths (`//server`)
4. If UNC, convert `//server` → `\\server`
5. Replace all forward slashes `/` → `\`
6. Remove redundant backslashes (preserve UNC double-backslash)
7. Handle Unix absolute paths without drive letter (remove leading backslash)

#### Auto-detect Mode

1. Call `detectPathFormat(path)` to determine format
2. Apply normalization for detected format
3. Return normalized path with detected format

### Error Cases

| Condition | Behavior | Error Message |
|-----------|----------|---------------|
| Non-string input | Return error | "Path must be a string" |
| `null` or `undefined` | Return error | "Path must be a string" |
| Empty string | Return error | "Path cannot be empty" |
| Whitespace-only | Return error | "Path cannot be empty" |

### Edge Cases

| Input | Output (Unix) | Output (Windows) |
|-------|---------------|------------------|
| `C:\Users\file.txt` | `/c/Users/file.txt` | `C:\Users\file.txt` |
| `/home/user/file.txt` | `/home/user/file.txt` | `home\user\file.txt` |
| `\\server\share` | `//server/share` | `\\server\share` |
| `C:/Users\Mixed/file.txt` | `/c/Users/Mixed/file.txt` | `C:\Users\Mixed\file.txt` |
| `C:\\\Users\\\file.txt` | `/c/Users/file.txt` | `C:\Users\file.txt` |
| `../../parent` | `../../parent` | `..\..\parent` |
| `./current` | `./current` | `.\current` |
| `C:\Program Files\app` | `/c/Program Files/app` | `C:\Program Files\app` |

## Examples

### Example 1: Auto-detect Windows Path

**Input:**
```typescript
normalizePath('C:\\Users\\Documents\\file.txt');
```

**Output:**
```json
{
  "success": true,
  "path": "C:\\Users\\Documents\\file.txt",
  "format": "windows"
}
```

### Example 2: Force Unix Conversion

**Input:**
```typescript
normalizePath('C:\\Users\\Documents\\file.txt', { format: 'unix' });
```

**Output:**
```json
{
  "success": true,
  "path": "/c/Users/Documents/file.txt",
  "format": "unix"
}
```

### Example 3: Handle UNC Paths

**Input:**
```typescript
normalizeToUnix('\\\\server\\share\\folder\\file.txt');
```

**Output:**
```
"//server/share/folder/file.txt"
```

### Example 4: Mixed Separators

**Input:**
```typescript
normalizeToUnix('C:/Users\\Documents/file.txt');
```

**Output:**
```
"/c/Users/Documents/file.txt"
```

### Example 5: Error Case

**Input:**
```typescript
normalizePath('');
```

**Output:**
```json
{
  "success": false,
  "path": "",
  "format": "unix",
  "error": "Path cannot be empty"
}
```

## Performance

- **Time complexity:** O(n) where n is path length (single pass with regex replacements)
- **Space complexity:** O(n) for result string
- **No I/O operations:** All processing in-memory
- **No async operations:** Synchronous, deterministic functions
- **Benchmark:** < 1ms per path (tested with paths up to 1000+ characters)

## Security Considerations

- **No shell execution:** Pure string manipulation, no subprocess calls
- **No file system access:** Does not validate paths exist or are accessible
- **No network access:** Local-only processing
- **Input validation:** Type checking, empty string rejection
- **No path traversal risk:** Does not resolve or access files

## Limitations

1. **Unix absolute paths lose meaning on Windows:** `/home/user` becomes `home\user` (no drive letter)
2. **No filesystem validation:** Does not check if paths exist or are accessible
3. **No symlink resolution:** Does not follow or resolve symbolic links
4. **No canonicalization:** Does not resolve `.` and `..` (use `--absolute` for that)
5. **Platform-specific features not translated:**
   - Unix symlinks
   - Windows long path prefix `\\?\`
   - Windows device paths like `CON`, `NUL`

## Future Extensions

Potential additions (without breaking changes):
- Path validation (check if path exists)
- Symlink resolution
- Windows long path support (`\\?\` prefix)
- Path comparison (case-insensitive on Windows)
- Relative path calculation between two paths
- Glob pattern normalization

## Changelog

### v0.1.0 (2025-12-24)

- Initial release
- Core path normalization functions
- Auto-detect Windows vs Unix paths
- Bidirectional conversion (Windows ↔ Unix)
- UNC path support
- CLI and library interfaces
- Comprehensive test suite (51 tests, 100% passing)
- Zero runtime dependencies
