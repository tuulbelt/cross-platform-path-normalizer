# Installation

## Requirements

- Node.js 18.0.0 or later
- npm or yarn

## Clone the Repository

```bash
git clone https://github.com/tuulbelt/cross-platform-path-normalizer.git
cd cross-platform-path-normalizer
```

## Install Dev Dependencies

```bash
npm install
```

This installs:
- `typescript` - TypeScript compiler
- `tsx` - TypeScript executor
- `@types/node` - Node.js type definitions

**Note**: There are ZERO runtime dependencies. The tool uses only Node.js built-in modules.

## Verify Installation

```bash
# Run tests
npm test

# Build TypeScript
npm run build
```

## Usage Without Installation

You can use the tool directly from the cloned repository:

```bash
normpath --help
```

## Next Steps

- [CLI Usage](/guide/cli-usage) - Command-line interface
- [Library Usage](/guide/library-usage) - Use as a module
