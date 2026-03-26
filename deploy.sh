#!/bin/bash
set -e

cd /home/joseph/g3hq.com

echo "==> Pulling latest from main..."
git pull origin main

echo "==> Installing/updating dependencies..."
venv/bin/pip install -q -r requirements.txt

echo "==> Restarting service..."
sudo systemctl restart g3hq.service

echo "==> Done. Status:"
systemctl is-active g3hq.service
