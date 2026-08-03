# EduVision School Website Platform v1.3.1 — Desktop Packaging Fix

## Overview

This patch release fixes the v1.3.0 desktop `.deb` package so the application launches correctly on Ubuntu.

## What changed

- Changed the Linux `productName` to `EduVision-School-Website` so the `.deb` installs into `/opt/EduVision-School-Website/` (no spaces).
- Set `linux.executableName` to `eduvision-desktop` and `.desktop` `Name` to `EduVision School Website`.
- Rebuilt the `.deb`, `.AppImage` and `.exe` installers for v1.3.1.

## How to install (Ubuntu)

```bash
sudo dpkg -i eduvision-desktop_1.3.1_amd64.deb
sudo apt-get install -f -y
eduvision-desktop
```

Or run the AppImage directly:

```bash
chmod +x "EduVision-School-Website-1.3.1.AppImage"
./"EduVision-School-Website-1.3.1.AppImage"
```

## Windows

Run `EduVision-School-Website-Setup-1.3.1.exe` and launch from the Start Menu or desktop shortcut.

## Notes

- The desktop app still requires Docker and Docker Compose for one-click service startup.
- macOS `.dmg` packaging remains planned for a future release.
