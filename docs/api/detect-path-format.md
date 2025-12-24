# detectPathFormat()
Detect whether a path is Windows or Unix format.
## Signature
\`\`\`typescript
function detectPathFormat(path: string): 'windows' | 'unix'
\`\`\`
## Parameters
### \`path\` (required)
- **Type**: \`string\`
- **Description**: The path to analyze
## Returns
**Type**: \`'windows' | 'unix'\`
- \`'windows'\` if path contains backslashes, drive letters, or UNC prefix
- \`'unix'\` otherwise (default)
## Detection Rules
Path is considered Windows if it contains:
- Drive letter: \`C:\`, \`D:\`, etc.
- Backslashes: \`\\\`
- UNC prefix: \`\\\\\\\\\`
Otherwise, path is considered Unix.
## Examples
### Windows paths
\`\`\`typescript
detectPathFormat('C:\\\\Users\\\\file.txt');
// 'windows'
detectPathFormat('\\\\\\\\server\\\\share');
// 'windows'
detectPathFormat('folder\\\\subfolder');
// 'windows'
\`\`\`
### Unix paths
\`\`\`typescript
detectPathFormat('/home/user/file.txt');
// 'unix'
detectPathFormat('./relative/path');
// 'unix'
detectPathFormat('file.txt');
// 'unix'
\`\`\`
