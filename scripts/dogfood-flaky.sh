#!/bin/bash
# Dogfooding: Test Flakiness Detector validation
# HIGH-VALUE: Validates 145 path normalization tests are deterministic

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOL_DIR="$(dirname "$SCRIPT_DIR")"
DETECTOR_DIR="$TOOL_DIR/../test-flakiness-detector"
RUNS="${1:-10}"

echo "🔬 Validating Cross-Platform Path Normalizer"
echo "   145 tests × $RUNS runs = $((145 * RUNS)) executions"
echo ""

if [ ! -d "$DETECTOR_DIR" ]; then
  echo "❌ Test Flakiness Detector not available"
  echo "   Standalone mode - validation requires monorepo"
  exit 1
fi

[ ! -d "$DETECTOR_DIR/node_modules" ] && (cd "$DETECTOR_DIR" && npm install --silent)

echo "✅ Test Flakiness Detector available"
echo "🎯 Running validation..."
echo ""

cd "$DETECTOR_DIR"
set +e  # Temporarily disable exit on error to capture exit code
npx flaky \
  --test "cd '$TOOL_DIR' && npm test 2>&1" \
  --runs "$RUNS"

EXIT_CODE=$?
set -e  # Re-enable exit on error
echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Path normalization is deterministic!"
else
  echo "❌ Flakiness detected!"
  exit 1
fi
