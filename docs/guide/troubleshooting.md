# Troubleshooting
Common issues and how to resolve them.
## TypeScript Errors
**Problem**: \`Cannot find module\` or type errors
**Solution**: Ensure \`@types/node\` is installed:
\`\`\`bash
npm install --save-dev @types/node
\`\`\`
## Empty Path Errors
**Problem**: \`Path cannot be empty\` error
**Solution**: Validate input before calling:
\`\`\`typescript
if (!path || path.trim() === '') {
  throw new Error('Path is required');
}
\`\`\`
## Unix Paths Without Drive Letters
**Problem**: \`/home/user\` becomes \`home\\\\user\` on Windows
**Explanation**: This is expected. Unix absolute paths don't have drive letters, so they become relative on Windows.
**Solution**: Add drive letter manually or use \`--absolute\` flag:
\`\`\`typescript
const result = normalizePath('/home/user', { format: 'windows', absolute: true });
\`\`\`
## Build Errors
**Problem**: TypeScript compilation fails
**Solution**: Run build:
\`\`\`bash
npm run build
\`\`\`
## Test Failures
**Problem**: Tests fail on your platform
**Solution**: Check Node.js version:
\`\`\`bash
node --version  # Should be 18.0.0 or higher
npm test
\`\`\`
