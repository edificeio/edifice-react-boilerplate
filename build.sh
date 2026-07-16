#!/bin/bash
set -e

# Frontend
cd frontend
./build.sh --no-docker clean init build
cd ..

# Create directory structure and copy frontend dist
./copyFrontFiles.sh

# Backend
cd backend
./build.sh --no-docker clean build
cd ..

# Clean up - remove frontend/dist
rm -rf frontend/dist