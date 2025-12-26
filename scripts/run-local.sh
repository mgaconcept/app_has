#!/usr/bin/env bash
set -euo pipefail
PORT="${PORT:-8080}"
# Local ONLY: escuta só no 127.0.0.1
npm run dev -- --host 127.0.0.1 --port "$PORT"
