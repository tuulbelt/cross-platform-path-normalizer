# Library Usage
Import and use the path normalizer in your Node.js/TypeScript projects.
## Basic Import
\`\`\`typescript
import {
  normalizePath,
  normalizeToUnix,
  normalizeToWindows,
  detectPathFormat
} from './src/index.js';
\`\`\`
## Functions
### normalizePath()
Main function with options and Result pattern.
\`\`\`typescript
const result = normalizePath('C:\\\\Users\\\\file.txt', { format: 'unix' });
if (result.success) {
  console.log(result.path); // '/c/Users/file.txt'
} else {
  console.error(result.error);
}
\`\`\`
### normalizeToUnix()
Direct Windows → Unix conversion.
\`\`\`typescript
const unixPath = normalizeToUnix('C:\\\\Program Files\\\\app');
// '/c/Program Files/app'
\`\`\`
### normalizeToWindows()
Direct Unix → Windows conversion.
\`\`\`typescript
const winPath = normalizeToWindows('/c/Users/Documents');
// 'C:\\Users\\Documents'
\`\`\`
### detectPathFormat()
Detect path format.
\`\`\`typescript
const format = detectPathFormat('C:\\\\Users\\\\file.txt');
// 'windows'
\`\`\`
## Error Handling
Use the Result pattern:
\`\`\`typescript
const result = normalizePath(userInput);
if (!result.success) {
  throw new Error(\`Path normalization failed: \${result.error}\`);
}
// Use result.path safely
processFile(result.path);
\`\`\`
