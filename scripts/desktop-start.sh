#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Ensure API and web are built
if [ ! -d "apps/api/dist/src" ]; then
  echo "Building API..."
  npm run build --workspace=@eduvision/api
fi

if [ ! -f "apps/web/.next/standalone/apps/web/server.js" ]; then
  echo "Building web..."
  npm run build --workspace=web
fi

# Ensure standalone server can serve static assets.
if [ -d "apps/web/.next/static" ]; then
  cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/
fi

# Start desktop app
cd apps/desktop
npm start
