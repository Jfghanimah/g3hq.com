#!/bin/bash
set -e
export PATH=/usr/bin:/bin:/usr/local/bin:$PATH

cd /home/joseph/g3hq.com

echo "==> Incrementing build number..."
BUILD=$(( $(cat /home/joseph/g3hq.com/build_number.txt) + 1 ))
echo $BUILD > /home/joseph/g3hq.com/build_number.txt
echo "    Build: v2.1.$BUILD"

echo "==> Pulling latest from main..."
/usr/bin/git pull origin main

echo "==> Installing/updating dependencies..."
venv/bin/pip install -q -r requirements.txt

echo "==> Restarting service..."
sudo /usr/bin/systemctl restart g3hq.service

echo "==> Done. Status:"
systemctl is-active g3hq.service
