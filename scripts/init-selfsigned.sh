#!/bin/bash
set -e

# Generates a self-signed wildcard certificate for local testing or first boot.
# In production, replace with a real certificate from Let's Encrypt (see init-ssl.sh).

mkdir -p nginx/ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem \
  -subj "/CN=*.eduvisionschools.co.za/O=EduVision" \
  -addext "subjectAltName = DNS:eduvisionschools.co.za, DNS:*.eduvisionschools.co.za"

echo "Self-signed certificate generated at nginx/ssl/"
echo "Trust cert.pem in your browser/OS for local HTTPS, or replace it with a real cert."
