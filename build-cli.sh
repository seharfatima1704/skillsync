#!/bin/bash

echo "Building SkillSync CLI..."

# Compile CLI
javac -cp ".:mysql-connector-j-8.0.33.jar" cli/MainCLI.java

if [ $? -eq 0 ]; then
    echo "✓ CLI Build successful!"
    echo ""
    echo "To run CLI:"
    echo "  java -cp \".:mysql-connector-j-8.0.33.jar\" cli.MainCLI"
else
    echo "✗ CLI Build failed!"
    exit 1
fi
