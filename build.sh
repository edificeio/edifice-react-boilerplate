#!/bin/bash

# Frontend
cd frontend
./build.sh --no-docker clean init build
cd ..

# Create directory structure and copy frontend dist
cd backend
find ./src/main/resources/public/ -maxdepth 1 -type f -exec rm -f {} +
cp -R ../frontend/dist/* ./src/main/resources/

# Copy Files
VIEW_DIR=./src/main/resources/view

# If 'view' exists and is a regular file, remove it so we can create a directory
if [ -f "$VIEW_DIR" ]; then
  rm -f "$VIEW_DIR"
fi

# Ensure directory exists
mkdir -p "$VIEW_DIR"
mv ./src/main/resources/*.html "$VIEW_DIR"/

# Build .
./build.sh --no-docker clean build

# Clean up - remove frontend/dist and backend/src/main/resources
rm -rf ../frontend/dist
