# normalizePath()
Main normalization function with options and error handling.
## Signature
\`\`\`typescript
function normalizePath(
  path: string,
  options?: NormalizeOptions
): NormalizeResult
\`\`\`
## Parameters
### \`path\` (required)
- **Type**: \`string\`
- **Description**: The path to normalize
### \`options\` (optional)
- **Type**: \`NormalizeOptions\`
- **Default**: \`{ format: 'auto' }\`
#### Options Fields
- \`format\`: \`'unix' | 'windows' | 'auto'\` (default: \`'auto'\`)
- \`absolute\`: \`boolean\` (default: \`false\`)
- \`verbose\`: \`boolean\` (default: \`false\`)
## Returns
**Type**: \`NormalizeResult\`
Object with:
- \`success\`: \`boolean\` - Whether normalization succeeded
- \`path\`: \`string\` - Normalized path (empty on error)
- \`format\`: \`'unix' | 'windows'\` - Detected or specified format
- \`error?\`: \`string\` - Error message (only present on failure)
## Examples
### Auto-detect format
\`\`\`typescript
const result = normalizePath('C:\\\\Users\\\\file.txt');
// { success: true, path: 'C:\\Users\\file.txt', format: 'windows' }
\`\`\`
### Force Unix format
\`\`\`typescript
const result = normalizePath('C:\\\\Users\\\\file.txt', { format: 'unix' });
// { success: true, path: '/c/Users/file.txt', format: 'unix' }
\`\`\`
### Handle errors
\`\`\`typescript
const result = normalizePath('');
// { success: false, path: '', format: 'unix', error: 'Path cannot be empty' }
\`\`\`
