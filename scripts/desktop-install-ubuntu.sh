#!/bin/bash
set -e

# Install EduVision School Website as a desktop application on Ubuntu.
# Usage: ./scripts/desktop-install-ubuntu.sh

cd "$(dirname "$0")/.."
APP_DIR="$(pwd)"
ICON="$APP_DIR/apps/desktop/assets/icon.png"
LAUNCHER="$APP_DIR/scripts/desktop-start.sh"
DESKTOP_FILE="$HOME/.local/share/applications/eduvision-school-website.desktop"

mkdir -p "$HOME/.local/share/applications"

cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=EduVision School Website
Comment=School website and public portal
Exec=$LAUNCHER
Icon=$ICON
Terminal=false
Categories=Network;Education;
StartupNotify=true
EOF

chmod +x "$DESKTOP_FILE"
chmod +x "$LAUNCHER"

echo "Desktop entry installed: $DESKTOP_FILE"
echo "You can now launch 'EduVision School Website' from the applications menu."
