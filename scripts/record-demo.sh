#!/bin/bash
# Record Cross-Platform Path Normalizer demo
source "$(dirname "$0")/lib/demo-framework.sh"

TOOL_NAME="cross-platform-path-normalizer"
SHORT_NAME="normpath"
LANGUAGE="typescript"

# GIF parameters
GIF_COLS=100
GIF_ROWS=30
GIF_SPEED=1.0
GIF_FONT_SIZE=14

demo_commands() {
  # ═══════════════════════════════════════════
  # Cross-Platform Path Normalizer / normpath - Tuulbelt
  # ═══════════════════════════════════════════

  # Step 1: Installation
  echo "# Step 1: Install globally"
  sleep 0.5
  echo "$ npm link"
  sleep 1

  # Step 2: View help
  echo ""
  echo "# Step 2: View available commands"
  sleep 0.5
  echo "$ normpath --help"
  sleep 0.5
  normpath --help
  sleep 3

  # Step 3: Auto-detect format
  echo ""
  echo "# Step 3: Auto-detect and normalize"
  sleep 0.5
  echo "$ normpath \"C:\\Users\\Documents\\file.txt\""
  normpath "C:\Users\Documents\file.txt"
  sleep 1
  echo "$ normpath \"/home/user/documents/file.txt\""
  normpath "/home/user/documents/file.txt"
  sleep 2

  # Step 4: Force Unix format
  echo ""
  echo "# Step 4: Force Unix format"
  sleep 0.5
  echo "$ normpath --format unix \"C:\\Program Files\\App\\config.ini\""
  normpath --format unix "C:\Program Files\App\config.ini"
  sleep 2

  # Step 5: Force Windows format
  echo ""
  echo "# Step 5: Force Windows format"
  sleep 0.5
  echo "$ normpath --format windows \"/usr/local/bin/app\""
  normpath --format windows "/usr/local/bin/app"
  sleep 2

  # Step 6: Absolute path resolution
  echo ""
  echo "# Step 6: Absolute path resolution"
  sleep 0.5
  echo "$ normpath --absolute \"./relative/path.txt\""
  normpath --absolute "./relative/path.txt"
  sleep 2

  # Step 7: Edge cases
  echo ""
  echo "# Step 7: Edge cases"
  sleep 0.5
  echo "$ normpath \"///multiple///slashes///path\""
  normpath "///multiple///slashes///path"
  sleep 2

  echo ""
  echo "# Done! Normalize paths with: normpath <path>"
  sleep 1
}

run_demo
