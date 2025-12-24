# normalizeToWindows()
Convert any path to Windows format.
## Signature
\`\`\`typescript
function normalizeToWindows(path: string): string
\`\`\`
## Parameters
### \`path\` (required)
- **Type**: \`string\`
- **Description**: The path to convert
## Returns
**Type**: \`string\`
Path in Windows format with backslashes.
## Behavior
- Unix drive paths: \`/c/\` → \`C:\\\` (uppercase)
- Forward slashes: \`/\` → \`\\\`
- UNC paths: \`//server\` → \`\\\\\\\\server\`
- Redundant slashes removed (UNC double-backslash preserved)
- Unix absolute paths without drive letter become relative
## Examples
### Unix to Windows
\`\`\`typescript
normalizeToWindows('/c/Users/Documents');
// 'C:\\Users\\Documents'
\`\`\`
### UNC paths
\`\`\`typescript
normalizeToWindows('//server/share/folder');
// '\\\\server\\share\\folder'
\`\`\`
### Paths without drive letter
\`\`\`typescript
normalizeToWindows('/home/user/file.txt');
// 'home\\user\\file.txt' (becomes relative)
\`\`\`
