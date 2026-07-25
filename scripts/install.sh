#!/bin/bash
set -e

# Ubuntu installer for EduVision with Docker Compose.
# Run from the project root after extracting the production package.

cd "$(dirname "$0")/.."

if ! command -v docker &> /dev/null || ! command -v docker compose &> /dev/null; then
  echo "Installing Docker and Docker Compose..."
  sudo apt-get update
  sudo apt-get install -y ca-certificates curl gnupg
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example. Please edit it with your secrets before deploying."
fi

./scripts/deploy.sh

echo ""
echo "EduVision is installed. Test URLs:"
echo "  https://localhost/api/health"
echo "  https://localhost/admin/login"
