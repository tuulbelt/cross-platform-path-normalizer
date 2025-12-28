#!/bin/bash
# Dogfooding: Output Diffing Utility integration
# HIGH-VALUE: Proves path outputs are identical (no random data)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOL_DIR="$(dirname "$SCRIPT_DIR")"
DIFF_DIR="$TOOL_DIR/../output-diffing-utility"
TEMP_DIR="/tmp/path-diff-$$"

echo "🔬 Validating Path Normalizer output determinism"
echo ""

[ ! -d "$DIFF_DIR" ] || [ ! -f "$DIFF_DIR/target/release/odiff" ] && echo "⚠️  Output Diffing Utility not available, using standard diff" && USE_STANDARD=1

mkdir -p "$TEMP_DIR"
cd "$TOOL_DIR"

echo "Running tests twice..."
npm test > "$TEMP_DIR/run1.txt" 2>&1
npm test > "$TEMP_DIR/run2.txt" 2>&1
echo ""

if [ "$USE_STANDARD" = "1" ]; then
  diff "$TEMP_DIR/run1.txt" "$TEMP_DIR/run2.txt" && echo "✅ Outputs IDENTICAL!" || echo "⚠️  Differences found"
else
  cd "$DIFF_DIR"
  ./target/release/odiff "$TEMP_DIR/run1.txt" "$TEMP_DIR/run2.txt" --type text && echo "✅ Outputs IDENTICAL!" || echo "⚠️  Differences found"
fi

rm -rf "$TEMP_DIR"
