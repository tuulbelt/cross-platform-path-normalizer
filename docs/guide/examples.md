# Examples
Real-world usage scenarios for Cross-Platform Path Normalizer.
## Test Fixtures
Normalize paths in cross-platform tests:
\`\`\`typescript
import { normalizeToUnix } from './src/index.js';
import { readFileSync } from 'node:fs';
const testFile = normalizeToUnix(process.env.TEST_FILE || 'C:\\\\tests\\\\fixture.txt');
const content = readFileSync(testFile, 'utf-8');
\`\`\`
## Build Tools
Handle artifact paths from different environments:
\`\`\`typescript
import { normalizePath } from './src/index.js';
function processArtifact(artifactPath: string) {
  const result = normalizePath(artifactPath, { format: 'unix' });
  if (!result.success) {
    throw new Error(\`Invalid artifact path: \${result.error}\`);
  }
  return uploadToS3(result.path);
}
\`\`\`
## Path Migration
Convert path databases:
\`\`\`typescript
import { normalizeToWindows } from './src/index.js';
const unixPaths = database.query('SELECT path FROM files');
const windowsPaths = unixPaths.map(p => normalizeToWindows(p.path));
\`\`\`
## Configuration Files
Normalize user-provided paths:
\`\`\`typescript
import { normalizePath } from './src/index.js';
function loadConfig(configPath: string) {
  const result = normalizePath(configPath, { format: 'unix' });
  if (!result.success) {
    console.warn(\`Invalid config path, using default\`);
    return loadDefaultConfig();
  }
  return JSON.parse(readFileSync(result.path, 'utf-8'));
}
\`\`\`
