# Types
TypeScript type definitions for Cross-Platform Path Normalizer.
## NormalizeOptions
Configuration options for \`normalizePath()\`.
\`\`\`typescript
interface NormalizeOptions {
  format?: 'unix' | 'windows' | 'auto';
  absolute?: boolean;
  verbose?: boolean;
}
\`\`\`
### Fields
- **\`format\`** (optional): Target format
  - \`'unix'\` - Force Unix format
  - \`'windows'\` - Force Windows format
  - \`'auto'\` - Auto-detect (default)
- **\`absolute\`** (optional): Resolve to absolute path (default: \`false\`)
- **\`verbose\`** (optional): Enable debug output (default: \`false\`)
## NormalizeResult
Result object returned by \`normalizePath()\`.
\`\`\`typescript
interface NormalizeResult {
  success: boolean;
  path: string;
  format: 'unix' | 'windows';
  error?: string;
}
\`\`\`
### Fields
- **\`success\`**: Whether normalization succeeded
- **\`path\`**: Normalized path (empty string on error)
- **\`format\`**: Detected or specified format
- **\`error\`** (optional): Error message (only present when \`success\` is \`false\`)
### Success Example
\`\`\`typescript
{
  success: true,
  path: '/c/Users/file.txt',
  format: 'unix'
}
\`\`\`
### Error Example
\`\`\`typescript
{
  success: false,
  path: '',
  format: 'unix',
  error: 'Path cannot be empty'
}
\`\`\`
## PathFormat
Path format type.
\`\`\`typescript
type PathFormat = 'unix' | 'windows' | 'auto';
\`\`\`
### Values
- \`'unix'\` - Unix/Linux/macOS path format (\`/\`)
- \`'windows'\` - Windows path format (\`\\\`)
- \`'auto'\` - Auto-detect format
