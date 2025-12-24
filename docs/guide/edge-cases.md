# Edge Cases
How Cross-Platform Path Normalizer handles tricky scenarios.
## UNC Network Paths
Windows network paths with double backslashes:
\`\`\`typescript
normalizeToUnix('\\\\\\\\server\\\\share\\\\folder');
// '//server/share/folder'
normalizeToWindows('//server/share/folder');
// '\\\\server\\share\\folder'
\`\`\`
## Mixed Separators
Paths with both forward and backslashes:
\`\`\`typescript
normalizeToUnix('C:/Users\\\\Documents/file.txt');
// '/c/Users/Documents/file.txt'
\`\`\`
## Redundant Slashes
Multiple consecutive slashes:
\`\`\`typescript
normalizeToUnix('C:\\\\\\\\\\\\Users\\\\\\\\\\\\file.txt');
// '/c/Users/file.txt'
\`\`\`
## Drive Letter Casing
Windows drive letters normalized:
\`\`\`typescript
normalizeToUnix('c:\\\\users\\\\file.txt');
// '/c/users/file.txt' (lowercase)
normalizeToWindows('/c/Users/file.txt');
// 'C:\\Users\\file.txt' (uppercase)
\`\`\`
## Relative Paths
Dots and parent references:
\`\`\`typescript
normalizeToUnix('..\\\\..\\\\parent\\\\folder');
// '../../parent/folder'
normalizeToWindows('../../parent/folder');
// '..\\\\..\\\\parent\\\\folder'
\`\`\`
## Special Characters
Spaces and symbols preserved:
\`\`\`typescript
normalizeToUnix('C:\\\\Program Files\\\\app@2.0');
// '/c/Program Files/app@2.0'
\`\`\`
## Empty and Invalid Paths
Error handling:
\`\`\`typescript
normalizePath('');
// { success: false, error: 'Path cannot be empty' }
normalizePath('   ');
// { success: false, error: 'Path cannot be empty' }
\`\`\`
