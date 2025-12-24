# CLI Usage

## Basic Syntax

```bash
npx tsx src/index.ts [options] <path>
```

## Options

### `--format, -f <type>`

Target format: `unix`, `windows`, or `auto` (default).

```bash
# Auto-detect (default)
npx tsx src/index.ts "C:\\Users\\file.txt"

# Force Unix format
npx tsx src/index.ts --format unix "C:\\Users\\file.txt"

# Force Windows format
npx tsx src/index.ts --format windows "/home/user/file.txt"
```

### `--absolute, -a`

Resolve to absolute path.

```bash
npx tsx src/index.ts --absolute "./relative/path.txt"
```

### `--verbose, -v`

Enable verbose output with debug information.

```bash
npx tsx src/index.ts --verbose "C:\\Users\\file.txt"
```

### `--help, -h`

Show help message.

```bash
npx tsx src/index.ts --help
```

## Examples

### Convert Windows to Unix

```bash
npx tsx src/index.ts --format unix "C:\\Program Files\\MyApp\\config.json"
```

Output:
```json
{
  "success": true,
  "path": "/c/Program Files/MyApp/config.json",
  "format": "unix"
}
```

### Convert Unix to Windows

```bash
npx tsx src/index.ts --format windows "/home/user/projects/app"
```

Output:
```json
{
  "success": true,
  "path": "home\\user\\projects\\app",
  "format": "windows"
}
```

### Handle UNC Paths

```bash
npx tsx src/index.ts --format unix "\\\\server\\share\\folder"
```

Output:
```json
{
  "success": true,
  "path": "//server/share/folder",
  "format": "unix"
}
```

## Exit Codes

- `0` - Success
- `1` - Error (invalid arguments, empty path, etc.)

## Shell Integration

### Bash/Zsh

```bash
# Convert path and use result
UNIX_PATH=$(npx tsx src/index.ts --format unix "$WIN_PATH" | jq -r '.path')
echo "Processing: $UNIX_PATH"
```

### PowerShell

```powershell
$result = npx tsx src/index.ts --format windows "/home/user/file.txt" | ConvertFrom-Json
Write-Host "Path: $($result.path)"
```

## Next Steps

- [Library Usage](/guide/library-usage) - Use as a Node.js module
- [Examples](/guide/examples) - Real-world scenarios
