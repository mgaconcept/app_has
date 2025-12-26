#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-8080}"
# LAN: escuta na rede toda
npm run dev -- --host 0.0.0.0 --port "$PORT"
