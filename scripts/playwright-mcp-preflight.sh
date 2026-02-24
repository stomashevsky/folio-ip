#!/usr/bin/env bash
set -euo pipefail

PROFILE_DIR="${HOME}/Library/Caches/ms-playwright/mcp-chrome"
PATTERN="user-data-dir=${PROFILE_DIR}"

if pgrep -f "${PATTERN}" >/dev/null 2>&1; then
  pkill -f "${PATTERN}" || true
  sleep 1
fi

for singleton in SingletonLock SingletonCookie SingletonSocket; do
  singleton_path="${PROFILE_DIR}/${singleton}"
  if [ -L "${singleton_path}" ]; then
    rm -f "${singleton_path}"
  fi
done

echo "Playwright MCP preflight complete"
