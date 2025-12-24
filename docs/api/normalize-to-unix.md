# normalizeToUnix()
Convert any path to Unix format.
## Signature
\`\`\`typescript
function normalizeToUnix(path: string): string
\`\`\`
## Parameters
### \`path\` (required)
- **Type**: \`string\`
- **Description**: The path to convert
## Returns
**Type**: \`string\`
Path in Unix format with forward slashes.
## Behavior
- Drive letters: \`C:\` → \`/c\` (lowercase)
- Backslashes: \`\\\` → \`/\`
- UNC paths: \`\\\\\\\\server\` → \`//server\`
- Redundant slashes removed (UNC double-slash preserved)
## Examples
### Windows to Unix
\`\`\`typescript
normalizeToUnix('C:\\\\Program Files\\\\app');
// '/c/Program Files/app'
\`\`\`
### UNC paths
\`\`\`typescript
normalizeToUnix('\\\\\\\\server\\\\share\\\\folder');
// '//server/share/folder'
\`\`\`
### Mixed separators
\`\`\`typescript
normalizeToUnix('C:/Users\\\\Documents/file.txt');
// '/c/Users/Documents/file.txt'
\`\`\`
