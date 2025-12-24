# Best Practices
Guidelines for using Cross-Platform Path Normalizer effectively.
## Always Use Result Pattern
Check for success before using the path:
\`\`\`typescript
const result = normalizePath(userInput);
if (!result.success) {
  console.error(\`Error: \${result.error}\`);
  return;
}
// Safe to use result.path
\`\`\`
## Choose the Right Function
- Use \`normalizePath()\` when you need error handling
- Use \`normalizeToUnix()\` / \`normalizeToWindows()\` for direct conversion
- Use \`detectPathFormat()\` to check format before processing
## Normalize Early
Convert paths at system boundaries:
\`\`\`typescript
// Good: Normalize immediately
function processFile(userPath: string) {
  const normalized = normalizePath(userPath, { format: 'unix' });
  if (!normalized.success) throw new Error(normalized.error);
  return doWork(normalized.path);
}
\`\`\`
## Test on Both Platforms
Run your tests on Windows and Unix to ensure paths work everywhere.
## Use TypeScript
Take advantage of full type safety:
\`\`\`typescript
import type { NormalizeResult, NormalizeOptions } from './src/index.js';
\`\`\`
## Don't Assume Format
Always validate or detect format before processing:
\`\`\`typescript
const format = detectPathFormat(path);
if (format === 'windows') {
  // Handle Windows-specific logic
}
\`\`\`
