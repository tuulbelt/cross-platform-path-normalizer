#!/bin/bash
# Record Cross-Platform Path Normalizer demo
source "$(dirname "$0")/lib/demo-framework.sh"

TOOL_NAME="cross-platform-path-normalizer"
SHORT_NAME="normpath"
LANGUAGE="typescript"

demo_commands() {
  echo "# Cross-Platform Path Normalizer Demo"
  sleep 1

  echo ""
  echo "# Normalize a Windows path"
  sleep 0.5
  echo "$ normpath \"C:\\Users\\Documents\\file.txt\""
  sleep 0.5
  normpath "C:\Users\Documents\file.txt"
  sleep 1.5

  echo ""
  echo "# Convert Windows path to Unix format"
  sleep 0.5
  echo "$ normpath --format unix \"C:\\Users\\Documents\\file.txt\""
  sleep 0.5
  normpath --format unix "C:\Users\Documents\file.txt"
  sleep 1.5

  echo ""
  echo "# Convert Unix path to Windows format"
  sleep 0.5
  echo "$ normpath --format windows \"/home/user/project/src\""
  sleep 0.5
  normpath --format windows "/home/user/project/src"
  sleep 1.5

  echo ""
  echo "# Handle UNC network paths"
  sleep 0.5
  echo "$ normpath --format unix \"\\\\\\\\server\\\\share\\\\folder\""
  sleep 0.5
  normpath --format unix "\\\\server\\share\\folder"
  sleep 1.5

  echo ""
  echo "# Show help"
  sleep 0.5
  echo "$ normpath --help"
  sleep 0.5
  normpath --help
  sleep 2

  echo ""
  echo "# Done! Normalize paths with the normpath command."
  sleep 1
}

run_demo
